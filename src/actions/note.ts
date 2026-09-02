"use server";

import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { noteIdSchema, noteSchema } from "@/schemas/note";
import z from "zod";
import { Prisma } from "@/generated/prisma/client";
import { applicationIdSchema } from "@/schemas/application";
import { revalidatePath } from "next/cache";

export async function createNote(applicationId: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(applicationId);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  const dataValidation = noteSchema.safeParse(input);
  if (!dataValidation.success) {
    return { success: false, error: z.prettifyError(dataValidation.error) };
  }

  try {
    const session = await requireAuth();

    const application = await prisma.application.findFirst({
      where: { id: idValidation.data, userId: session.user.id },
    });
    if (!application) {
      return {
        success: false,
        error: "Candidatura não encontrada.",
      };
    }

    const note = await prisma.note.create({
      data: {
        applicationId: application.id,
        content: dataValidation.data.content,
      },
      include: { application: true },
    });

    revalidatePath(`/jobs/${note.application.jobId}`);

    return { success: true, note };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }
    
    return {
      success: false,
      error: "Ocorreu um erro ao salvar a nota. Tente novamente.",
    };
  }
}

export async function getNotes(applicationId: string) {
  const idValidation = applicationIdSchema.safeParse(applicationId);
  if (!idValidation.success) {
    return { success: false, error: z.prettifyError(idValidation.error) };
  }

  try {
    const session = await requireAuth();

    const notes = await prisma.note.findMany({
      where: {
        applicationId: idValidation.data,
        application: { userId: session.user.id },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, notes };
  } catch (error) {
    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao buscar as notas. Tente novamente.",
    };
  }
}

export async function deleteNote(applicationId: string, id: string) {
  const applicationIdValidation = applicationIdSchema.safeParse(applicationId);
  if (!applicationIdValidation.success) {
    return {
      success: false,
      error: z.prettifyError(applicationIdValidation.error),
    };
  }

  const noteIdValidation = noteIdSchema.safeParse(id);
  if (!noteIdValidation.success) {
    return { success: false, error: z.prettifyError(noteIdValidation.error) };
  }

  try {
    const session = await requireAuth();

    const note = await prisma.note.delete({
      where: {
        id: noteIdValidation.data,
        applicationId: applicationIdValidation.data,
        application: { userId: session.user.id },
      },
      include: { application: true },
    });

    revalidatePath(`/jobs/${note.application.jobId}`);

    return { success: true, note };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Nota não encontrada." };
    }

    if (error instanceof Error && error.message === "Não autenticado.") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Ocorreu um erro ao deletar uma nota. Tente novamente.",
    };
  }
}
