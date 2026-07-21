import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateCarouselInputSchema } from "@/schemas/ai";
import { generateCarousel } from "@/server/ai/orchestration/generate-carousel";
import { createClient } from "@/utils/supabase/server";
import {
  reserveGenerationCredits,
  markGenerationRunning,
  completeGenerationRun,
  failGenerationAndRefund,
} from "@/server/ai/generation-lifecycle";
import { getAIProvider } from "@/server/ai/providers/provider-factory";
import { checkRateLimit } from "@/server/ai/security/rate-limiter";
import { checkDailyBudgetLimit } from "@/server/ai/security/budget-guard";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 32_000;
const CREDIT_COST_PER_GENERATION = 10;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Payload excede o limite permitido" }, { status: 413 });
  }

  // 1. Verificação de Autenticação
  let userId: string | undefined;

  // Em ambiente de teste ou dev com header mock
  const testUserIdHeader = request.headers.get("x-test-user-id");
  if (process.env.NODE_ENV === "test" && testUserIdHeader) {
    userId = testUserIdHeader;
  } else {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
      }
    } catch {
      // Falha na sessão Supabase
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Autenticação necessária para gerar carrosséis" },
      { status: 401 }
    );
  }

  // 2. Proteção de Rate Limiting
  const rateCheck = checkRateLimit(userId);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Limite de requisições excedido. Aguarde antes de tentar novamente." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  // 3. Proteção de Teto Orçamentário Financeiro
  const budgetCheck = await checkDailyBudgetLimit();
  if (!budgetCheck.allowed) {
    return NextResponse.json(
      { error: "Limite orçamentário diário atingido. Tente novamente amanhã." },
      { status: 429 }
    );
  }

  // 4. Parsing do Payload
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

  // 5. Chave de Idempotência
  const headerIdempotency = request.headers.get("x-idempotency-key");
  const bodyIdempotency = parsed.data.idempotencyKey;

  let idempotencyKey = headerIdempotency || bodyIdempotency;
  if (!idempotencyKey || idempotencyKey.length < 8) {
    const rawContent = JSON.stringify({ userId, briefing: parsed.data });
    idempotencyKey = "gen_" + crypto.createHash("sha256").update(rawContent).digest("hex").substring(0, 24);
  }

  const provider = getAIProvider();

  // 6. Reserva Atômica de Créditos e Registro em generation_runs
  let run;
  try {
    run = await reserveGenerationCredits({
      userId,
      idempotencyKey,
      credits: CREDIT_COST_PER_GENERATION,
      briefing: parsed.data,
      provider: provider.id,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage === "INSUFFICIENT_CREDITS") {
      return NextResponse.json(
        { error: "Saldo de créditos insuficiente" },
        { status: 402 }
      );
    }
    console.error("[AI carousel route] Erro na reserva de créditos:", error);
    return NextResponse.json({ error: "Erro ao processar saldo de créditos" }, { status: 500 });
  }

  // Se a requisição já havia sido concluída anteriormente (Idempotência)
  if (run.status === "completed" && run.output) {
    const cachedOutput = run.output as Record<string, unknown>;
    return NextResponse.json(
      {
        ...cachedOutput,
        validation: run.validation,
        review: run.review,
        corrections: run.corrections,
        trace: run.trace,
        idempotent: true,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // 7. Atualizar status para 'running'
  try {
    await markGenerationRunning(run.id);
  } catch (err) {
    console.warn("[AI carousel route] Não foi possível atualizar para running:", err);
  }

  // 8. Execução do Pipeline de IA
  try {
    const result = await generateCarousel(parsed.data);

    if (
      !result.validation.valid ||
      (parsed.data.editorialMode === "editorial" && !result.review.approved)
    ) {
      // Se reprovado na validação severa, estorna créditos
      await failGenerationAndRefund({
        generationId: run.id,
        errorCode: "VALIDATION_FAILED",
        errorMessage: "Conteúdo reprovado pelos validadores de qualidade",
      });

      return NextResponse.json(
        { error: "Conteúdo reprovado pelos validadores", ...result },
        { status: 422 }
      );
    }

    // Marca como concluído no banco de dados e registra a execução com tokens e custo USD
    await completeGenerationRun({
      generationId: run.id,
      output: result.carousel,
      trace: result.trace,
      validation: result.validation,
      review: result.review,
      corrections: result.corrections,
      promptTokens: result.usage?.promptTokens,
      completionTokens: result.usage?.completionTokens,
      estimatedCostUsd: result.usage?.estimatedCostUsd,
    });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    console.error("[AI carousel route] Erro ao gerar carrossel:", error);

    const errMessage = error instanceof Error ? error.message : String(error);

    // Reembolso atômico em caso de exceção na geração
    try {
      await failGenerationAndRefund({
        generationId: run.id,
        errorCode: "GENERATION_ERROR",
        errorMessage: errMessage,
      });
    } catch (refundErr) {
      console.error("[AI carousel route] Erro ao executar reembolso:", refundErr);
    }

    return NextResponse.json({ error: "Falha ao gerar carrossel" }, { status: 500 });
  }
}
