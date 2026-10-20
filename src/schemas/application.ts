import z from "zod";
import { dateOnly, emptyToUndefined, jobIdSchema, optionalText } from "./job";
import { ApplicationStatus as ApplicationStatusPrisma } from "@/generated/prisma/client";

export const applicationStatusEnum = z.enum(ApplicationStatusPrisma);

const appliedDate = dateOnly.refine(
  (d) => !d || d.getTime() <= Date.now() + 24 * 60 * 60 * 1000,
  { error: "A data da candidatura não pode ser no futuro." },
);

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  position: z.number().int().min(0).optional(),
});

export const applicationDetailsSchema = z.object({
  appliedAt: appliedDate,
  contactName: optionalText,
  contactEmail: z.preprocess(
    emptyToUndefined,
    z.email({ error: "E-mail do contato inválido." }).optional(),
  ),
  interviewDate: dateOnly,
});

export const reorderApplicationSchema = z.object({
  position: z.number().int().min(0),
});

export const applicationIdSchema = z.uuid({
  error: "ID da candidatura inválido.",
});

export const applySchema = z.object({
  jobId: jobIdSchema,
  status: applicationStatusEnum.default("APPLIED"),
  appliedAt: appliedDate,
});

export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;

