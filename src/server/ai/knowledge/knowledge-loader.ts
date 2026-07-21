import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  KNOWLEDGE_DOCUMENTS,
  type KnowledgeDocumentManifest,
} from "./manifest";

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  documentVersion: string;
  sourcePath: string;
  category: KnowledgeDocumentManifest["category"];
  section: string;
  content: string;
  priority: number;
  tokenEstimate: number;
  contentHash: string;
  modes: KnowledgeDocumentManifest["modes"];
}

let chunkCache: Promise<KnowledgeChunk[]> | undefined;

function sha256(content: string | Buffer) {
  return String(createHash("sha256").update(content).digest("hex"));
}

function chunkDocument(
  document: KnowledgeDocumentManifest,
  content: string
): KnowledgeChunk[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const chunks: KnowledgeChunk[] = [];
  let section = "Introdução";
  let sectionLines: string[] = [];
  let sectionIndex = 0;

  const flush = () => {
    const sectionContent = sectionLines.join("\n").trim();
    if (!sectionContent) return;
    sectionIndex += 1;
    chunks.push({
      id: `${document.id}.section-${sectionIndex}`,
      documentId: document.id,
      documentVersion: document.version,
      sourcePath: document.path,
      category: document.category,
      section,
      content: sectionContent,
      priority: document.priority,
      tokenEstimate: Math.ceil(sectionContent.length / 4),
      contentHash: sha256(sectionContent),
      modes: document.modes,
    });
  };

  for (const line of lines) {
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flush();
      section = heading[1].trim();
      sectionLines = [line];
    } else {
      sectionLines.push(line);
    }
  }
  flush();
  return chunks;
}

async function loadAllKnowledge(): Promise<KnowledgeChunk[]> {
  const loaded = await Promise.all(
    KNOWLEDGE_DOCUMENTS.map(async (document) => {
      try {
        const absolutePath = path.join(process.cwd(), document.path);
        const bytes = await readFile(absolutePath);
        return chunkDocument(document, bytes.toString("utf8"));
      } catch (fileErr) {
        console.warn(
          `[KnowledgeLoader] Arquivo ${document.path} não encontrado no ambiente de execução (${process.cwd()}), ignorando gracioso.`,
          fileErr
        );
        return [];
      }
    })
  );
  return loaded.flat();
}

export function loadKnowledgeChunks(): Promise<KnowledgeChunk[]> {
  if (process.env.NODE_ENV === "development") return loadAllKnowledge();
  chunkCache ??= loadAllKnowledge();
  return chunkCache;
}

export function clearKnowledgeCache() {
  chunkCache = undefined;
}
