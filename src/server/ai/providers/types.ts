import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

export interface CarouselGenerationContext {
  systemPrompt: string;
  writerPrompt: string;
}

export interface AIProvider {
  readonly id: string;
  generateCarousel(
    input: GenerateCarouselInput,
    context: CarouselGenerationContext
  ): Promise<AICarouselResponse>;
}
