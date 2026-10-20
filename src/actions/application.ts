"use server";

import { runAction, validationError } from "@/lib/action-helpers";
import { requireAuth } from "@/lib/auth/auth-session";
import { BusinessError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import {
  applicationDetailsSchema,
  applicationIdSchema,
  applicationStatusEnum,
} from "@/schemas/application";
import { applySchema } from "@/schemas/application";
import { revalidatePath } from "next/cache";

//* Create Application
export async function applyToJob(input: unknown) {
  const validation = applySchema.safeParse(input);
  if (!validation.success) return validationError(validation.error);
  const { jobId, appliedAt, status } = validation.data;

  return runAction(async () => {
    const session = await requireAuth();

    const job = await prisma.job.findFirst({
      where: { id: jobId, userId: session.user.id },
      select: { id: true, application: { select: { id: true } } },
    });

    if (!job) throw new BusinessError("Vaga não encontrada.");

    if (job.application)
      throw new BusinessError("Você já se candidatou a esta vaga.");

    await prisma.$transaction(async (tx) => {
      const positionAtEnd = await tx.application.count({
        where: { userId: session.user.id, status: status ?? "APPLIED", },
      });
      await tx.application.create({
        data: {
          userId: session.user.id,
          jobId: job.id,
          status: status ?? "APPLIED",
          appliedAt: appliedAt ?? new Date(),
          position: positionAtEnd,
          statusHistory: {
            create: {
              status: status ?? "APPLIED",
            },
          },
        },
      });
    });

    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/dashboard");
  });
}

//* Get All Applications
export async function getApplications() {
  return runAction(async () => {
    const session = await requireAuth();

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id, status: { not: "WITHDRAWN" } },
      select: {
        id: true,
        status: true,
        position: true,
        appliedAt: true,
        jobId: true,
        // statusHistory: {
        //   orderBy: {
        //     createdAt: "asc",
        //   },
        // },

        job: {
          select: {
            id: true,
            company: true,
            role: true,
            location: true,
            workplaceType: true,
            employmentType: true,
            salary: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { position: "asc" }],
      take: 100,
    });

    return applications;
  });
}

//* Get One Application #Not Using
export async function getApplicationById(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const application = await prisma.application.findUniqueOrThrow({
      where: { id: idValidation.data, userId: session.user.id },
      include: {
        job: true,
        notes: true,
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return application;
  });
}

//* Update status -> input: status
export async function updateApplicationStatus(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = applicationStatusEnum.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const current = await prisma.application.findUniqueOrThrow({
      where: { id: idValidation.data, userId: session.user.id },
      select: { status: true, position: true, jobId: true },
    });

    if (current.status === dataValidation.data) {
      return prisma.application.findUniqueOrThrow({
        where: { id: idValidation.data, userId: session.user.id },
        select: { status: true, position: true, jobId: true },
      });
    }

    const application = await prisma.$transaction(async (tx) => {

      await tx.application.updateMany({
        where: {
          userId: session.user.id,
          status: current.status,
          position: { gt: current.position },
        },
        data: { position: { decrement: 1 } },
      });

      const positionAtEnd = await tx.application.count({
        where: { userId: session.user.id, status: dataValidation.data },
      });

      return tx.application.update({
        where: { id: idValidation.data, userId: session.user.id },
        data: {
          status: dataValidation.data,
          position: positionAtEnd,
          statusHistory: { create: { status: dataValidation.data } },
        },
        select: { status: true, position: true, jobId: true },
      });
    });

    revalidatePath("/kanban");
    revalidatePath("/dashboard");
    revalidatePath(`/jobs/${application.jobId}`);

    return application;
  });
}

//* Update other infos of application
export async function updateApplicationDetails(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = applicationDetailsSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const application = await prisma.application.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: dataValidation.data,
      select: {
        id: true,
        jobId: true,
        contactName: true,
        contactEmail: true,
        interviewDate: true,
      },
    });

    revalidatePath(`/jobs/${application.jobId}`);

    return application;
  });
}

//* Delete application
export async function deleteApplication(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const application = await prisma.application.delete({
      where: { id: idValidation.data, userId: session.user.id },
      select: {
        id: true,
        jobId: true,
      },
    });

    revalidatePath("/kanban");
    revalidatePath("/saved-jobs");
    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath("/dashboard");

    return application;
  });
}
