import { describe, expect, it, vi, beforeEach } from "vitest";
import type { GenerateCarouselInput } from "@/types";

vi.mock("server-only", () => ({}));

const mockRpc = vi.fn();
const mockFrom = vi.fn().mockImplementation(() => ({
  select: vi.fn().mockReturnValue({
    gte: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));

vi.mock("@/utils/supabase/admin", () => ({
  createAdminClient: () => ({
    rpc: mockRpc,
    from: mockFrom,
  }),
}));

import {
  reserveGenerationCredits,
  markGenerationRunning,
  completeGenerationRun,
  failGenerationAndRefund,
} from "@/server/ai/generation-lifecycle";
import { POST } from "@/app/api/ai/carousels/route";

describe("Ciclo de Vida de Créditos e Geração Segura", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reserva créditos com sucesso via RPC create_generation_and_reserve_credits", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        id: "gen-run-1",
        user_id: "user-1",
        idempotency_key: "idem-key-12345",
        status: "queued",
        provider: "mock",
        briefing: {},
        reserved_credits: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    });

    const run = await reserveGenerationCredits({
      userId: "user-1",
      idempotencyKey: "idem-key-12345",
      credits: 10,
      briefing: {
        editorialMode: "quick",
        title: "Test Title",
        theme: "Test Theme",
        brandId: "brand-1",
        audience: "Audience Test",
        goal: "Goal Test",
        tone: "Tone Test",
        slideCount: 5,
        cta: "CTA Test",
        format: "vertical",
        imageOption: "none",
      },
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "create_generation_and_reserve_credits",
      expect.objectContaining({
        p_user_id: "user-1",
        p_idempotency_key: "idem-key-12345",
        p_credits: 10,
      })
    );
    expect(run.id).toBe("gen-run-1");
    expect(run.status).toBe("queued");
  });

  it("lança erro em caso de saldo insuficiente de créditos", async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: "insufficient credits" },
    });

    await expect(
      reserveGenerationCredits({
        userId: "user-1",
        idempotencyKey: "idem-key-12345",
        credits: 10,
        briefing: {} as unknown as GenerateCarouselInput,
      })
    ).rejects.toThrow("INSUFFICIENT_CREDITS");
  });

  it("marca a geração como rodando via RPC mark_generation_running", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        id: "gen-run-1",
        user_id: "user-1",
        status: "running",
        started_at: new Date().toISOString(),
      },
      error: null,
    });

    const run = await markGenerationRunning("gen-run-1");

    expect(mockRpc).toHaveBeenCalledWith("mark_generation_running", {
      p_generation_id: "gen-run-1",
    });
    expect(run.status).toBe("running");
  });

  it("conclui a geração via RPC complete_generation", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        id: "gen-run-1",
        status: "completed",
        output: { projectTitle: "Sucesso" },
      },
      error: null,
    });

    const run = await completeGenerationRun({
      generationId: "gen-run-1",
      output: { projectTitle: "Sucesso" },
      trace: {},
      validation: { valid: true },
      review: { approved: true },
    });

    expect(mockRpc).toHaveBeenCalledWith("complete_generation", expect.objectContaining({
      p_generation_id: "gen-run-1",
    }));
    expect(run.status).toBe("completed");
  });

  it("reembolsa a geração via RPC fail_generation_and_refund", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        id: "gen-run-1",
        status: "failed",
        error_code: "GENERATION_ERROR",
        error_message: "Erro no provedor",
      },
      error: null,
    });

    const run = await failGenerationAndRefund({
      generationId: "gen-run-1",
      errorCode: "GENERATION_ERROR",
      errorMessage: "Erro no provedor",
    });

    expect(mockRpc).toHaveBeenCalledWith("fail_generation_and_refund", {
      p_generation_id: "gen-run-1",
      p_error_code: "GENERATION_ERROR",
      p_error_message: "Erro no provedor",
    });
    expect(run.status).toBe("failed");
  });

  it("retorna resultado idempotente na rota se a geração já foi concluída", async () => {
    mockRpc.mockResolvedValueOnce({
      data: {
        id: "gen-run-cached",
        user_id: "test-user-123",
        idempotency_key: "idem-key-cached-123",
        status: "completed",
        output: { projectTitle: "Carrossel Salvo Anteriormente" },
        validation: { valid: true },
        review: { approved: true },
        trace: { schemaVersion: "1.0.0" },
      },
      error: null,
    });

    const validPayload = {
      editorialMode: "quick",
      title: "Título de Teste",
      theme: "Tema de Teste",
      brandId: "brand-1",
      audience: "Público Alvo",
      goal: "Engajamento",
      tone: "Profissional",
      slideCount: 5,
      cta: "Comente aqui",
      format: "vertical",
      imageOption: "none",
      idempotencyKey: "idem-key-cached-123",
    };

    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-user-id": "test-user-123",
      },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();

    expect(json.idempotent).toBe(true);
    expect(json.projectTitle).toBe("Carrossel Salvo Anteriormente");
  });
});
