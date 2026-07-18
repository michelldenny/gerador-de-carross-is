import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { fixCarousel } from "@/server/ai/correction/carousel-fixer";
import { reviewCarousel } from "@/server/ai/review/editorial-reviewer";
import { validateCarousel } from "@/server/ai/validators/carousel-validator";
import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

const input: GenerateCarouselInput = {
  editorialMode: "editorial",
  title: "Teste editorial",
  theme: "cultura",
  brandId: "brand-1",
  audience: "Leitores",
  goal: "educar",
  tone: "editorial",
  slideCount: 9,
  cta: "Leia mais",
  format: "vertical",
  imageOption: "none",
};

function createCarousel(body = "Um corpo editorial específico com contexto suficiente para sustentar a leitura."): AICarouselResponse {
  return {
    projectTitle: "Teste",
    strategy: { objective: "educar", targetAudience: "Leitores", tone: "editorial", mainMessage: "Mensagem" },
    caption: { text: "Legenda editorial", hashtags: [] },
    slides: Array.from({ length: 9 }, (_, index) => ({
      order: index + 1,
      type: index === 0 ? "cover" : index === 8 ? "cta" : "content",
      template: index === 8 ? "cta-brand" : "content-highlight",
      title: `Slide ${index + 1}`,
      body: index === 1 ? body : "Um texto editorial com substância suficiente para manter a densidade da narrativa.",
      cta: index === 8 ? "Leia mais" : undefined,
    })),
  };
}

describe("Revisão e correção editorial", () => {
  it("não acusa claim quando uma evidência válida está ligada ao slide", () => {
    const carousel = createCarousel("O estudo registrou 39% de participação no recorte analisado.");
    carousel.evidence = [{ id: "evidence-1", claim: "Participação de 39%", status: "verified", sourceUrl: "https://example.com/source" }];
    carousel.slides[1].evidenceIds = ["evidence-1"];

    const validation = validateCarousel(input, carousel);
    expect(validation.violations.some((item) => item.code === "FACTUAL_CLAIM_MISSING_EVIDENCE")).toBe(false);
  });

  it("bloqueia claim editorial sem evidência", () => {
    const validation = validateCarousel(input, createCarousel("O estudo registrou 39% de participação."));
    expect(validation.status).toBe("rejected");
    expect(validation.violations.some((item) => item.code === "FACTUAL_CLAIM_MISSING_EVIDENCE")).toBe(true);
  });

  it("corrige padrões conhecidos, registra hashes e aprova após revalidação", () => {
    const carousel = createCarousel("Ao final do dia, e isso muda tudo para a análise editorial.");
    const before = validateCarousel(input, carousel);
    const fixed = fixCarousel(carousel, before, 1);
    const after = validateCarousel(input, fixed.carousel);
    const review = reviewCarousel(input, fixed.carousel, after);

    expect(fixed.corrections.length).toBeGreaterThan(0);
    expect(fixed.corrections[0].previousValueHash).not.toBe(fixed.corrections[0].newValueHash);
    expect(after.valid).toBe(true);
    expect(review.approved).toBe(true);
  });
});
