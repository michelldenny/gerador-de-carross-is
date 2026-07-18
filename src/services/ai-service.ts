import type { GenerateCarouselInput, GenerateCarouselResult } from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";

export async function generateCarouselWithAI(
  input: GenerateCarouselInput
): Promise<GenerateCarouselResult> {
  const response = await fetch("/api/ai/carousels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as Partial<GenerateCarouselResult> & {
    error?: string;
  };
  if (!response.ok || !payload.carousel) {
    throw new Error(payload.error ?? "Falha ao gerar carrossel");
  }
  return {
    carousel: aiCarouselResponseSchema.parse(payload.carousel),
    validation: payload.validation!,
    review: payload.review!,
    corrections: payload.corrections ?? [],
    approval: payload.approval!,
    trace: payload.trace!,
  };
}
