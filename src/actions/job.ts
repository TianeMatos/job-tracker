"use server";

import { Prisma } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createJobFormSchema } from "@/schemas/createJobForm";
import { jobIdSchema, updateJobSchema } from "@/schemas/job";
import z from "zod";

export async function createJob(input: unknown) {
  const session = await requireAuth();

  const dataValidation = createJobFormSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  const { application, hasApplied, ...jobData } = dataValidation.data;
  try {
    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        ...jobData,
        ...(hasApplied && application
          ? {
              application: {
                create: {
                  userId: session.user.id,
                  ...application,
                },
              },
            }
          : {}),
      },
    });

    // Limpa o cache das páginas
    // revalidatePath("/dashboard");
    // revalidatePath("/kanban");

    return { success: true, job };
  } catch (error) {
    console.error("Erro inesperado no createJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao salvar a vaga. Tente novamente.",
    };
  }
}

//* Usar no Dashboard / job list
export async function getJobs() {
  const session = await requireAuth();

  try {
    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      include: { application: true },
    });

    return { success: true, jobs };
  } catch (error) {
    console.error("Erro inesperado no getJobsAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao buscar as vagas. Tente novamente.",
    };
  }
}

//* Usar no job details
export async function getJobById(id: string) {
  const session = await requireAuth();
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: "ID da vaga inválido." };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: true },
    });
    if (!job) return { success: false, error: "Vaga não encontrada." };

    return { success: true, job };
  } catch (error) {
    console.error("Erro inesperado no getJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao buscar uma vaga. Tente novamente.",
    };
  }
}

export async function updateJob(id: string, input: unknown) {
  const session = await requireAuth();
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: "ID da vaga inválido." };
  }

  const dataValidation = updateJobSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  try {
    const job = await prisma.job.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: dataValidation.data,
      include: { application: true },
    });

    return { success: true, job };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Vaga não encontrada." };
    }
    console.error("Erro inesperado no updateJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao editar uma vaga. Tente novamente.",
    };
  }
}

export async function deleteJob(id: string) {
  const session = await requireAuth();
  const idValidation = jobIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: "ID da vaga inválido." };
  }

  try {
    const job = await prisma.job.delete({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: true },
    });

    return { success: true, job };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Vaga não encontrada." };
    }
    console.error("Erro inesperado no deleteJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao excluir uma vaga. Tente novamente.",
    };
  }
}
