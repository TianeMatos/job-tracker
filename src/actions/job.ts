"use server";

import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createJobFormSchema } from "@/schemas/createJobForm";
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
