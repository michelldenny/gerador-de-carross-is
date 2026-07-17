import "server-only";
import type { EditorialMode } from "@/types";
import { loadKnowledgeChunks, type KnowledgeChunk } from "./knowledge-loader";

export interface RetrievedKnowledgeChunk extends KnowledgeChunk {
  score: number;
}

const STOP_WORDS = new Set(["para", "com", "uma", "como", "dos", "das", "que", "por"]);

function terms(value: string) {
  return new Set(
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
  );
}

export async function retrieveKnowledge(options: {
  mode: EditorialMode;
  query: string;
  tokenBudget?: number;
}): Promise<RetrievedKnowledgeChunk[]> {
  const budget = options.tokenBudget ?? 3_500;
  const queryTerms = terms(options.query);
  const chunks = await loadKnowledgeChunks();
  const ranked = chunks
    .filter((chunk) => chunk.modes.includes(options.mode))
    .map((chunk) => {
      const chunkTerms = terms(`${chunk.section} ${chunk.content}`);
      const overlap = [...queryTerms].filter((term) => chunkTerms.has(term)).length;
      const criticalBoost = chunk.documentId === "brandsdecoded-editorial-filter" ? 30 : 0;
      return { ...chunk, score: chunk.priority + overlap * 12 + criticalBoost };
    })
    .sort((a, b) => b.score - a.score || a.tokenEstimate - b.tokenEstimate);

  const selected: RetrievedKnowledgeChunk[] = [];
  let used = 0;
  for (const chunk of ranked) {
    if (used + chunk.tokenEstimate > budget) continue;
    selected.push(chunk);
    used += chunk.tokenEstimate;
  }
  return selected;
}
