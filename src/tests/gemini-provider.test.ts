import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

import type { AICarouselResponse } from "@/types";
import { geminiProvider } from "@/server/ai/providers/gemini-provider";
import { getAIProvider } from "@/server/ai/providers/provider-factory";

const globalFetch = global.fetch;

describe("Gemini AI Provider & Factory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_PROVIDER;
  });

  it("retorna mockProvider por padrão ou quando GEMINI_API_KEY está ausente (fallback)", () => {
    process.env.AI_PROVIDER = "gemini";
    delete process.env.GEMINI_API_KEY;

    const provider = getAIProvider();
    expect(provider.id).toBe("mock");
  });

  it("retorna geminiProvider quando AI_PROVIDER=gemini e a chave está presente", () => {
    process.env.AI_PROVIDER = "gemini";
    process.env.GEMINI_API_KEY = "test-api-key";

    const provider = getAIProvider();
    expect(provider.id).toBe("gemini");
  });

  it("chama a API REST do Gemini e retorna o resultado estruturado com tokens e custo USD", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  projectTitle: "Test Project",
                  strategy: {
                    objective: "Test Obj",
                    targetAudience: "Test Audience",
                    tone: "Test Tone",
                    mainMessage: "Test Message",
                  },
                  caption: { text: "Caption test", hashtags: ["#test"] },
                  slides: [
                    { order: 1, type: "cover", template: "cover-minimal", title: "Slide 1" },
                  ],
                }),
              },
            ],
          },
        },
      ],
      usageMetadata: {
        promptTokenCount: 1000,
        candidatesTokenCount: 500,
        totalTokenCount: 1500,
      },
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    }) as unknown as typeof fetch;

    const mockParseResponse = vi.fn((val) => val as unknown as AICarouselResponse);

    const result = await geminiProvider.generateCarousel(
      {
        editorialMode: "quick",
        title: "Test",
        theme: "Test",
        brandId: "brand-1",
        audience: "Audience",
        goal: "Goal",
        tone: "Tone",
        slideCount: 5,
        cta: "CTA",
        format: "vertical",
        imageOption: "none",
      },
      {
        systemPrompt: "System prompt test",
        writerPrompt: "Writer prompt test",
        schemaName: "carousel_response",
        schemaVersion: "1.0",
        responseSchema: {},
        parseResponse: mockParseResponse,
        maxOutputTokens: 5000,
        temperature: 0.7,
        timeoutMs: 10000,
      }
    );

    expect(result.carousel.projectTitle).toBe("Test Project");
    expect(result.usage).toBeDefined();
    expect(result.usage?.promptTokens).toBe(1000);
    expect(result.usage?.completionTokens).toBe(500);
    // Cost: 1000/1M * 0.10 + 500/1M * 0.40 = 0.00010 + 0.00020 = 0.000300
    expect(result.usage?.estimatedCostUsd).toBe(0.0003);

    global.fetch = globalFetch;
  });
});
