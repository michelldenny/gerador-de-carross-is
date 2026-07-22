import "server-only";
import { createAdminClient } from "@/utils/supabase/admin";
import type { GenerateCarouselInput } from "@/types";
import type { Database, Json } from "@/types/supabase";

export interface GenerationRun {
  id: string;
  userId: string;
  projectId?: string | null;
  idempotencyKey: string;
  status: "queued" | "running" | "completed" | "rejected" | "failed" | "cancelled";
  provider: string;
  model?: string | null;
  briefing: unknown;
  output?: unknown;
  trace?: unknown;
  validation?: unknown;
  review?: unknown;
  corrections?: unknown;
  promptTokens?: number | null;
  completionTokens?: number | null;
  estimatedCostUsd?: number | null;
  reservedCredits: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cria a run de geração e reserva os créditos de forma atômica e idempotente.
 */
export async function reserveGenerationCredits(params: {
  userId: string;
  idempotencyKey: string;
  credits: number;
  briefing: GenerateCarouselInput;
  provider?: string;
  model?: string;
}): Promise<GenerationRun> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("create_generation_and_reserve_credits", {
    p_user_id: params.userId,
    p_idempotency_key: params.idempotencyKey,
    p_credits: params.credits,
    p_briefing: params.briefing as unknown as Json,
    p_provider: params.provider ?? "mock",
    ...(params.model ? { p_model: params.model } : {}),
  });

  if (error) {
    if (error.message.includes("insufficient credits")) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    console.error("[Lifecycle] Erro ao reservar créditos:", error);
    throw new Error(`Falha ao reservar créditos: ${error.message}`);
  }

  const row = data as Record<string, unknown>;
  return mapGenerationRunRow(row);
}

/**
 * Marca o status da geração como 'running'.
 */
export async function markGenerationRunning(generationId: string): Promise<GenerationRun> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("mark_generation_running", {
    p_generation_id: generationId,
  });

  if (error) {
    console.error("[Lifecycle] Erro ao marcar execução rodando:", error);
    throw new Error(`Falha ao atualizar status da geração: ${error.message}`);
  }

  return mapGenerationRunRow(data as Record<string, unknown>);
}

/**
 * Conclui a geração com sucesso, salvando o output, trace, validação e métricas de consumo de tokens.
 */
export async function completeGenerationRun(params: {
  generationId: string;
  projectId?: string | null;
  output: unknown;
  trace: unknown;
  validation: unknown;
  review: unknown;
  corrections?: unknown[];
  promptTokens?: number;
  completionTokens?: number;
  estimatedCostUsd?: number;
}): Promise<GenerationRun> {
  const supabase = createAdminClient();

  const rpcArgs: Database["public"]["Functions"]["complete_generation"]["Args"] = {
    p_generation_id: params.generationId,
    p_project_id: params.projectId as string,
    p_output: params.output as Json,
    p_trace: params.trace as Json,
    p_validation: params.validation as Json,
    p_review: params.review as Json,
    p_corrections: (params.corrections ?? []) as unknown as Json,
  };
  if (params.promptTokens !== undefined) {
    rpcArgs.p_prompt_tokens = params.promptTokens;
  }
  if (params.completionTokens !== undefined) {
    rpcArgs.p_completion_tokens = params.completionTokens;
  }
  if (params.estimatedCostUsd !== undefined) {
    rpcArgs.p_estimated_cost_usd = params.estimatedCostUsd;
  }

  const { data, error } = await supabase.rpc("complete_generation", rpcArgs);

  if (error) {
    console.error("[Lifecycle] Erro ao concluir geração:", error);
    throw new Error(`Falha ao finalizar geração: ${error.message}`);
  }

  return mapGenerationRunRow(data as Record<string, unknown>);
}

/**
 * Cancela/falha a geração e reembolsa a reserva de créditos de forma atômica.
 */
export async function failGenerationAndRefund(params: {
  generationId: string;
  errorCode: string;
  errorMessage: string;
}): Promise<GenerationRun> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("fail_generation_and_refund", {
    p_generation_id: params.generationId,
    p_error_code: params.errorCode,
    p_error_message: params.errorMessage,
  });

  if (error) {
    console.error("[Lifecycle] Erro ao reembolsar geração:", error);
    throw new Error(`Falha ao estornar créditos: ${error.message}`);
  }

  return mapGenerationRunRow(data as Record<string, unknown>);
}

function mapGenerationRunRow(row: Record<string, unknown>): GenerationRun {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    projectId: row.project_id as string | null,
    idempotencyKey: row.idempotency_key as string,
    status: row.status as GenerationRun["status"],
    provider: row.provider as string,
    model: row.model as string | null,
    briefing: row.briefing,
    output: row.output,
    trace: row.trace,
    validation: row.validation,
    review: row.review,
    corrections: row.corrections,
    promptTokens: row.prompt_tokens as number | null,
    completionTokens: row.completion_tokens as number | null,
    estimatedCostUsd: row.estimated_cost_usd ? Number(row.estimated_cost_usd) : null,
    reservedCredits: row.reserved_credits as number,
    errorCode: row.error_code as string | null,
    errorMessage: row.error_message as string | null,
    startedAt: row.started_at as string | null,
    completedAt: row.completed_at as string | null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
