import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) } }),
}));

import { POST } from "@/app/api/ai/carousels/route";

describe("Rota server-side de geração", () => {
  it("rejeita briefing inválido antes de chamar o provider", async () => {
    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Oi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejeita payload real acima do limite", async () => {
    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "x".repeat(32_001) }),
    });
    const response = await POST(request);
    expect(response.status).toBe(413);
  });
});
