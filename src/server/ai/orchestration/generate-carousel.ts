import "server-only";
import type {
  AICarouselResponse,
  GenerateCarouselInput,
  GenerationTrace,
} from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";
import { selectTemplate } from "../design/template-selector";
import { retrieveKnowledge } from "../knowledge/knowledge-retriever";
import { validateCarousel } from "../validators/carousel-validator";
import { ACTIVE_AI_VERSIONS } from "../versions/ruleset";
import { buildGenerationPrompt } from "../prompts/prompt-builder";
import { getAIProvider } from "../providers/provider-factory";

function createEditorialMock(
  input: GenerateCarouselInput,
  base: AICarouselResponse
): AICarouselResponse {
  const plan = [
    { role: "hook" as const, title: `Investigando ${input.theme}`, body: `Uma leitura editorial sobre as forças que tornaram esse tema relevante para ${input.audience}.` },
    { role: "mechanism" as const, title: "A tensão por trás do fenômeno", body: `O interesse cresce porque comportamento, contexto e expectativa passaram a atuar juntos em torno de ${input.theme}.` },
    { role: "mechanism" as const, title: "Como esse mecanismo se sustenta", body: "O fenômeno ganha força quando hábitos individuais encontram incentivos culturais capazes de ampliar sua circulação." },
    { role: "evidence" as const, title: "O que precisa ser comprovado", body: "A leitura editorial separa observação de evidência e mantém dados específicos fora do texto até que uma fonte confiável os confirme." },
    { role: "expansion" as const, title: "A mudança de perspectiva", body: `O tema deixa de parecer isolado quando é observado como parte de uma transformação maior no repertório de ${input.audience}.` },
    { role: "application" as const, title: "Onde isso aparece na prática", body: `Marcas e profissionais podem reconhecer essa mudança nas escolhas cotidianas ligadas a ${input.theme}, sem recorrer a fórmulas genéricas.` },
    { role: "direction" as const, title: "A direção editorial", body: `O conteúdo ganha consistência quando ${input.goal} orienta a seleção de exemplos, linguagem e ritmo narrativo.` },
    { role: "closing" as const, title: "O ponto de chegada", body: `A relevância de ${input.theme} está na capacidade de revelar uma mudança cultural que já influencia decisões concretas.` },
    { role: "cta" as const, title: "Transforme análise em direção", body: "A próxima etapa conecta essa leitura à proposta da marca com clareza editorial.", cta: input.cta },
  ];

  const slides = plan.map((item, index) => {
    const order = index + 1;
    const selected = selectTemplate("editorial", order, plan.length, "content-highlight");
    return {
      order,
      type: selected.type,
      template: selected.template,
      role: item.role,
      title: item.title,
      subtitle: order === 1 ? input.niche || "ANÁLISE EDITORIAL" : item.role.toUpperCase(),
      body: item.body,
      cta: item.cta,
      blocks: [
        { id: `block-${order * 2 - 1}`, role: "label" as const, text: order === 1 ? "O FENÔMENO" : item.role.toUpperCase() },
        { id: `block-${order * 2}`, role: item.role === "cta" ? "cta" as const : "body" as const, text: item.cta || item.body },
      ],
      image: order === 1 ? {
        required: true,
        searchTermPt: input.theme,
        searchTermEn: input.theme,
        position: "background" as const,
        overlay: "dark" as const,
      } : undefined,
    };
  });

  return aiCarouselResponseSchema.parse({
    ...base,
    projectTitle: `Editorial: ${input.title}`,
    strategy: {
      ...base.strategy,
      mainMessage: `Uma análise editorial sobre ${input.theme}.`,
      promise: `Explicar por que ${input.theme} merece atenção e como o fenômeno se manifesta.`,
    },
    slides,
  });
}

function normalizeSlides(
  input: GenerateCarouselInput,
  response: AICarouselResponse
): AICarouselResponse {
  const targetCount = input.editorialMode === "quick" ? 5 : input.slideCount;
  const sourceContent = response.slides.filter((slide) => slide.type !== "cta");
  const sourceCta = response.slides.find((slide) => slide.type === "cta") ?? response.slides.at(-1)!;
  const slides = Array.from({ length: targetCount }, (_, index) => {
    const order = index + 1;
    const source = order === targetCount
      ? sourceCta
      : sourceContent[Math.min(index, sourceContent.length - 1)];
    const selected = selectTemplate(
      input.editorialMode,
      order,
      targetCount,
      source.template
    );
    return {
      ...source,
      order,
      type: selected.type,
      template: selected.template,
      title: order === targetCount ? sourceCta.title : source.title,
      cta: order === targetCount ? input.cta : undefined,
    };
  });
  return aiCarouselResponseSchema.parse({ ...response, slides });
}

export async function generateCarousel(input: GenerateCarouselInput) {
  const retrievedChunks = await retrieveKnowledge({
    mode: input.editorialMode,
    query: [input.theme, input.niche, input.goal, input.tone, input.visualStyle]
      .filter(Boolean)
      .join(" "),
  });
  const prompts = buildGenerationPrompt(input, retrievedChunks);
  const provider = getAIProvider();
  const generated = await provider.generateCarousel(input, {
    systemPrompt: prompts.system,
    writerPrompt: prompts.writer,
  });
  const carousel = input.editorialMode === "editorial"
    ? createEditorialMock(input, generated)
    : normalizeSlides(input, generated);
  const validation = validateCarousel(input, carousel);
  const trace: GenerationTrace = {
    schemaVersion: ACTIVE_AI_VERSIONS.schema,
    rulesetVersion: ACTIVE_AI_VERSIONS.ruleset,
    validatorVersion: ACTIVE_AI_VERSIONS.validators,
    provider: provider.id,
    promptHashes: prompts.hashes,
    retrievedChunkIds: retrievedChunks.map((chunk) => chunk.id),
    retrievedChunks: retrievedChunks.map((chunk) => ({
      id: chunk.id,
      documentId: chunk.documentId,
      section: chunk.section,
      contentHash: chunk.contentHash,
      tokenEstimate: chunk.tokenEstimate,
    })),
  };

  return { carousel, validation, trace };
}
