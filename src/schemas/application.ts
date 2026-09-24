import z from "zod";

export const applicationStatusEnum = z.enum([
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEWING",
  "TECHNICAL_TEST",
  "PROPOSAL",
  "WITHDRAWN",
  "REJECTED",
  "HIRED",
]);

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  position: z.number().int().min(0).optional(),
});

export const applicationDetailsSchema = z.object({
  appliedAt: z.coerce.date().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z
    .email({ error: "E-mail do contato inválido." })
    .or(z.literal(""))
    .optional(),
  interviewDate: z.coerce.date().optional(),
});

export const reorderApplicationSchema = z.object({
  position: z.number().int().min(0),
});

export const applicationIdSchema = z.uuid({
  error: "ID da candidatura inválido.",
});

export const applyToJobSchema = applicationDetailsSchema;

export type ApplicationStatus = z.infer<
  typeof applicationStatusEnum
>;

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
export type ApplicationDetailsSchema = z.infer<typeof applicationDetailsSchema>;
