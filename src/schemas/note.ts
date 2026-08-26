import z from "zod";

export const noteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { error: "A anotação não pode estar vazia." }),
});

export type NoteInput = z.infer<typeof noteSchema>;