import type { AICarouselResponse, GenerateCarouselInput } from "@/types";

export interface ValidationViolation {
  code: string;
  severity: "error" | "warning";
  slide?: number;
  field?: string;
  message: string;
  kind: "deterministic" | "heuristic";
}

export interface CarouselValidationResult {
  valid: boolean;
  violations: ValidationViolation[];
}

const FORBIDDEN_PATTERNS = [
  { code: "AI_SLOP_BINARY", pattern: /n[aã]o [ée] .{1,80},? [ée] .{1,80}/i },
  { code: "AI_SLOP_CHANGES_EVERYTHING", pattern: /e isso muda tudo/i },
  { code: "AI_SLOP_GENERIC_WORLD", pattern: /em um mundo onde/i },
  { code: "AI_SLOP_SWIPE", pattern: /(continue|arrast[ae]|swipe).{0,30}(pr[oó]ximo|lado|ver mais)/i },
];

function textFields(slide: AICarouselResponse["slides"][number]) {
  return [
    ["title", slide.title],
    ["subtitle", slide.subtitle],
    ["body", slide.body],
    ["cta", slide.cta],
    ...((slide.listItems ?? []).map((item, index) => [`listItems.${index}`, item])),
  ] as Array<[string, string | undefined]>;
}

export function validateCarousel(
  input: GenerateCarouselInput,
  carousel: AICarouselResponse
): CarouselValidationResult {
  const violations: ValidationViolation[] = [];
  const expectedCount = input.editorialMode === "quick" ? 5 : input.slideCount;

  if (carousel.slides.length !== expectedCount) {
    violations.push({
      code: "SLIDE_COUNT_MISMATCH",
      severity: "error",
      message: `Esperados ${expectedCount} slides; recebidos ${carousel.slides.length}`,
      kind: "deterministic",
    });
  }

  carousel.slides.forEach((slide, index) => {
    if (slide.order !== index + 1) {
      violations.push({
        code: "INVALID_SLIDE_ORDER",
        severity: "error",
        slide: slide.order,
        field: "order",
        message: "A ordem dos slides deve ser contínua e iniciar em 1",
        kind: "deterministic",
      });
    }
    for (const [field, value] of textFields(slide)) {
      if (!value) continue;
      for (const forbidden of FORBIDDEN_PATTERNS) {
        if (forbidden.pattern.test(value)) {
          violations.push({
            code: forbidden.code,
            severity: input.editorialMode === "editorial" ? "error" : "warning",
            slide: slide.order,
            field,
            message: `Padrão editorial proibido encontrado em ${field}`,
            kind: "deterministic",
          });
        }
      }
      if (/\b\d+(?:[.,]\d+)?\s*(?:%|milh(?:ão|ões)|bilh(?:ão|ões)|R\$)\b/i.test(value)) {
        violations.push({
          code: "POSSIBLE_UNSOURCED_CLAIM",
          severity: "warning",
          slide: slide.order,
          field,
          message: "Possível dado factual; exige evidência antes de publicação",
          kind: "heuristic",
        });
      }
    }
  });

  if (carousel.slides.at(-1)?.type !== "cta") {
    violations.push({
      code: "CTA_NOT_LAST",
      severity: "error",
      slide: carousel.slides.at(-1)?.order,
      message: "O último slide deve ser um CTA",
      kind: "deterministic",
    });
  }

  return {
    valid: !violations.some((violation) => violation.severity === "error"),
    violations,
  };
}
