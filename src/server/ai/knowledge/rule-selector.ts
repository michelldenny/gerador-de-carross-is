import "server-only";
import type { EditorialMode } from "@/types";
import { KNOWLEDGE_DOCUMENTS } from "./manifest";

export function selectKnowledgeChunkIds(mode: EditorialMode): string[] {
  return KNOWLEDGE_DOCUMENTS.filter((doc) =>
    (doc.modes as readonly string[]).includes(mode)
  ).map((doc) => doc.id);
}
