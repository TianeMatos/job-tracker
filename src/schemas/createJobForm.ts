import z from "zod";
import { jobSchema } from "./job";
import { applicationSchema } from "./application";

export const createJobFormSchema = z
  .object({
    ...jobSchema.shape,
    hasApplied: z.boolean().default(false),
    application: applicationSchema.partial().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.hasApplied && !data.application?.status) {
      ctx.addIssue({
        code: "custom",
        path: ["application", "status"],
        message: "Informe o status da candidatura.",
      })
    }

    if (data.hasApplied && !data.application?.appliedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["application", "appliedAt"],
        message: "Informe a data da candidatura.",
      })
    }

    // * Revisar depois de fazer o form
    // if (!data.hasApplied && data.application) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["application"],
    //     message:
    //       "Os dados da candidatura só podem ser informados quando você já se candidatou.",
    //   });
    // }
  });

export type CreateJobForm = z.infer<typeof createJobFormSchema>