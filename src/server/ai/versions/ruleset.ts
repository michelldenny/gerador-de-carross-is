import "server-only";

export const ACTIVE_AI_VERSIONS = {
  schema: "carousel-generation@1.0.0",
  ruleset: "brandsdecoded@1.0.0",
  validators: "editorial-validators@1.0.0",
  prompts: {
    system: "system@1.0.0",
    writer: "writer@1.0.0",
    reviewer: "reviewer@1.0.0",
  },
} as const;

export const KNOWLEDGE_CHUNKS = [
  {
    id: "editorial.anti-ai.core",
    modes: ["quick", "custom", "editorial"],
    categories: ["editorial", "prohibition"],
    source: "brandsdecoded-filtro-editorial@1.0.0",
  },
  {
    id: "editorial.quality.rubric",
    modes: ["editorial"],
    categories: ["review", "quality"],
    source: "brandsdecoded-manual-de-qualidade@1.0.0",
  },
  {
    id: "headlines.patterns",
    modes: ["custom", "editorial"],
    categories: ["headline", "examples"],
    source: "brandsdecoded-banco-de-headlines@1.0.0",
  },
  {
    id: "design.alternating.profile",
    modes: ["editorial"],
    categories: ["design", "layout"],
    source: "brandsdecoded-design-system@1.0.0",
  },
] as const;
