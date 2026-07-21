import "server-only";
import type { AIProvider } from "./types";
import { mockProvider } from "./mock-provider";
import { geminiProvider } from "./gemini-provider";

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("[ProviderFactory] GEMINI_API_KEY ausente. Aplicando fallback gracioso para mockProvider.");
      return mockProvider;
    }
    return geminiProvider;
  }

  if (provider === "mock") {
    return mockProvider;
  }

  throw new Error(`Provedor de IA não reconhecido: ${provider}`);
}
