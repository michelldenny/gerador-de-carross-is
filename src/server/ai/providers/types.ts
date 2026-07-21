import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

export interface ProviderUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface ProviderGenerationResult {
  carousel: AICarouselResponse;
  usage?: ProviderUsage;
  model: string;
}

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
  ): Promise<ProviderGenerationResult>;
}
