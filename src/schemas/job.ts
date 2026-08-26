import { z } from "zod"

export const workplaceTypeSchema = z.enum(["REMOTE", "HYBRID", "ON_SITE"])

export const jobSchema = z.object({
  company: z.string().trim().min(1, { error: "Informe a empresa." }),
  role: z.string().trim().min(1, { error: "Informe o cargo." }),
  description: z.string().trim().optional(),
  jobUrl: z.string().trim().pipe(z.url({ error: "URL inválida." })).optional().or(z.literal("")),
  salary: z.string().trim().optional(),
  location: z.string().trim().optional(),
  workplaceType: workplaceTypeSchema.default("REMOTE"),
});

export const updateJobSchema = jobSchema.partial().extend({
  id: z.uuid({ error: "ID inválido." }),
});

export type JobInput = z.infer<typeof jobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>