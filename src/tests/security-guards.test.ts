import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockFrom = vi.fn();
vi.mock("@/utils/supabase/admin", () => ({
  createAdminClient: () => ({
    from: mockFrom,
  }),
}));

import { checkRateLimit, resetRateLimiterForTesting } from "@/server/ai/security/rate-limiter";
import { checkDailyBudgetLimit } from "@/server/ai/security/budget-guard";

describe("Travas de Segurança: Rate Limiter & Budget Guard", () => {
  beforeEach(() => {
    resetRateLimiterForTesting();
    vi.clearAllMocks();
  });

  it("permite até o limite máximo de requisições por minuto e bloqueia requisições excedentes", () => {
    const userId = "user-test-rate";

    // 5 requisições permitidas
    for (let i = 0; i < 5; i++) {
      const check = checkRateLimit(userId);
      expect(check.success).toBe(true);
    }

    // A 6ª requisição deve ser bloqueada com 429 / success=false
    const blocked = checkRateLimit(userId);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("bloqueia chamadas quando o teto orçamentário financeiro diário é atingido", async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({
        gte: () => ({
          eq: async () => ({
            data: [
              { estimated_cost_usd: 3.50 },
              { estimated_cost_usd: 2.00 },
            ],
            error: null,
          }),
        }),
      }),
    });

    const budget = await checkDailyBudgetLimit();
    expect(budget.currentSpendUsd).toBe(5.50);
    expect(budget.allowed).toBe(false);
  });

  it("permite chamadas quando o teto orçamentário financeiro está abaixo do limite", async () => {
    mockFrom.mockReturnValueOnce({
      select: () => ({
        gte: () => ({
          eq: async () => ({
            data: [
              { estimated_cost_usd: 0.10 },
            ],
            error: null,
          }),
        }),
      }),
    });

    const budget = await checkDailyBudgetLimit();
    expect(budget.currentSpendUsd).toBe(0.10);
    expect(budget.allowed).toBe(true);
  });
});
