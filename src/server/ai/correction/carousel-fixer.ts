import "server-only";
import { createHash } from "node:crypto";
import type {
  AICarouselResponse,
  AppliedCorrection,
  CarouselValidationResult,
} from "@/types";

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/e isso muda tudo/gi, "essa mudança altera o contexto"],
  [/(ao final do dia|no fim das contas)/gi, "na prática"],
  [/cada vez mais/gi, "com frequência crescente"],
  [/de forma clara/gi, "com clareza"],
  [/de forma consistente/gi, "com consistência"],
  [/de forma natural/gi, "naturalmente"],
  [/(continue|arrast[ae]|swipe).{0,30}(pr[oó]ximo|lado|ver mais)/gi, "prossiga pela análise"],
];

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function corrected(value: string) {
  return REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), value);
}

export function fixCarousel(
  carousel: AICarouselResponse,
  validation: CarouselValidationResult,
  attempt: number
): { carousel: AICarouselResponse; corrections: AppliedCorrection[] } {
  const next = structuredClone(carousel);
  const corrections: AppliedCorrection[] = [];
  for (const violation of validation.violations.filter((item) => item.severity === "error")) {
    if (!violation.field || !violation.code.startsWith("AI_SLOP_")) continue;
    const slide = violation.slide
      ? next.slides.find((candidate) => candidate.order === violation.slide)
      : undefined;
    let previous: string | undefined;
    let apply: ((value: string) => void) | undefined;
    if (slide && ["title", "subtitle", "body", "cta", "highlight"].includes(violation.field)) {
      const field = violation.field as "title" | "subtitle" | "body" | "cta" | "highlight";
      previous = slide[field];
      apply = (value) => { slide[field] = value; };
    } else if (slide && violation.field.startsWith("blocks.")) {
      const blockId = violation.field.slice("blocks.".length);
      const block = slide.blocks?.find((candidate) => candidate.id === blockId);
      previous = block?.text;
      apply = block ? (value) => { block.text = value; } : undefined;
    } else if (!slide && violation.field === "caption.text") {
      previous = next.caption.text;
      apply = (value) => { next.caption.text = value; };
    }
    if (!previous || !apply) continue;
    const nextValue = corrected(previous);
    if (nextValue === previous) continue;
    apply(nextValue);
    corrections.push({
      attempt,
      slide: violation.slide,
      field: violation.field,
      codes: [violation.code],
      previousValueHash: hash(previous),
      newValueHash: hash(nextValue),
    });
  }
  return { carousel: next, corrections };
}
