import "server-only";
import type { AIProvider } from "./types";
import { mockProvider } from "./mock-provider";

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? "mock";
  if (provider === "mock") return mockProvider;
  throw new Error(`Provedor de IA não configurado: ${provider}`);
}
