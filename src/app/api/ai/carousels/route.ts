import { NextResponse } from "next/server";
import type { Json } from "@/types/supabase";
import { generateCarouselInputSchema } from "@/schemas/ai";
import { generateCarousel } from "@/server/ai/orchestration/generate-carousel";
import { getAIProvider } from "@/server/ai/providers/provider-factory";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { classifyGenerationDelivery } from "@/server/ai/delivery/classify-generation";

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
  let userId: string | null = null;
  const testUserIdHeader = request.headers.get("x-test-user-id");
  if (process.env.NODE_ENV === "test" && testUserIdHeader) {
    userId = testUserIdHeader;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  if (!userId) return NextResponse.json({ error: "Autenticação necessária" }, { status: 401 });
  if (isRateLimited(userId)) return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Payload excede o limite permitido" }, { status: 413 });
  }

  let body: unknown;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const parsed = generateCarouselInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Briefing inválido", issues: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const idempotencyKey = request.headers.get("idempotency-key") || crypto.randomUUID();
  const provider = getAIProvider();
  let generationId: string | undefined;
  let projectId: string | undefined;

  let admin;
  try {
    admin = createAdminClient();
  } catch (adminErr) {
    console.error("[AI route] Erro ao criar cliente Admin Supabase:", adminErr);
  }

  try {
    // 1. Tentar reservar créditos via RPC se admin disponível
    if (admin) {
      try {
        const { data: generation, error: reserveError } = await admin.rpc("create_generation_and_reserve_credits", {
          p_user_id: userId,
          p_idempotency_key: idempotencyKey,
          p_credits: generationCost(input),
          p_briefing: json(input),
          p_provider: provider.id,
          p_model: provider.id === "gemini" ? (process.env.GEMINI_MODEL === "gemini-2.5-flash" ? "gemini-3.5-flash-lite" : (process.env.GEMINI_MODEL || "gemini-3.5-flash-lite")) : "mock",
        });
        if (!reserveError && generation) {
          generationId = generation.id;
          if (generation.status === "completed" && generation.output && typeof generation.output === "object") {
            return NextResponse.json({
              idempotent: true,
              ...(generation.output as Record<string, Json>),
              generationId: generation.id,
              projectId: generation.project_id,
            }, { headers: { "Cache-Control": "no-store" } });
          }
        } else if (reserveError) {
          console.warn("[AI route] Aviso na RPC de créditos:", reserveError.message);
        }
      } catch (rpcErr) {
        console.warn("[AI route] Falha ao executar RPC de créditos:", rpcErr);
      }
    }

    // 2. Gerar carrossel via orquestrador de IA
    const result = await generateCarousel(input);
    const deliveryStatus = classifyGenerationDelivery(input, result);

    // 3. Persistir o projeto se admin disponível
    if (admin) {
      try {
        const validBrandId = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(input.brandId) ? input.brandId : null;
        const { data: project, error: projectError } = await admin.from("projects").insert({
          user_id: userId, brand_id: validBrandId, title: result.carousel.projectTitle, theme: input.theme,
          status: deliveryStatus === "approved" ? "generated" : "draft", creation_mode: input.editorialMode, format: input.format,
          width: 1080, height: input.format === "vertical" ? 1350 : input.format === "square" ? 1080 : 1920,
          caption: result.carousel.caption.text, hashtags: result.carousel.caption.hashtags,
          generation_metadata: json({ trace: result.trace, validation: result.validation, review: result.review, corrections: result.corrections, approval: result.approval, deliveryStatus, generatedAt: new Date().toISOString() }),
        }).select("id").single();

        if (project && !projectError) {
          projectId = project.id;
          const styles = { backgroundColor: input.backgroundColor || "#ffffff", textColor: input.primaryColor || "#111827", accentColor: input.accentColor || "#7c3aed", fontFamily: input.editorialMode === "editorial" ? "Barlow Condensed" : (input.fontFamily || "Plus Jakarta Sans"), editorialProfile: input.editorialMode === "editorial", totalSlides: result.carousel.slides.length };
          await admin.from("slides").insert(result.carousel.slides.map((slide) => ({
            project_id: project.id, position: slide.order, type: slide.type, narrative_role: slide.role || null,
            template_id: slide.template, title: slide.title || null, subtitle: slide.subtitle || null,
            body: slide.body || null, highlight: slide.highlight || null, cta: slide.cta || null,
            list_items: slide.listItems || null, blocks: json(slide.blocks || []), styles: json(styles),
          })));

          if (generationId) {
            await admin.rpc("complete_generation", {
              p_generation_id: generationId, p_project_id: project.id, p_output: json(result.carousel),
              p_trace: json(result.trace), p_validation: json(result.validation), p_review: json(result.review),
              p_corrections: json(result.corrections),
            });
          }
        }
      } catch (dbErr) {
        console.warn("[AI route] Não foi possível gravar no banco Supabase remoto:", dbErr);
      }
    }

    return NextResponse.json({ ...result, deliveryStatus, projectId, generationId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: unknown) {
    if (admin) {
      if (projectId) {
        try { await admin.from("projects").delete().eq("id", projectId); } catch { }
      }
      if (generationId) {
        try {
          await admin.rpc("fail_generation_and_refund", {
            p_generation_id: generationId,
            p_error_code: error instanceof Error && "code" in error ? String(error.code) : "GENERATION_FAILED",
            p_error_message: error instanceof Error ? error.message : "Falha desconhecida",
          });
        } catch { }
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Falha ao gerar carrossel";

    console.error("[AI carousel route Error]:", error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
