import type { EditorialMode, SlideTemplateId, SlideType } from "@/types";

const EDITORIAL_TEMPLATES: SlideTemplateId[] = [
  "cover-image",
  "content-highlight",
  "content-list",
  "content-number",
  "content-left-image",
  "content-highlight",
  "comparison",
  "content-right-image",
  "cta-brand",
];

export function selectTemplate(
  mode: EditorialMode,
  order: number,
  slideCount: number,
  fallback: SlideTemplateId
): { template: SlideTemplateId; type: SlideType } {
  if (order === slideCount) return { template: "cta-brand", type: "cta" };
  if (order === 1) {
    return {
      template: mode === "editorial" ? "cover-image" : fallback,
      type: "cover",
    };
  }
  if (mode !== "editorial") return { template: fallback, type: "content" };
  return {
    template: EDITORIAL_TEMPLATES[order - 1] ?? "content-highlight",
    type: "content",
  };
}
