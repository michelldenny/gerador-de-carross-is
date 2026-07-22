import type { GenerateCarouselInput, GenerateCarouselResult } from "@/types";

export type GenerationDeliveryStatus = "approved" | "draft_needs_review";

export function classifyGenerationDelivery(
  input: GenerateCarouselInput,
  result: Pick<GenerateCarouselResult, "validation" | "review">
): GenerationDeliveryStatus {
  const editorialReviewFailed = input.editorialMode === "editorial" && !result.review.approved;
  return !result.validation.valid || editorialReviewFailed ? "draft_needs_review" : "approved";
}
