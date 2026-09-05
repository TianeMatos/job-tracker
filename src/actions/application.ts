"use server";

import { Prisma } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import {
  applicationDetailsSchema,
  applicationIdSchema,
  applicationStatusEnum,
} from "@/schemas/application";
import { jobIdSchema } from "@/schemas/job";
import { revalidatePath } from "next/cache";
import z from "zod";

//* Create Application
export async function applyToJob(jobId: string) {
  const idValidation = jobIdSchema.safeParse(jobId);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const job = await prisma.job.findUnique({
      where: { id: idValidation.data, userId: session.user.id },
      include: { application: true },
    });
    
    if (!job) {
      return { success: false, error: "Vaga não encontrada." };
    }

    if (job.application) {
      return {
        success: false,
        error: "Você já se candidatou a esta vaga.",
      };
    }

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: job.id,
        status: "APPLIED",
        statusHistory: { 
          create: {
            status: "APPLIED"
          } 
        }
      },
      include: { job: true, notes: true },
    });

    revalidatePath("/saved-jobs");
    revalidatePath("/kanban");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      application,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Você já se candidatou a esta vaga.",
      };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao registrar a candidatura. Tente novamente.",
    };
  }
}

//* Get All Applications -> Use on kanban
export async function getApplications() {
  try {
    const session = await requireAuth();

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id, status: { not: "WITHDRAWN" } },
      include: { job: true, notes: true },
    });

    return {
      success: true,
      applications,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao buscar as candidaturas. Tente novamente.",
    };
  }
}

//* Get One Application -> Use on update form
export async function getApplicationById(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const application = await prisma.application.findUnique({
      where: { id: idValidation.data, userId: session.user.id },
      include: { job: true, notes: true },
    });

    if (!application) {
      return { success: false, error: "Candidatura não encontrada!" };
    }

    return {
      success: true,
      application,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao buscar um candidatura. Tente novamente.",
    };
  }
}

//* Update status -> input: status
export async function updateApplicationStatus(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  const dataValidation = applicationStatusEnum.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  try {
    const session = await requireAuth();

    const application = await prisma.application.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: { 
        status: dataValidation.data,
        statusHistory: {
          create: {
            status: dataValidation.data
          }
        }
      },
      include: { job: true, notes: true },
    });

    revalidatePath("/kanban");
    revalidatePath("/dashboard");
    revalidatePath(`/jobs/${application.jobId}`);

    return {
      success: true,
      application,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Candidatura não encontrada!" };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error:
        "Ocorreu um erro ao alterar o status de uma candidatura. Tente novamente.",
    };
  }
}

//* Update other infos of application
export async function updateApplicationDetails(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  const dataValidation = applicationDetailsSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  try {
    const session = await requireAuth();

    const application = await prisma.application.update({
      where: { id: idValidation.data, userId: session.user.id },
      data: { ...dataValidation.data },
      include: { job: true, notes: true },
    });

    revalidatePath(`/jobs/${application.jobId}`);

    return {
      success: true,
      application,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Candidatura não encontrada!" };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error:
        "Ocorreu um erro ao alterar os dados de uma candidatura. Tente novamente.",
    };
  }
}

//* Delete application
export async function deleteApplication(id: string) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const application = await prisma.application.delete({
      where: { id: idValidation.data, userId: session.user.id },
      include: { job: true, notes: true },
    });

    revalidatePath("/kanban");
    revalidatePath("/saved-jobs");
    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      application,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Candidatura não encontrada!",
      };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao deletar uma candidatura. Tente novamente.",
    };
  }
}
