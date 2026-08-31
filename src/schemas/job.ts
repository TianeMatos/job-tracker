import { z } from "zod"

export const workplaceTypeSchema = z.enum(["REMOTE", "HYBRID", "ON_SITE"])

//* Schema do Zod
export const jobSchema = z.object({
  company: z.string().trim().min(1, { error: "Informe a empresa." }),
  role: z.string().trim().min(1, { error: "Informe o cargo." }),
  description: z.string().trim().optional(),
  jobUrl: z.string().trim().pipe(z.url({ error: "URL inválida." })).optional().or(z.literal("")),
  salary: z.string().trim().optional(),
  location: z.string().trim().optional(),
  workplaceType: workplaceTypeSchema,
});

export const jobIdSchema = z.uuid({
  error: "ID da vaga inválido.",
});

export const updateJobSchema = jobSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { error: "Informe ao menos um campo para atualizar." }
);

//* Tipo TypeScript
export type JobId = z.infer<typeof jobIdSchema>
export type JobInput = z.infer<typeof jobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>