import z from "zod";

export const applicationStatusSchema = z.enum([
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEWING",
  "TECHNICAL_TEST",
  "PROPOSAL",
  "REJECTED",
  "HIRED",
]);

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
});

export const applicationIdSchema = z.uuid({
  error: "ID da candidatura inválido.",
});

export const applicationDetailsSchema = z.object({
  appliedAt: z.coerce.date().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z.email({ error: "E-mail inválido." }).optional().or(z.literal("")),
  interviewDate: z.coerce.date().optional(),
});
//* ⬆️ .strict() -> fará o Zod retornar erro se receber algo diferente do tem no schema

export const applyToJobSchema = applicationDetailsSchema;

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ApplicationDetailsSchema = z.infer<typeof applicationDetailsSchema>;