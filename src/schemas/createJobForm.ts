import z from "zod";
import { jobSchema } from "./job";
import { applicationDetailsSchema, applicationStatusSchema } from "./application";

const jobNotAppliedSchema = z.object({
  ...jobSchema.shape,
  hasApplied: z.literal(false),
  application: z.undefined().optional(),
});

const jobAppliedSchema = z.object({
  ...jobSchema.shape,
  hasApplied: z.literal(true),
  application: applicationDetailsSchema.extend({
    status: applicationStatusSchema
  }),
});

export const createJobFormSchema = z.discriminatedUnion("hasApplied", [jobNotAppliedSchema, jobAppliedSchema]);

export type CreateJobForm = z.infer<typeof createJobFormSchema>;