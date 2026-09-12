"use server";

import { requireAuth } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { noteIdSchema, noteSchema } from "@/schemas/note";
import { applicationIdSchema } from "@/schemas/application";
import { revalidatePath } from "next/cache";
import { runAction, validationError } from "@/lib/action-helpers";

export async function createNote(applicationId: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(applicationId);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = noteSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const application = await prisma.application.findUniqueOrThrow({
      where: { id: idValidation.data, userId: session.user.id },
    });

    const note = await prisma.note.create({
      data: {
        applicationId: application.id,
        content: dataValidation.data.content,
      },
      select: {
        id: true,
        applicationId: true,
        content: true,
        createdAt: true,
        application: {
          select: {
            jobId: true,
          },
        },
      },
    });

    revalidatePath(`/jobs/${note.application.jobId}`);

    return note;
  });
}

export async function getNotes(applicationId: string) {
  const idValidation = applicationIdSchema.safeParse(applicationId);
  if (!idValidation.success) return validationError(idValidation.error);

  return runAction(async () => {
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

    return notes;
  });
}

export async function deleteNote(applicationId: string, id: string) {
  const applicationIdValidation = applicationIdSchema.safeParse(applicationId);
  if (!applicationIdValidation.success)
    return validationError(applicationIdValidation.error);

  const noteIdValidation = noteIdSchema.safeParse(id);
  if (!noteIdValidation.success) return validationError(noteIdValidation.error);

  return runAction(async () => {
    const session = await requireAuth();

    const note = await prisma.note.delete({
      where: {
        id: noteIdValidation.data,
        applicationId: applicationIdValidation.data,
        application: { userId: session.user.id },
      },
      select: {
        id: true,
        application: {
          select: {
            jobId: true,
          },
        },
      },
    });

    revalidatePath(`/jobs/${note.application.jobId}`);

    return note;
  });
}
