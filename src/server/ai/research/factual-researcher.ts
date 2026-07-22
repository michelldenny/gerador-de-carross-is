import "server-only";
import type { AICarouselResponse } from "@/types";

type GroundingMetadata = {
  groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
  groundingSupports?: Array<{ groundingChunkIndices?: number[] }>;
};
type GroundedResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; groundingMetadata?: GroundingMetadata }>;
};

const FACT_PATTERN = /\b\d+(?:[.,]\d+)?\s*(?:%|milh(?:ao|oes|ão|ões)|bilh(?:ao|oes|ão|ões)|R\$)/i;

export async function researchFactualClaims(carousel: AICarouselResponse) {
  if (process.env.ENABLE_FACT_RESEARCH !== "true" || !process.env.GEMINI_API_KEY) return carousel;
  const model = process.env.GEMINI_RESEARCH_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const next = structuredClone(carousel);
  const candidates = next.slides
    .map((slide) => ({ slide, claim: [slide.title, slide.subtitle, slide.body, slide.highlight].filter(Boolean).find((text) => FACT_PATTERN.test(text!)) }))
    .filter((item): item is { slide: AICarouselResponse["slides"][number]; claim: string } => Boolean(item.claim))
    .slice(0, 3);

  for (const item of candidates) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Verifique esta afirmacao em fontes confiaveis. Responda objetivamente se ela e sustentada e preserve o valor citado: ${item.claim}` }] }],
          tools: [{ google_search: {} }],
        }),
      });
      if (!response.ok) continue;
      const payload = await response.json() as GroundedResponse;
      const metadata = payload.candidates?.[0]?.groundingMetadata;
      const supportedIndices = new Set((metadata?.groundingSupports ?? []).flatMap((support) => support.groundingChunkIndices ?? []));
      const source = (metadata?.groundingChunks ?? []).find((chunk, index) => supportedIndices.has(index) && chunk.web?.uri);
      if (!source?.web?.uri) continue;
      const id = crypto.randomUUID();
      next.evidence = [...(next.evidence ?? []), {
        id, claim: item.claim, status: "verified", sourceTitle: source.web.title || "Fonte encontrada pelo Google Search",
        sourceUrl: source.web.uri, accessedAt: new Date().toISOString(),
      }];
      item.slide.evidenceIds = [...(item.slide.evidenceIds ?? []), id];
    } catch {
      // Pesquisa e melhoria de qualidade; indisponibilidade mantem a claim como nao verificada.
    }
  }
  return next;
}
