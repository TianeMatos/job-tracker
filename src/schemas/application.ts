import z from "zod";
import { dateOnly, emptyToUndefined, jobIdSchema, optionalText } from "./job";
import { ApplicationStatus as ApplicationStatusPrisma } from "@/generated/prisma/client";

export const applicationStatusEnum = z.enum(ApplicationStatusPrisma);

export const kanbanStatusEnum = applicationStatusEnum.exclude(["WITHDRAWN"]);

const appliedDate = dateOnly.refine(
  (d) => !d || d.getTime() <= Date.now(),
  { error: "A data da candidatura não pode ser no futuro." },
);

export const applicationDetailsSchema = z.object({
  appliedAt: appliedDate,
  contactName: optionalText,
  contactEmail: z.preprocess(
    emptyToUndefined,
    z.email({ error: "E-mail do contato inválido." }).optional(),
  ),
  interviewDate: dateOnly,
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  position: z.number().int().min(0).optional(),
});

export const moveApplicationSchema = z.object({
  status: kanbanStatusEnum,
  position: z.number().int().min(0),
});

export const applicationIdSchema = z.uuid({
  error: "ID da candidatura inválido.",
});

export const applySchema = z.object({
  jobId: jobIdSchema,
  status: applicationStatusEnum
    .exclude(["REJECTED", "WITHDRAWN"])
    .default("APPLIED"),
  appliedAt: appliedDate,
});

export type ApplicationStatus = z.infer<typeof applicationStatusEnum>;
