import { NextResponse } from "next/server";
import { generateCarouselInputSchema } from "@/schemas/ai";
import { generateCarousel } from "@/server/ai/orchestration/generate-carousel";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 32_000;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Payload excede o limite permitido" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = generateCarouselInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Briefing inválido", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await generateCarousel(parsed.data);
    if (
      !result.validation.valid ||
      (parsed.data.editorialMode === "editorial" && !result.review.approved)
    ) {
      return NextResponse.json(
        { error: "Conteúdo reprovado pelos validadores", ...result },
        { status: 422 }
      );
    }
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[AI carousel route]", error);
    return NextResponse.json({ error: "Falha ao gerar carrossel" }, { status: 500 });
  }
}
