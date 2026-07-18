import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { loadKnowledgeChunks } from "@/server/ai/knowledge/knowledge-loader";
import { retrieveKnowledge } from "@/server/ai/knowledge/knowledge-retriever";
import { generateCarousel } from "@/server/ai/orchestration/generate-carousel";
import type { GenerateCarouselInput } from "@/types";

const editorialInput: GenerateCarouselInput = {
  editorialMode: "editorial",
  title: "Cultura digital",
  theme: "comportamento e cultura digital",
  brandId: "brand-1",
  audience: "Profissionais criativos",
  goal: "educar",
  tone: "editorial",
  slideCount: 9,
  cta: "Leia a análise completa",
  format: "vertical",
  imageOption: "few",
  niche: "Cultura",
};

describe("Base de conhecimento BrandsDecoded", () => {
  it("carrega os seis documentos, verifica hashes e divide por seções", async () => {
    const chunks = await loadKnowledgeChunks();
    const documentIds = new Set(chunks.map((chunk) => chunk.documentId));

    expect(documentIds.size).toBe(6);
    expect(chunks.length).toBeGreaterThan(30);
    expect(chunks.every((chunk) => /^[a-f0-9]{64}$/.test(chunk.contentHash))).toBe(true);
  });

  it("recupera conteúdo real dentro do orçamento", async () => {
    const chunks = await retrieveKnowledge({
      mode: "editorial",
      operation: "write",
      query: "headline estrutura editorial fatos design",
      tokenBudget: 1_200,
    });
    const total = chunks.reduce((sum, chunk) => sum + chunk.tokenEstimate, 0);

    expect(chunks.length).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(1_200);
    expect(chunks.some((chunk) => chunk.content.includes("#"))).toBe(true);
  });

  it("gera nove slides editoriais únicos com dezoito blocos e trace real", async () => {
    const result = await generateCarousel(editorialInput);
    const titles = result.carousel.slides.map((slide) => slide.title);
    const blocks = result.carousel.slides.flatMap((slide) => slide.blocks ?? []);

    expect(result.carousel.slides).toHaveLength(9);
    expect(new Set(titles).size).toBe(9);
    expect(blocks).toHaveLength(18);
    expect(result.trace.retrievedChunks.length).toBeGreaterThan(0);
    expect(result.trace.promptHashes.system).toMatch(/^[a-f0-9]{64}$/);
    expect(result.trace.retrieval.operation).toBe("write");
    expect(result.trace.retrieval.selectedTokenEstimate).toBeLessThanOrEqual(3_500);
    expect(result.validation.valid).toBe(true);
    expect(result.review.approved).toBe(true);
    expect(result.approval.editoriallyApproved).toBe(true);
    expect(result.approval.visuallyApproved).toBe(false);
  });
});
