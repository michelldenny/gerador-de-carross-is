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
  }),
  caption: z.object({
    text: z.string(),
    hashtags: z.array(z.string()),
  }),
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
