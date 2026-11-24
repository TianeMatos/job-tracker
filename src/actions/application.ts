"use server";

import { runAction, validationError } from "@/lib/action-helpers";
import {
  clampToNow,
  closeGap,
  moveInTx,
  nextPosition,
} from "@/lib/application-helpers";
import { requireAuth } from "@/lib/auth/auth-session";
import { BusinessError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { kanbanSelect } from "@/lib/types/applications";
import {
  applicationDetailsSchema,
  applicationIdSchema,
  applicationStatusEnum,
  moveApplicationSchema,
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
    const userId = session.user.id;

    const job = await prisma.job.findFirst({
      where: { id: jobId, userId },
      select: { id: true, application: { select: { id: true } } },
    });

    if (!job) throw new BusinessError("Vaga não encontrada.");
    if (job.application)
      throw new BusinessError("Você já se candidatou a esta vaga.");

    const application = await prisma.$transaction(async (tx) => {
      await tx.application.create({
        data: {
          userId,
          jobId: job.id,
          status: status,
          appliedAt: clampToNow(appliedAt),
          position: await nextPosition(tx, userId, status),
          statusHistory: {
            create: {
              status: status,
            },
          },
        },
        select: { id: true },
      });
    });

    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return application;
  });
}

//* Get All Applications
export async function getApplications() {
  return runAction(async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    return await prisma.application.findMany({
      where: { userId, status: { not: "WITHDRAWN" } },
      select: kanbanSelect,
      orderBy: { position: "asc" },
    });
  });
}

//* Get One Application #Not Using
export async function getApplicationById(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    return await prisma.application.findUniqueOrThrow({
      where: { id: idValidation.data, userId },
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
    const userId = session.user.id;

    const { statusChanged } = await prisma.$transaction((tx) =>
      moveInTx(tx, userId, idValidation.data, dataValidation.data),
    );

    if (statusChanged) {
      revalidatePath("/kanban");
      revalidatePath("/dashboard");
      revalidatePath(`/applications/${idValidation.data}`);
    }
    return { statusChanged };
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

    return application;
  });
}

//* Delete application
export async function deleteApplication(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    const deleted = await prisma.$transaction(async (tx) => {
      const current = await tx.application.findFirstOrThrow({
        where: { id: idValidation.data, userId },
        select: { id: true, status: true, position: true },
      });

      await tx.application.delete({ where: { id: current.id } });
      await closeGap(tx, userId, current.status, current.position);

      return { id: current.id };
    });

    revalidatePath("/kanban");
    revalidatePath("/saved-jobs");
    revalidatePath("/dashboard");

    return deleted;
  });
}

export async function moveApplication(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = moveApplicationSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  const { status: newStatus, position: requestedPosition } =
    dataValidation.data;

  return runAction(async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    const { positionChanged, statusChanged } = await prisma.$transaction(async (tx) =>
      moveInTx(tx, userId, idValidation.data, newStatus, requestedPosition),
    );

    if (statusChanged) {
      revalidatePath("/dashboard");
    }
    revalidatePath("/kanban");
    return { statusChanged, positionChanged }
  });
}
