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
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;

export const applicationDetailsSchema = z.object({
  appliedAt: z.coerce.date().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z.email({ error: "E-mail inválido." }).optional().or(z.literal("")),
  interviewDate: z.coerce.date().optional(),
});

export const updateApplicationDetailsSchema = applicationDetailsSchema.partial();

export type ApplicationDetailsSchema = z.infer<typeof applicationDetailsSchema>;
export type UpdateApplicationDetailsInput = z.infer<typeof updateApplicationDetailsSchema>;