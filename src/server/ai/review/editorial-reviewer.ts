import "server-only";
import type {
  AICarouselResponse,
  CarouselValidationResult,
  EditorialReview,
  GenerateCarouselInput,
} from "@/types";

function scoreForViolations(
  validation: CarouselValidationResult,
  predicate: (code: string) => boolean
) {
  const matching = validation.violations.filter((violation) => predicate(violation.code));
  if (matching.some((violation) => violation.severity === "error")) return 5;
  if (matching.length > 0) return 8;
  return 10;
}

export function reviewCarousel(
  input: GenerateCarouselInput,
  carousel: AICarouselResponse,
  validation: CarouselValidationResult
): EditorialReview {
  const bodyWordCounts = carousel.slides
    .map((slide) => slide.body?.trim().split(/\s+/).filter(Boolean).length ?? 0)
    .filter((count) => count > 0);
  const averageBodyWords = bodyWordCounts.length
    ? bodyWordCounts.reduce((sum, count) => sum + count, 0) / bodyWordCounts.length
    : 0;
  const fragmented = carousel.slides.some((slide) => {
    const body = slide.body?.trim();
    return body ? body.split(/[.!?]+/).filter(Boolean).some((sentence) => sentence.trim().split(/\s+/).length < 4) : false;
  });
  const structuralCodes = new Set(["SLIDE_COUNT_MISMATCH", "INVALID_SLIDE_ORDER", "CTA_NOT_LAST"]);
  const scores = {
    grammar: 9,
    fluency: fragmented ? 7 : 9,
    antiAiSlop: scoreForViolations(validation, (code) => code.startsWith("AI_SLOP_")),
    facts: scoreForViolations(validation, (code) => code.startsWith("FACTUAL_")),
    structure: scoreForViolations(validation, (code) => structuralCodes.has(code)),
    density: input.editorialMode === "editorial" && averageBodyWords < 10 ? 7 : 9,
    editorialTone: scoreForViolations(validation, (code) => code.startsWith("AI_SLOP_")),
  };
  const notes: string[] = [];
  if (fragmented) notes.push("Há frases excessivamente curtas ou fragmentadas.");
  if (scores.density < 8) notes.push("A densidade média dos corpos está abaixo do perfil editorial.");
  if (validation.violations.length) notes.push(...validation.violations.map((violation) => violation.message));
  return {
    approved: Object.values(scores).every((score) => score >= 8),
    scores,
    notes: [...new Set(notes)],
  };
}
