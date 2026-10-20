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

export const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());

export const dateOnly = z.preprocess(
  emptyToUndefined,
  z.coerce.date({ error: "Data inválida." }).optional(),
);

//* Schema do Zod
export const jobBase = z.object({
  company: z
    .string()
    .trim()
    .min(1, { error: "O nome da empresa é obrigatório." }),
  role: z.string().trim().min(1, { error: "O cargo/título é obrigatório." }),
  description: optionalText,
  jobUrl: z.preprocess(emptyToUndefined, z.url({ error: "URL inválida." }).optional()),
  salary: optionalText,
  location: optionalText,
  deadline: dateOnly,
  workplaceType: workplaceTypeEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
  source: optionalText,
});

export const jobSchema = jobBase.extend({
  workplaceType: workplaceTypeEnum.default("UNSPECIFIED"),
});

export const jobIdSchema = z.uuid({
  error: "ID da vaga inválido.",
});

export const updateJobSchema = jobBase
  .partial()
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    error: "Informe ao menos um campo para atualizar.",
  });

export type UpdateJobInput = z.infer<typeof updateJobSchema>;
