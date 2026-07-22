import { z } from "zod";

export const generateCarouselInputSchema = z
  .object({
    editorialMode: z.enum(["quick", "custom", "editorial"]),
    title: z.string().trim().min(3).max(120),
    theme: z.string().trim().min(3).max(500),
    brandId: z.string().trim().min(1).max(100),
    audience: z.string().trim().min(3).max(300),
    goal: z.string().trim().min(1).max(100),
    tone: z.string().trim().min(1).max(100),
    slideCount: z.number().int().min(3).max(10),
    cta: z.string().trim().min(3).max(300),
    format: z.enum(["vertical", "square", "story"]),
    imageOption: z.string().trim().min(1).max(100),
    niche: z.string().trim().max(150).optional(),
    notes: z.string().trim().max(2_000).optional(),
    visualStyle: z.string().trim().max(100).optional(),
    imageSource: z.string().trim().max(100).optional(),
    imageCount: z.number().int().min(0).max(10).optional(),
    primaryColor: z.string().trim().max(30).optional(),
    secondaryColor: z.string().trim().max(30).optional(),
    accentColor: z.string().trim().max(30).optional(),
    backgroundColor: z.string().trim().max(30).optional(),
    fontFamily: z.string().trim().max(100).optional(),
    evidence: z.array(z.object({
      id: z.string().trim().min(1).max(100),
      claim: z.string().trim().min(3).max(500),
      sourceTitle: z.string().trim().min(1).max(300),
      sourceUrl: z.string().url().max(2_000),
      publisher: z.string().trim().max(200).optional(),
      publicationDate: z.string().trim().max(40).optional(),
    })).max(20).optional(),
  })
  .superRefine((input, context) => {
    if (input.editorialMode === "editorial" && input.slideCount !== 9) {
      context.addIssue({
        code: "custom",
        path: ["slideCount"],
        message: "O modo editorial exige exatamente 9 slides",
      });
    }
    if (input.editorialMode === "editorial" && input.format !== "vertical") {
      context.addIssue({
        code: "custom",
        path: ["format"],
        message: "O modo editorial exige o formato vertical",
      });
    }
  });

export const aiCarouselResponseSchema = z.object({
  projectTitle: z.string(),
  strategy: z.object({
    objective: z.string(),
    targetAudience: z.string(),
    tone: z.string(),
    mainMessage: z.string(),
    promise: z.string().optional(),
  }),
  caption: z.object({
    text: z.string(),
    hashtags: z.array(z.string()),
  }),
  evidence: z.array(z.object({
    id: z.string(),
    claim: z.string(),
    status: z.enum(["verified", "unverified", "user-provided"]),
    sourceTitle: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    publisher: z.string().optional(),
    publicationDate: z.string().optional(),
    accessedAt: z.string().optional(),
  })).optional(),
  slides: z.array(
    z.object({
      order: z.number().int().positive(),
      type: z.enum(["cover", "content", "comparison", "quote", "cta"]),
      template: z.enum([
        "cover-image",
        "cover-minimal",
        "content-highlight",
        "content-number",
        "content-list",
        "content-left-image",
        "content-right-image",
        "content-quote",
        "comparison",
        "cta-brand",
      ]),
      role: z.enum(["hook", "mechanism", "evidence", "expansion", "application", "direction", "closing", "cta"]).optional(),
      blocks: z.array(z.object({
        id: z.string(),
        role: z.enum(["label", "headline", "body", "evidence", "bridge", "cta"]),
        text: z.string(),
        evidenceIds: z.array(z.string()).optional(),
      })).optional(),
      evidenceIds: z.array(z.string()).optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      body: z.string().optional(),
      highlight: z.string().optional(),
      cta: z.string().optional(),
      listItems: z.array(z.string()).optional(),
      image: z
        .object({
          required: z.boolean(),
          searchTermPt: z.string().optional(),
          searchTermEn: z.string().optional(),
          description: z.string().optional(),
          position: z.enum(["background", "left", "right"]).optional(),
          overlay: z.enum(["none", "light", "dark"]).optional(),
        })
        .optional(),
    })
  ),
});
