"use server";

import { Prisma } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createJobFormSchema } from "@/schemas/createJobForm";
import { jobIdSchema, updateJobSchema } from "@/schemas/job";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createJob(input: unknown) {
  const dataValidation = createJobFormSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  const { application, hasApplied, ...jobData } = dataValidation.data;
  try {
    const session = await requireAuth();

    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        ...jobData,
        ...(hasApplied && application
          ? {
              application: {
                create: {
                  userId: session.user.id,
                  statusHistory: { create: { status: application.status } },
                  ...application,
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

    return { success: true, job };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao salvar a vaga. Tente novamente.",
    };
  }
}

//* Usar no Dashboard / job list
export async function getJobs() {
  try {
    const session = await requireAuth();

    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      include: { application: true },
    });

    return { success: true, jobs };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao buscar as vagas. Tente novamente.",
    };
  }
}

//* Usar no job details
export async function getJobById(id: string) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const job = await prisma.job.findUnique({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: { include: { notes: true } } },
    });

    if (!job) return { success: false, error: "Vaga não encontrada." };

    return { success: true, job };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao buscar uma vaga. Tente novamente.",
    };
  }
}

export async function updateJob(id: string, input: unknown) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  const dataValidation = updateJobSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  try {
    const session = await requireAuth();

    const job = await prisma.job.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: { ...dataValidation.data },
      include: { application: true },
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${id}`);
    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");

    return { success: true, job };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Vaga não encontrada." };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao editar uma vaga. Tente novamente.",
    };
  }
}

export async function deleteJob(id: string) {
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const job = await prisma.job.delete({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: true },
    });

    revalidatePath("/jobs");
    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return { success: true, job };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Vaga não encontrada." };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao excluir uma vaga. Tente novamente.",
    };
  }
}
