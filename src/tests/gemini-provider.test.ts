import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { geminiProvider } from "@/server/ai/providers/gemini-provider";
import type { GenerateCarouselInput } from "@/types";

const input: GenerateCarouselInput = {
  editorialMode: "quick", title: "Projeto teste", theme: "Cultura digital", brandId: "brand-1",
  audience: "Profissionais criativos", goal: "educar", tone: "editorial", slideCount: 5,
  cta: "Leia mais", format: "vertical", imageOption: "none",
};

describe("Gemini provider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  it("envia prompts no servidor, exige JSON estruturado e valida a resposta", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const carousel = {
      projectTitle: "Teste", strategy: { objective: "educar", targetAudience: "Criativos", tone: "editorial", mainMessage: "Mensagem" },
      caption: { text: "Legenda", hashtags: [] }, slides: [],
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(carousel) }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const result = await geminiProvider.generateCarousel(input, {
      systemPrompt: "sistema", writerPrompt: "briefing", schemaName: "carousel_response", schemaVersion: "1",
      responseSchema: {}, parseResponse: (value) => value as typeof carousel, maxOutputTokens: 1000,
      temperature: 0.5, timeoutMs: 1000,
    });
    expect(result.projectTitle).toBe("Teste");
    const request = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(request.systemInstruction.parts[0].text).toBe("sistema");
    expect(request.generationConfig.responseMimeType).toBe("application/json");
    expect(request.generationConfig.responseJsonSchema).toBeTruthy();
  });
});
