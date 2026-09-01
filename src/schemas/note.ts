import z from "zod";

export const noteIdSchema = z.uuid({
  error: "ID da nota inválido.",
});

export const noteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { error: "A anotação não pode estar vazia." }),
});

export const updateNoteSchema = noteSchema;

export type NoteInput = z.infer<typeof noteSchema>;