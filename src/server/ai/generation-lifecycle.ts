import "server-only";
import { createAdminClient } from "@/utils/supabase/admin";
import type { GenerateCarouselInput } from "@/types";

export interface GenerationRun {
  id: string;
  userId: string;
  projectId?: string | null;
  idempotencyKey: string;
  status: "queued" | "running" | "completed" | "rejected" | "failed" | "cancelled";
  provider: string;
  model?: string | null;
  briefing: any;
  output?: any;
  trace?: any;
  validation?: any;
  review?: any;
  corrections?: any;
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
    p_briefing: params.briefing as any,
    p_provider: params.provider ?? "mock",
    p_model: params.model ?? null,
  });

  if (error) {
    if (error.message.includes("insufficient credits")) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    console.error("[Lifecycle] Erro ao reservar créditos:", error);
    throw new Error(`Falha ao reservar créditos: ${error.message}`);
  }

  const row = data as any;
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

  return mapGenerationRunRow(data as any);
}

/**
 * Conclui a geração com sucesso, salvando o output, trace, validação e métricas de consumo de tokens.
 */
export async function completeGenerationRun(params: {
  generationId: string;
  projectId?: string | null;
  output: any;
  trace: any;
  validation: any;
  review: any;
  corrections?: any[];
  promptTokens?: number;
  completionTokens?: number;
  estimatedCostUsd?: number;
}): Promise<GenerationRun> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("complete_generation", {
    p_generation_id: params.generationId,
    p_project_id: params.projectId ?? null,
    p_output: params.output,
    p_trace: params.trace,
    p_validation: params.validation,
    p_review: params.review,
    p_corrections: params.corrections ?? [],
    p_prompt_tokens: params.promptTokens ?? null,
    p_completion_tokens: params.completionTokens ?? null,
    p_estimated_cost_usd: params.estimatedCostUsd ?? null,
  });

  if (error) {
    console.error("[Lifecycle] Erro ao concluir geração:", error);
    throw new Error(`Falha ao finalizar geração: ${error.message}`);
  }

  return mapGenerationRunRow(data as any);
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

  return mapGenerationRunRow(data as any);
}

function mapGenerationRunRow(row: any): GenerationRun {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    idempotencyKey: row.idempotency_key,
    status: row.status,
    provider: row.provider,
    model: row.model,
    briefing: row.briefing,
    output: row.output,
    trace: row.trace,
    validation: row.validation,
    review: row.review,
    corrections: row.corrections,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    estimatedCostUsd: row.estimated_cost_usd ? Number(row.estimated_cost_usd) : null,
    reservedCredits: row.reserved_credits,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
