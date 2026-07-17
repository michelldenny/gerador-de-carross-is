import { z } from "zod";

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
