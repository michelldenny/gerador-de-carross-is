import "server-only";
import type {
  AICarouselResponse,
  GenerateCarouselInput,
  GenerationTrace,
} from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";
import { selectTemplate } from "../design/template-selector";
import { RETRIEVAL_VERSION, retrieveKnowledge } from "../knowledge/knowledge-retriever";
import { validateCarousel } from "../validators/carousel-validator";
import { ACTIVE_AI_VERSIONS } from "../versions/ruleset";
import { buildGenerationPrompt } from "../prompts/prompt-builder";
import { getAIProvider } from "../providers/provider-factory";
import { reviewCarousel } from "../review/editorial-reviewer";
import { fixCarousel } from "../correction/carousel-fixer";

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
    operation: "write",
    query: [input.theme, input.niche, input.goal, input.tone, input.visualStyle]
      .filter(Boolean)
      .join(" "),
  });
  const prompts = buildGenerationPrompt(input, retrievedChunks);
  const provider = getAIProvider();
  const generated = await provider.generateCarousel(input, {
    systemPrompt: prompts.system,
    writerPrompt: prompts.writer,
    schemaName: "carousel_response",
    schemaVersion: ACTIVE_AI_VERSIONS.schema,
    responseSchema: aiCarouselResponseSchema,
    parseResponse: (value) => aiCarouselResponseSchema.parse(value),
    maxOutputTokens: input.editorialMode === "editorial" ? 8_000 : 5_000,
    temperature: input.editorialMode === "editorial" ? 0.6 : 0.7,
    timeoutMs: 45_000,
    signal: AbortSignal.timeout(45_000),
  });
  let carousel = input.editorialMode === "editorial"
    ? aiCarouselResponseSchema.parse(generated)
    : normalizeSlides(input, generated);
  let validation = validateCarousel(input, carousel);
  const corrections = [];
  for (let attempt = 1; attempt <= 2 && !validation.valid; attempt += 1) {
    const fixed = fixCarousel(carousel, validation, attempt);
    if (fixed.corrections.length === 0) break;
    carousel = aiCarouselResponseSchema.parse(fixed.carousel);
    corrections.push(...fixed.corrections);
    validation = validateCarousel(input, carousel);
  }
  const review = reviewCarousel(input, carousel, validation);
  const hasMissingEvidence = validation.violations.some(
    (violation) => violation.code === "FACTUAL_CLAIM_MISSING_EVIDENCE"
  );
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
    retrieval: {
      version: RETRIEVAL_VERSION,
      operation: "write",
      tokenBudget: 3_500,
      selectedTokenEstimate: retrievedChunks.reduce((sum, chunk) => sum + chunk.tokenEstimate, 0),
      selectedCount: retrievedChunks.length,
    },
  };

  return {
    carousel,
    validation,
    review,
    corrections,
    approval: {
      schemaValid: true,
      deterministicallyValid: validation.valid,
      factuallyVerified: !hasMissingEvidence,
      editoriallyApproved: review.approved,
      visuallyApproved: false,
    },
    trace,
  };
}
