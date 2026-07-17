import { z } from "zod";

export const captionSchema = z.object({
  text: z.string().max(2200, "O limite do Instagram é de 2.200 caracteres"),
  hashtags: z.array(z.string().min(1, "A hashtag não pode ser vazia")),
});
