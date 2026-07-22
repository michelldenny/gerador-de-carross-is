import "server-only";

const slideTypes = ["cover", "content", "comparison", "quote", "cta"];
const templates = ["cover-image", "cover-minimal", "content-highlight", "content-number", "content-list", "content-left-image", "content-right-image", "content-quote", "comparison", "cta-brand"];

export const carouselJsonSchema = {
  type: "object",
  properties: {
    projectTitle: { type: "string" },
    strategy: {
      type: "object",
      properties: {
        objective: { type: "string" }, targetAudience: { type: "string" }, tone: { type: "string" }, mainMessage: { type: "string" }, promise: { type: "string" },
      },
      required: ["objective", "targetAudience", "tone", "mainMessage"],
    },
    caption: {
      type: "object",
      properties: { text: { type: "string" }, hashtags: { type: "array", items: { type: "string" } } },
      required: ["text", "hashtags"],
    },
    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, claim: { type: "string" }, status: { type: "string", enum: ["verified", "unverified", "user-provided"] }, sourceTitle: { type: "string" }, sourceUrl: { type: "string" }, publisher: { type: "string" }, publicationDate: { type: "string" }, accessedAt: { type: "string" } },
        required: ["id", "claim", "status"],
      },
    },
    slides: {
      type: "array",
      items: {
        type: "object",
        properties: {
          order: { type: "integer" }, type: { type: "string", enum: slideTypes }, template: { type: "string", enum: templates },
          role: { type: "string", enum: ["hook", "mechanism", "evidence", "expansion", "application", "direction", "closing", "cta"] },
          title: { type: "string" }, subtitle: { type: "string" }, body: { type: "string" }, highlight: { type: "string" }, cta: { type: "string" },
          listItems: { type: "array", items: { type: "string" } }, evidenceIds: { type: "array", items: { type: "string" } },
          blocks: { type: "array", items: { type: "object", properties: { id: { type: "string" }, role: { type: "string", enum: ["label", "headline", "body", "evidence", "bridge", "cta"] }, text: { type: "string" }, evidenceIds: { type: "array", items: { type: "string" } } }, required: ["id", "role", "text"] } },
          image: { type: "object", properties: { required: { type: "boolean" }, searchTermPt: { type: "string" }, searchTermEn: { type: "string" }, description: { type: "string" }, position: { type: "string", enum: ["background", "left", "right"] }, overlay: { type: "string", enum: ["none", "light", "dark"] } }, required: ["required"] },
        },
        required: ["order", "type", "template", "title"],
      },
    },
  },
  required: ["projectTitle", "strategy", "caption", "slides"],
} as const;
