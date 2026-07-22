import type { GenerateCarouselInput, GenerateCarouselResult } from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";

export async function generateCarouselWithAI(
  input: GenerateCarouselInput
): Promise<GenerateCarouselResult> {
  const response = await fetch("/api/ai/carousels", {
    method: "POST",
    // A mesma chave pode ser reutilizada com seguranca caso a requisicao seja repetida.
    // O backend impede uma segunda reserva para a mesma geracao.
    headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as Partial<GenerateCarouselResult> & {
    error?: string;
  };
  if (!response.ok || !payload.carousel) {
    throw new Error(payload.error ?? "Falha ao gerar carrossel");
  }
  return {
    projectId: payload.projectId,
    generationId: payload.generationId,
    deliveryStatus: payload.deliveryStatus,
    carousel: aiCarouselResponseSchema.parse(payload.carousel),
    validation: payload.validation!,
    review: payload.review!,
    corrections: payload.corrections ?? [],
    approval: payload.approval!,
    trace: payload.trace!,
  };
}
