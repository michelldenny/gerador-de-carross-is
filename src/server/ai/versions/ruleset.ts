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
