import { describe, expect, it } from "vitest";
import { classifyGenerationDelivery } from "@/server/ai/delivery/classify-generation";
import type { GenerateCarouselInput } from "@/types";

const input: GenerateCarouselInput = {
  editorialMode: "editorial", title: "Projeto teste", theme: "Cultura digital", brandId: "brand-1",
  audience: "Profissionais criativos", goal: "educar", tone: "editorial", slideCount: 9,
  cta: "Leia mais", format: "vertical", imageOption: "none",
};

const approved = {
  validation: { valid: true, status: "approved" as const, violations: [] },
  review: {
    approved: true,
    scores: { grammar: 9, fluency: 9, antiAiSlop: 9, facts: 9, structure: 9, density: 9, editorialTone: 9 },
    notes: [],
  },
};

describe("Entrega da geracao", () => {
  it("entrega conteudo aprovado normalmente", () => {
    expect(classifyGenerationDelivery(input, approved)).toBe("approved");
  });

  it("entrega conteudo reprovado como rascunho, sem descartar o carrossel", () => {
    const rejected = {
      ...approved,
      validation: {
        valid: false,
        status: "rejected" as const,
        violations: [{ code: "AI_SLOP_GENERIC", severity: "error" as const, message: "Revisar texto", kind: "deterministic" as const }],
      },
      review: { ...approved.review, approved: false },
    };
    expect(classifyGenerationDelivery(input, rejected)).toBe("draft_needs_review");
  });
});
