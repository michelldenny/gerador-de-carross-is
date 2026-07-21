import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { POST } from "@/app/api/ai/carousels/route";

describe("Rota server-side de geração", () => {
  it("rejeita requisições não autenticadas", async () => {
    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Oi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("rejeita payload declarado acima do limite", async () => {
    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "32001" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(413);
  });

  it("rejeita briefing inválido quando autenticado", async () => {
    const request = new Request("http://localhost/api/ai/carousels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-user-id": "test-user-123",
      },
      body: JSON.stringify({ title: "Oi" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
