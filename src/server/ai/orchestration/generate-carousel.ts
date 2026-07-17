import "server-only";
import type {
  AICarouselResponse,
  GenerateCarouselInput,
  GenerationTrace,
} from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";
import { generateCarouselWithAI as generateMockCarousel } from "@/services/mock-ai-service";
import { selectTemplate } from "../design/template-selector";
import { selectKnowledgeChunkIds } from "../knowledge/rule-selector";
import { validateCarousel } from "../validators/carousel-validator";
import { ACTIVE_AI_VERSIONS } from "../versions/ruleset";

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
  const provider = process.env.AI_PROVIDER ?? "mock";
  if (provider !== "mock") {
    throw new Error(`Provedor de IA não configurado: ${provider}`);
  }

  const generated = await generateMockCarousel(input);
  const carousel = normalizeSlides(input, generated);
  const validation = validateCarousel(input, carousel);
  const trace: GenerationTrace = {
    schemaVersion: ACTIVE_AI_VERSIONS.schema,
    rulesetVersion: ACTIVE_AI_VERSIONS.ruleset,
    validatorVersion: ACTIVE_AI_VERSIONS.validators,
    provider,
    retrievedChunkIds: selectKnowledgeChunkIds(input.editorialMode),
  };

  return { carousel, validation, trace };
}
