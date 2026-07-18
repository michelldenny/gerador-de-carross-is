import "server-only";
import type { EditorialMode } from "@/types";
import { loadKnowledgeChunks, type KnowledgeChunk } from "./knowledge-loader";

export interface RetrievedKnowledgeChunk extends KnowledgeChunk {
  score: number;
}

export type KnowledgeOperation = "plan" | "headline" | "write" | "review" | "fix" | "design";

export const RETRIEVAL_VERSION = "lexical-budgeted@1.1.0";

const STOP_WORDS = new Set(["para", "com", "uma", "como", "dos", "das", "que", "por"]);
const SYNONYMS: Record<string, string[]> = {
  odontologia: ["dental", "dente", "bucal", "saude"],
  dental: ["odontologia", "dente", "bucal"],
  marca: ["branding", "negocio", "empresa"],
  creator: ["criador", "conteudo", "influenciador"],
  trabalho: ["carreira", "emprego", "profissao"],
};

function terms(value: string) {
  const base = new Set(
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
  );
  for (const term of [...base]) {
    for (const synonym of SYNONYMS[term] ?? []) base.add(synonym);
  }
  return base;
}

function documentAllowed(operation: KnowledgeOperation, chunk: KnowledgeChunk) {
  if (operation === "headline") return ["brandsdecoded-headlines", "brandsdecoded-editorial-filter", "brandsdecoded-approved-examples"].includes(chunk.documentId);
  if (operation === "review" || operation === "fix") return ["brandsdecoded-editorial-filter", "brandsdecoded-quality-manual"].includes(chunk.documentId);
  if (operation === "design") return chunk.category === "design";
  if (operation === "plan") return chunk.documentId !== "brandsdecoded-design-system";
  return chunk.category !== "design" || chunk.documentId === "brandsdecoded-design-principles";
}

export async function retrieveKnowledge(options: {
  mode: EditorialMode;
  operation: KnowledgeOperation;
  query: string;
  tokenBudget?: number;
  categoryBudgets?: Partial<Record<KnowledgeChunk["category"], number>>;
}): Promise<RetrievedKnowledgeChunk[]> {
  const budget = options.tokenBudget ?? 3_500;
  const categoryBudgets = {
    editorial: Math.floor(budget * 0.65),
    design: Math.floor(budget * 0.2),
    examples: Math.floor(budget * 0.15),
    ...options.categoryBudgets,
  };
  const queryTerms = terms(options.query);
  const chunks = await loadKnowledgeChunks();
  const ranked = chunks
    .filter((chunk) => chunk.modes.includes(options.mode) && documentAllowed(options.operation, chunk))
    .map((chunk) => {
      const chunkTerms = terms(`${chunk.section} ${chunk.content}`);
      const overlap = [...queryTerms].filter((term) => chunkTerms.has(term)).length;
      const criticalBoost = chunk.documentId === "brandsdecoded-editorial-filter" ? 30 : 0;
      return { ...chunk, score: chunk.priority + overlap * 12 + criticalBoost };
    })
    .sort((a, b) => b.score - a.score || a.tokenEstimate - b.tokenEstimate);

  const selected: RetrievedKnowledgeChunk[] = [];
  let used = 0;
  const usedByCategory: Record<KnowledgeChunk["category"], number> = {
    editorial: 0,
    design: 0,
    examples: 0,
  };
  for (const chunk of ranked) {
    if (used + chunk.tokenEstimate > budget) continue;
    if (usedByCategory[chunk.category] + chunk.tokenEstimate > categoryBudgets[chunk.category]) continue;
    selected.push(chunk);
    used += chunk.tokenEstimate;
    usedByCategory[chunk.category] += chunk.tokenEstimate;
  }
  return selected;
}
