import { z } from "zod";

export const workplaceTypeEnum = z.enum([
  "UNSPECIFIED",
  "REMOTE",
  "HYBRID",
  "ON_SITE",
]);
export const employmentTypeEnum = z.enum([
  "CLT",
  "PJ",
  "INTERN",
  "TEMPORARY",
  "FREELANCE",
  "OTHER",
]);

//* Schema do Zod
export const jobSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, { error: "O nome da empresa é obrigatório." }),
  role: z.string().trim().min(1, { error: "O cargo/título é obrigatório." }),
  description: z.string().trim().optional(),
  jobUrl: z.url({ error: "URL inválida." }).or(z.literal("")).optional(),
  salary: z.string().trim().optional(),
  location: z.string().trim().optional(),
  deadline: z.coerce.date().optional(),
  workplaceType: workplaceTypeEnum.default("UNSPECIFIED"),
  employmentType: employmentTypeEnum.optional(),
  source: z.string().optional(),
});

export const jobIdSchema = z.uuid({
  error: "ID da vaga inválido.",
});

export const updateJobSchema = jobSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "Informe ao menos um campo para atualizar.",
  });

//* Tipo TypeScript
export type JobId = z.infer<typeof jobIdSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
