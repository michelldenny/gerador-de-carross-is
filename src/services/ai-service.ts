import type { AICarouselResponse, GenerateCarouselInput, GenerationTrace } from "@/types";
import type { CarouselValidationResult } from "@/server/ai/validators/carousel-validator";
import { aiCarouselResponseSchema } from "@/schemas";

interface GenerateCarouselApiResponse {
  carousel: AICarouselResponse;
  validation: CarouselValidationResult;
  trace: GenerationTrace;
}

export async function generateCarouselWithAI(
  input: GenerateCarouselInput
): Promise<AICarouselResponse> {
  const response = await fetch("/api/ai/carousels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as Partial<GenerateCarouselApiResponse> & {
    error?: string;
  };
  if (!response.ok || !payload.carousel) {
    throw new Error(payload.error ?? "Falha ao gerar carrossel");
  }
  return aiCarouselResponseSchema.parse(payload.carousel);
}
