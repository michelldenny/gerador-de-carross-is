import { describe, expect, it } from "vitest";
import { generateCarouselInputSchema } from "@/schemas/ai";
import { selectTemplate } from "@/server/ai/design/template-selector";
import { validateCarousel } from "@/server/ai/validators/carousel-validator";
import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

const baseInput: GenerateCarouselInput = {
  editorialMode: "quick",
  title: "Projeto de teste",
  theme: "Cultura digital",
  brandId: "brand-1",
  audience: "Profissionais criativos",
  goal: "educar",
  tone: "editorial",
  slideCount: 5,
  cta: "Leia a análise completa",
  format: "vertical",
  imageOption: "few",
};

function carousel(count: number, forbiddenText?: string): AICarouselResponse {
  return {
    projectTitle: "Projeto de teste",
    strategy: {
      objective: "educar",
      targetAudience: "Profissionais criativos",
      tone: "editorial",
      mainMessage: "Uma análise específica",
    },
    caption: { text: "Legenda", hashtags: [] },
    slides: Array.from({ length: count }, (_, index) => ({
      order: index + 1,
      type: index === 0 ? "cover" : index === count - 1 ? "cta" : "content",
      template: index === count - 1 ? "cta-brand" : "content-highlight",
      title: index === 1 && forbiddenText ? forbiddenText : `Slide ${index + 1}`,
      cta: index === count - 1 ? "Leia mais" : undefined,
    })),
  };
}

describe("Pipeline editorial", () => {
  it("rejeita configuração editorial fora de nove slides verticais", () => {
    const result = generateCarouselInputSchema.safeParse({
      ...baseInput,
      editorialMode: "editorial",
      slideCount: 7,
      format: "square",
    });
    expect(result.success).toBe(false);
  });

  it("trata anti-slop como aviso no modo rápido", () => {
    const result = validateCarousel(
      baseInput,
      carousel(5, "Não é tendência, é transformação")
    );
    expect(result.valid).toBe(true);
    expect(result.violations[0]?.severity).toBe("warning");
  });

  it("reprova o mesmo anti-slop no modo editorial", () => {
    const input = { ...baseInput, editorialMode: "editorial", slideCount: 9 } as const;
    const result = validateCarousel(input, carousel(9, "Não é tendência, é transformação"));
    expect(result.valid).toBe(false);
    expect(result.violations.some((violation) => violation.code === "AI_SLOP_BINARY")).toBe(true);
  });

  it("reserva capa e CTA no perfil visual editorial", () => {
    expect(selectTemplate("editorial", 1, 9, "cover-minimal")).toEqual({
      template: "cover-image",
      type: "cover",
    });
    expect(selectTemplate("editorial", 9, 9, "content-list")).toEqual({
      template: "cta-brand",
      type: "cta",
    });
  });
});
