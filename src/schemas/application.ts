import z from "zod";

export const applicationStatusSchema = z.enum([
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEWING",
  "TECHNICAL_TEST",
  "PROPOSAL",
  "REJECTED",
]);

export const applicationSchema = z.object({
  status: applicationStatusSchema.default("APPLIED"),
  appliedAt: z.coerce.date().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z.string().trim().pipe(z.email({ error: "E-mail inválido." })).optional().or(z.literal("")),
  interviewDate: z.coerce.date().optional(),
});

export const updateApplicationSchema = applicationSchema.extend({
  id: z.uuid({ error: "ID inválido." }),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>