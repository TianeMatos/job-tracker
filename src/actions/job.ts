"use server";

import {
  runAction,
  validationError,
} from "@/lib/action-helpers";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createJobFormSchema } from "@/schemas/createJobForm";
import { jobIdSchema, updateJobSchema } from "@/schemas/job";
import { paginationInputSchema } from "@/schemas/pagination";
import { revalidatePath } from "next/cache";

export async function createJob(input: unknown) {
  const dataValidation = createJobFormSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  const { application, hasApplied, ...jobData } = dataValidation.data;

  return runAction(async () => {
    const session = await requireAuth();

    const positionAtEnd =
      hasApplied && application
        ? await prisma.application.count({
            where: { userId: session.user.id, status: application.status },
          })
        : 0;

    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        ...jobData,
        ...(hasApplied && application
          ? {
              application: {
                create: {
                  userId: session.user.id,
                  position: positionAtEnd,
                  ...application,
                  statusHistory: { create: { status: application.status } },
                },
              },
            }
          : {}),
      },
    });

    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return job;
  });
}

export async function getJobs(input: unknown) {
  const paginationValidation = paginationInputSchema.safeParse(input);
  if (!paginationValidation.success)
    return validationError(paginationValidation.error);

  const { page, limit } = paginationValidation.data;

  return runAction(async () => {
    const session = await requireAuth();

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: { userId: session.user.id, application: { is: null } },
        select: {
          id: true,
          company: true,
          role: true,
          location: true,
          workplaceType: true,
          employmentType: true,
          salary: true,
          deadline: true,
          source: true,
          createdAt: true,
          application: {
            select: {
              id: true,
              status: true,
              appliedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({
        where: { userId: session.user.id, application: { is: null } },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      jobs,
      metaData: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    } 
  });
}

export async function getJobById(id: string) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const job = await prisma.job.findUniqueOrThrow({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: { include: { notes: true } } },
    });

    return job;
  });
}

export async function updateJob(id: string, input: unknown) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = updateJobSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const job = await prisma.job.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: dataValidation.data,
      include: { application: true },
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${job.id}`);
    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return job;
  });
}

export async function deleteJob(id: string) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const job = await prisma.job.delete({
      where: { id: idValidation.data, userId: session.user.id },
    });

    revalidatePath("/jobs");
    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return job;
  });
}
