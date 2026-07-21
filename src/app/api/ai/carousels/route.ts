import { NextResponse } from "next/server";
import type { Json } from "@/types/supabase";
import { generateCarouselInputSchema } from "@/schemas/ai";
import { generateCarousel } from "@/server/ai/orchestration/generate-carousel";
import { getAIProvider } from "@/server/ai/providers/provider-factory";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 32_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 5;
const attempts = new Map<string, number[]>();

function json(value: unknown): Json {
  return value as Json;
}

function isRateLimited(userId: string) {
  const now = Date.now();
  const recent = (attempts.get(userId) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(userId, recent);
  return recent.length > RATE_LIMIT;
}

function generationCost(input: { imageSource?: string; imageOption: string; imageCount?: number }) {
  return input.imageSource === "generation" && input.imageOption !== "none"
    ? 10 + (input.imageCount ?? 3)
    : 10;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Autenticacao necessaria" }, { status: 401 });
  if (isRateLimited(user.id)) return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Payload excede o limite permitido" }, { status: 413 });
  }

  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return NextResponse.json({ error: "JSON invalido" }, { status: 400 }); }
  const parsed = generateCarouselInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Briefing invalido", issues: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const input = parsed.data;
  const idempotencyKey = request.headers.get("idempotency-key") || crypto.randomUUID();
  const provider = getAIProvider();
  let generationId: string | undefined;
  let projectId: string | undefined;

  try {
    const { data: generation, error: reserveError } = await admin.rpc("create_generation_and_reserve_credits", {
      p_user_id: user.id,
      p_idempotency_key: idempotencyKey,
      p_credits: generationCost(input),
      p_briefing: json(input),
      p_provider: provider.id,
      p_model: provider.id === "gemini" ? (process.env.GEMINI_MODEL || "gemini-2.5-flash") : "mock",
    });
    if (reserveError || !generation) throw reserveError || new Error("Falha ao reservar creditos");
    generationId = generation.id;

    const result = await generateCarousel(input);
    if (!result.validation.valid || (input.editorialMode === "editorial" && !result.review.approved)) {
      throw Object.assign(new Error("Conteudo reprovado pelos validadores"), { code: "CONTENT_REJECTED", result });
    }

    const validBrandId = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.brandId) ? input.brandId : null;
    const { data: project, error: projectError } = await admin.from("projects").insert({
      user_id: user.id, brand_id: validBrandId, title: result.carousel.projectTitle, theme: input.theme,
      status: "generated", creation_mode: input.editorialMode, format: input.format,
      width: 1080, height: input.format === "vertical" ? 1350 : input.format === "square" ? 1080 : 1920,
      caption: result.carousel.caption.text, hashtags: result.carousel.caption.hashtags,
      generation_metadata: json({ trace: result.trace, validation: result.validation, review: result.review, corrections: result.corrections, approval: result.approval, generatedAt: new Date().toISOString() }),
    }).select("id").single();
    if (projectError || !project) throw projectError || new Error("Falha ao criar projeto");
    projectId = project.id;

    const styles = { backgroundColor: input.backgroundColor || "#ffffff", textColor: input.primaryColor || "#111827", accentColor: input.accentColor || "#7c3aed", fontFamily: input.editorialMode === "editorial" ? "Barlow Condensed" : (input.fontFamily || "Plus Jakarta Sans"), editorialProfile: input.editorialMode === "editorial", totalSlides: result.carousel.slides.length };
    const { error: slidesError } = await admin.from("slides").insert(result.carousel.slides.map((slide) => ({
      project_id: project.id, position: slide.order, type: slide.type, narrative_role: slide.role || null,
      template_id: slide.template, title: slide.title || null, subtitle: slide.subtitle || null,
      body: slide.body || null, highlight: slide.highlight || null, cta: slide.cta || null,
      list_items: slide.listItems || null, blocks: json(slide.blocks || []), styles: json(styles),
    })));
    if (slidesError) throw slidesError;

    if (result.carousel.evidence?.length) {
      const { error: evidenceError } = await admin.from("evidence_sources").insert(result.carousel.evidence.map((item) => ({
        user_id: user.id, project_id: project.id, generation_id: generationId!, claim: item.claim,
        status: item.status, source_title: item.sourceTitle || null, source_url: item.sourceUrl || null,
        publisher: item.publisher || null, publication_date: item.publicationDate || null,
        accessed_at: item.accessedAt || null, metadata: {},
      })));
      if (evidenceError) throw evidenceError;
    }

    const { error: completeError } = await admin.rpc("complete_generation", {
      p_generation_id: generationId, p_project_id: project.id, p_output: json(result.carousel),
      p_trace: json(result.trace), p_validation: json(result.validation), p_review: json(result.review),
      p_corrections: json(result.corrections),
    });
    if (completeError) throw completeError;

    return NextResponse.json({ ...result, projectId: project.id, generationId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (projectId) await admin.from("projects").delete().eq("id", projectId);
    if (generationId) await admin.rpc("fail_generation_and_refund", {
      p_generation_id: generationId,
      p_error_code: error instanceof Error && "code" in error ? String(error.code) : "GENERATION_FAILED",
      p_error_message: error instanceof Error ? error.message : "Falha desconhecida",
    });
    const rejected = error instanceof Error && "code" in error && error.code === "CONTENT_REJECTED";
    if (!rejected) console.error("[AI carousel route]", error);
    return NextResponse.json(
      rejected ? { error: "Conteudo reprovado pelos validadores", ...(error as { result?: object }).result } : { error: "Falha ao gerar carrossel" },
      { status: rejected ? 422 : 500 }
    );
  }
}
