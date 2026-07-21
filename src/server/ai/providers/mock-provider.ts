import "server-only";
import { generateCarouselWithAI } from "@/services/mock-ai-service";
import { aiCarouselResponseSchema } from "@/schemas";
import type { AICarouselResponse, GenerateCarouselInput } from "@/types";
import { selectTemplate } from "../design/template-selector";
import type { AIProvider, ProviderGenerationResult } from "./types";

function createEditorialCarousel(
  input: GenerateCarouselInput,
  base: AICarouselResponse
): AICarouselResponse {
  const plan = [
    { role: "hook" as const, title: `Investigando ${input.theme}`, body: `Uma leitura editorial sobre as forças que tornaram esse tema relevante para ${input.audience}.` },
    { role: "mechanism" as const, title: "A tensão por trás do fenômeno", body: `O interesse cresce porque comportamento, contexto e expectativa passaram a atuar juntos em torno de ${input.theme}.` },
    { role: "mechanism" as const, title: "Como esse mecanismo se sustenta", body: "O fenômeno ganha força quando hábitos individuais encontram incentivos culturais capazes de ampliar sua circulação." },
    { role: "evidence" as const, title: "O que precisa ser comprovado", body: "A leitura editorial separa observação de evidência e mantém dados específicos fora do texto até que uma fonte confiável os confirme." },
    { role: "expansion" as const, title: "A mudança de perspectiva", body: `O tema ganha outra dimensão quando é observado como parte de uma transformação maior no repertório de ${input.audience}.` },
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
      image: order === 1 ? { required: true, searchTermPt: input.theme, searchTermEn: input.theme, position: "background" as const, overlay: "dark" as const } : undefined,
    };
  });
  return aiCarouselResponseSchema.parse({
    ...base,
    projectTitle: `Editorial: ${input.title}`,
    strategy: { ...base.strategy, mainMessage: `Uma análise editorial sobre ${input.theme}.`, promise: `Explicar por que ${input.theme} merece atenção e como o fenômeno se manifesta.` },
    slides,
  });
}

export const mockProvider: AIProvider = {
  id: "mock",
  async generateCarousel(input, context): Promise<ProviderGenerationResult> {
    const base = await generateCarouselWithAI(input);
    const response = input.editorialMode === "editorial"
      ? createEditorialCarousel(input, base)
      : base;
    const carousel = context.parseResponse(response);
    return {
      carousel,
      usage: {
        promptTokens: 1200,
        completionTokens: 800,
        totalTokens: 2000,
        estimatedCostUsd: 0,
      },
      model: "mock-v1",
    };
  },
};
