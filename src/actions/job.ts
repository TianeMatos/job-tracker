"use server";

import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createJobFormSchema } from "@/schemas/createJobForm";
import { UpdateJobInput } from "@/schemas/job";
import z from "zod";

export async function createJobAction(input: unknown) {
  const session = await requireAuth();

  const dataValidation = createJobFormSchema.safeParse(input);
  if (!dataValidation.success) {
    const prettyError = z.prettifyError(dataValidation.error);
    return { success: false, error: prettyError };
  }

  const data = dataValidation.data;
  try {
    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        company: data.company,
        role: data.role,
        description: data.description,
        jobUrl: data.jobUrl,
        salary: data.salary,
        location: data.location,
        workplaceType: data.workplaceType,
        ...(data.hasApplied && data.application
          ? {
              application: {
                create: {
                  userId: session.user.id,
                  status: data.application.status,
                  appliedAt: data.application.appliedAt,
                  contactName: data.application.contactName,
                  contactEmail: data.application.contactEmail,
                  interviewDate: data.application.interviewDate,
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

export async function getJobsAction() {
  const session = await requireAuth();

  try {
    const jobs = await prisma.job.findMany({ where: { userId: session.user.id }, include: { application: true } });

    return { success: true, jobs };
  } catch (error) {
    console.error("Erro inesperado no getJobsAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao buscar as vagas. Tente novamente.",
    };
  }
}

export async function getJobAction(id: string) {
  const session = await requireAuth();

  try {
    const job = await prisma.job.findUnique({ where: { id, userId: session.user.id }, include: { application: true } });

    return { success: true, job };
  } catch (error) {
    console.error("Erro inesperado no getJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao buscar uma vaga. Tente novamente.",
    };
  }
}

export async function updateJobAction(id: string, data: UpdateJobInput) {
  const session = await requireAuth();

  try {
    const job = await prisma.job.update({ where: { id, userId: session.user.id }, data, include: { application: true }  });

    return { success: true, job };
  } catch (error) {
    console.error("Erro inesperado no updateJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao editar uma vaga. Tente novamente.",
    };
  }
}

export async function deleteJobAction(id: string) {
  const session = await requireAuth();

  try {
    const job = await prisma.job.delete({ where: { id, userId: session.user.id }, include: { application: true } });

    return { success: true, job };
  } catch (error) {
    console.error("Erro inesperado no deleteJobAction:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao excluir uma vaga. Tente novamente.",
    };
  }
}