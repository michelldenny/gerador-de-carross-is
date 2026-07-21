import "server-only";
import type { GenerateCarouselInput } from "@/types";
import type { AIProvider, ProviderGenerationResult, CarouselGenerationContext } from "./types";

const GEMINI_JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    projectTitle: { type: "STRING" },
    strategy: {
      type: "OBJECT",
      properties: {
        objective: { type: "STRING" },
        targetAudience: { type: "STRING" },
        tone: { type: "STRING" },
        mainMessage: { type: "STRING" },
        promise: { type: "STRING" },
      },
      required: ["objective", "targetAudience", "tone", "mainMessage"],
    },
    caption: {
      type: "OBJECT",
      properties: {
        text: { type: "STRING" },
        hashtags: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["text", "hashtags"],
    },
    slides: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          order: { type: "INTEGER" },
          type: {
            type: "STRING",
            enum: ["cover", "content", "comparison", "quote", "cta"],
          },
          template: {
            type: "STRING",
            enum: [
              "cover-image",
              "cover-minimal",
              "content-highlight",
              "content-number",
              "content-list",
              "content-left-image",
              "content-right-image",
              "content-quote",
              "comparison",
              "cta-brand",
            ],
          },
          role: {
            type: "STRING",
            enum: [
              "hook",
              "mechanism",
              "evidence",
              "expansion",
              "application",
              "direction",
              "closing",
              "cta",
            ],
          },
          title: { type: "STRING" },
          subtitle: { type: "STRING" },
          body: { type: "STRING" },
          highlight: { type: "STRING" },
          cta: { type: "STRING" },
          listItems: { type: "ARRAY", items: { type: "STRING" } },
          blocks: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                role: {
                  type: "STRING",
                  enum: ["label", "headline", "body", "evidence", "bridge", "cta"],
                },
                text: { type: "STRING" },
              },
              required: ["id", "role", "text"],
            },
          },
        },
        required: ["order", "type", "template"],
      },
    },
  },
  required: ["projectTitle", "strategy", "caption", "slides"],
};

export class GeminiProvider implements AIProvider {
  readonly id = "gemini";

  async generateCarousel(
    input: GenerateCarouselInput,
    context: CarouselGenerationContext
  ): Promise<ProviderGenerationResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada no ambiente server-side");
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: context.systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: context.writerPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: GEMINI_JSON_SCHEMA,
        temperature: context.temperature,
        maxOutputTokens: context.maxOutputTokens,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: context.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GeminiProvider] Erro na API do Gemini:", response.status, errorText);
      throw new Error(`Erro na chamada da API Gemini (HTTP ${response.status}): ${errorText.substring(0, 300)}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Resposta da API Gemini não contém o formato de texto esperado");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(candidateText);
    } catch {
      throw new Error("Erro ao converter resposta do Gemini para JSON");
    }

    const carousel = context.parseResponse(parsedJson);

    // Contabilidade de tokens e custos
    const usageMetadata = data?.usageMetadata || {};
    const promptTokens = Number(usageMetadata.promptTokenCount || 0);
    const completionTokens = Number(usageMetadata.candidatesTokenCount || 0);
    const totalTokens = Number(usageMetadata.totalTokenCount || promptTokens + completionTokens);

    // gemini-2.5-flash / gemini-2.0-flash pricing: $0.10/1M prompt, $0.40/1M completion
    const promptCost = (promptTokens / 1_000_000) * 0.10;
    const completionCost = (completionTokens / 1_000_000) * 0.40;
    const estimatedCostUsd = Number((promptCost + completionCost).toFixed(6));

    return {
      carousel,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd,
      },
      model,
    };
  }
}

export const geminiProvider = new GeminiProvider();
