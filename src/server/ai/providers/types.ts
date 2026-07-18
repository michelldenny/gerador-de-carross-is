import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

export interface CarouselGenerationContext {
  systemPrompt: string;
  writerPrompt: string;
  schemaName: string;
  schemaVersion: string;
  responseSchema: unknown;
  parseResponse: (value: unknown) => AICarouselResponse;
  maxOutputTokens: number;
  temperature: number;
  timeoutMs: number;
  signal?: AbortSignal;
}

export interface AIProvider {
  readonly id: string;
  generateCarousel(
    input: GenerateCarouselInput,
    context: CarouselGenerationContext
  ): Promise<AICarouselResponse>;
}
