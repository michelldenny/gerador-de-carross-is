import "server-only";
import { createAdminClient } from "@/utils/supabase/admin";

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  generationId?: string | null;
  entryType: "grant" | "purchase" | "reservation" | "refund" | "adjustment";
  amount: number;
  balanceAfter: number;
  idempotencyKey?: string | null;
  description?: string | null;
  createdAt: string;
}

export async function getUserCreditBalance(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("credit_balance")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[Ledger] Erro ao buscar saldo do usuário:", error);
    throw new Error("Não foi possível consultar o saldo de créditos");
  }

  return data.credit_balance;
}

export async function getUserLedgerHistory(
  userId: string,
  limit = 20
): Promise<CreditLedgerEntry[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("credit_ledger")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Ledger] Erro ao buscar histórico do ledger:", error);
    throw new Error("Não foi possível consultar o histórico de créditos");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    generationId: row.generation_id,
    entryType: row.entry_type as CreditLedgerEntry["entryType"],
    amount: row.amount,
    balanceAfter: row.balance_after,
    idempotencyKey: row.idempotency_key,
    description: row.description,
    createdAt: row.created_at,
  }));
}
