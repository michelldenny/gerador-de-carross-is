import type {
  AICarouselResponse,
  CarouselValidationResult,
  GenerateCarouselInput,
  ValidationViolation,
} from "@/types";

const FORBIDDEN_PATTERNS = [
  { code: "AI_SLOP_BINARY", pattern: /n[aã]o [ée] .{1,80},? [ée] .{1,80}/i },
  { code: "AI_SLOP_CHANGES_EVERYTHING", pattern: /e isso muda tudo/i },
  { code: "AI_SLOP_GENERIC_WORLD", pattern: /em um mundo onde/i },
  { code: "AI_SLOP_SWIPE", pattern: /(continue|arrast[ae]|swipe).{0,30}(pr[oó]ximo|lado|ver mais)/i },
  { code: "AI_SLOP_END_OF_DAY", pattern: /(ao final do dia|no fim das contas)/i },
  { code: "AI_SLOP_QUESTION_REMAINS", pattern: /(a pergunta que fica|a quest[aã]o [ée]|o ponto [ée])/i },
  { code: "AI_SLOP_DISCOVER", pattern: /\b(descubra|conheça)\b/i },
  { code: "AI_SLOP_NEED_TO_KNOW", pattern: /tudo (?:o )?que voc[eê] precisa saber/i },
  { code: "AI_SLOP_INCREASINGLY", pattern: /cada vez mais/i },
  { code: "AI_SLOP_GENERIC_FORM", pattern: /de forma (?:clara|consistente|natural)/i },
  { code: "AI_SLOP_FORCED_PARALLEL", pattern: /\bmenos .{1,50}[.!;]\s*mais\b/i },
];

function textFields(slide: AICarouselResponse["slides"][number]) {
  return [
    ["title", slide.title],
    ["subtitle", slide.subtitle],
    ["body", slide.body],
    ["cta", slide.cta],
    ["highlight", slide.highlight],
    ["image.description", slide.image?.description],
    ["image.searchTermPt", slide.image?.searchTermPt],
    ["image.searchTermEn", slide.image?.searchTermEn],
    ...((slide.blocks ?? []).map((block) => [`blocks.${block.id}`, block.text])),
    ...((slide.listItems ?? []).map((item, index) => [`listItems.${index}`, item])),
  ] as Array<[string, string | undefined]>;
}

export function validateCarousel(
  input: GenerateCarouselInput,
  carousel: AICarouselResponse
): CarouselValidationResult {
  const violations: ValidationViolation[] = [];
  const expectedCount = input.editorialMode === "quick" ? 5 : input.slideCount;
  const verifiedEvidence = new Set(
    (carousel.evidence ?? [])
      .filter((evidence) => evidence.status === "verified" || evidence.status === "user-provided")
      .map((evidence) => evidence.id)
  );

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
      if (/\b\d+(?:[.,]\d+)?\s*(?:%|milh(?:ão|ões)\b|bilh(?:ão|ões)\b|R\$)/i.test(value)) {
        const fieldEvidenceIds = [
          ...(slide.evidenceIds ?? []),
          ...(slide.blocks
          ?.filter((block) => `blocks.${block.id}` === field)
          .flatMap((block) => block.evidenceIds ?? []) ?? []),
        ];
        const hasEvidence = fieldEvidenceIds.some((id) => verifiedEvidence.has(id));
        if (!hasEvidence) {
          violations.push({
            code: "FACTUAL_CLAIM_MISSING_EVIDENCE",
            severity: input.editorialMode === "editorial" ? "error" : "warning",
            slide: slide.order,
            field,
            message: "Dado factual sem evidência associada",
            kind: "heuristic",
          });
        }
      }
    }
  });

  const globalTextFields: Array<[string, string]> = [
    ["strategy.mainMessage", carousel.strategy.mainMessage],
    ["strategy.promise", carousel.strategy.promise ?? ""],
    ["caption.text", carousel.caption.text],
    ...carousel.caption.hashtags.map((hashtag, index) => [`caption.hashtags.${index}`, hashtag] as [string, string]),
  ];
  for (const [field, value] of globalTextFields) {
    for (const forbidden of FORBIDDEN_PATTERNS) {
      if (forbidden.pattern.test(value)) {
        violations.push({
          code: forbidden.code,
          severity: input.editorialMode === "editorial" ? "error" : "warning",
          field,
          message: `Padrão editorial proibido encontrado em ${field}`,
          kind: "deterministic",
        });
      }
    }
  }

  if (carousel.slides.at(-1)?.type !== "cta") {
    violations.push({
      code: "CTA_NOT_LAST",
      severity: "error",
      slide: carousel.slides.at(-1)?.order,
      message: "O último slide deve ser um CTA",
      kind: "deterministic",
    });
  }

  const valid = !violations.some((violation) => violation.severity === "error");
  return {
    valid,
    status: !valid
      ? "rejected"
      : violations.length > 0
        ? "approved_with_warnings"
        : "approved",
    violations,
  };
}
