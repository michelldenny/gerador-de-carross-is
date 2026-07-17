import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres"),
  theme: z.string().min(3, "O tema é obrigatório e deve ser descritivo"),
  audience: z.string().min(3, "Defina o público-alvo para orientar a IA"),
  goal: z.string().min(3, "O objetivo do carrossel é obrigatório"),
  tone: z.string().min(1, "Selecione o tom de voz"),
  slideCount: z.number().int().min(3, "Mínimo de 3 slides").max(10, "Máximo de 10 slides"),
  imageOption: z.string().min(1, "Selecione a quantidade de slides com imagem"),
  imageSource: z.string().min(1, "Selecione a origem das imagens"),
  cta: z.string().min(3, "Defina um Call to Action (CTA) relevante"),
  format: z.enum(["vertical", "square", "story"]),
  brandId: z.string().min(1, "Selecione uma marca"),
  notes: z.string().optional(),
});
