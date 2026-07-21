import "server-only";
import { createAdminClient } from "@/utils/supabase/admin";

const DAILY_USD_SPEND_CAP = Number(process.env.DAILY_USD_SPEND_CAP || 5.00);

export async function checkDailyBudgetLimit(): Promise<{
  allowed: boolean;
  currentSpendUsd: number;
  capUsd: number;
}> {
  const supabase = createAdminClient();

  // Início do dia em UTC
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("generation_runs")
    .select("estimated_cost_usd")
    .gte("created_at", startOfDay.toISOString())
    .eq("status", "completed");

  if (error) {
    console.error("[BudgetGuard] Erro ao consultar gastos do dia:", error);
    // Em caso de erro na consulta, permite por segurança operacional, registrando o log
    return { allowed: true, currentSpendUsd: 0, capUsd: DAILY_USD_SPEND_CAP };
  }

  const currentSpendUsd = (data ?? []).reduce(
    (sum, row) => sum + Number(row.estimated_cost_usd || 0),
    0
  );

  return {
    allowed: currentSpendUsd < DAILY_USD_SPEND_CAP,
    currentSpendUsd: Number(currentSpendUsd.toFixed(4)),
    capUsd: DAILY_USD_SPEND_CAP,
  };
}
