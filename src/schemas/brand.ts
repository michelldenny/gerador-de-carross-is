import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Nome da marca é obrigatório"),
  logoText: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor hexadecimal inválida"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor hexadecimal inválida"),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor hexadecimal inválida"),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor hexadecimal inválida"),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor hexadecimal inválida"),
  fontFamily: z.string().min(1, "Fonte principal é obrigatória"),
  secondaryFontFamily: z.string().optional(),
  instagramHandle: z.string().min(2, "O handle do Instagram deve começar com @").regex(/^@/, "O handle deve começar com @"),
  website: z.string().optional(),
  phone: z.string().optional(),
  defaultCta: z.string().min(3, "O CTA padrão é obrigatório"),
});
