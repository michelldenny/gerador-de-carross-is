import "server-only";
import type { EditorialMode } from "@/types";
import { KNOWLEDGE_CHUNKS } from "../versions/ruleset";

export function selectKnowledgeChunkIds(mode: EditorialMode): string[] {
  return KNOWLEDGE_CHUNKS.filter((chunk) =>
    (chunk.modes as readonly string[]).includes(mode)
  ).map((chunk) => chunk.id);
}
