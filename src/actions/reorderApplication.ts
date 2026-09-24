import { runAction, validationError } from "@/lib/action-helpers";
import { requireAuth } from "@/lib/auth/auth-session";
import prisma from "@/lib/prisma";
import {
  applicationIdSchema,
  reorderApplicationSchema,
} from "@/schemas/application";
import { revalidatePath } from "next/cache";

export async function reorderApplication(id: string, input: unknown) {
  const idValidation = applicationIdSchema.safeParse(id);
  if (!idValidation.success) return validationError(idValidation.error);

  const dataValidation = reorderApplicationSchema.safeParse(input);
  if (!dataValidation.success) return validationError(dataValidation.error);

  const { position: newPosition } = dataValidation.data;

  return runAction(async () => {
    const session = await requireAuth();

    const currentAp = await prisma.application.findUniqueOrThrow({
      where: { id: idValidation.data, userId: session.user.id },
      select: { status: true, position: true, jobId: true },
    });

    if (currentAp.position === newPosition) {
      return prisma.application.findUniqueOrThrow({
        where: { id: idValidation.data, userId: session.user.id },
        include: { job: true, notes: true },
      });
    }

    const application = await prisma.$transaction(async (tx) => {
      if (newPosition > currentAp.position) {
        await tx.application.updateMany({
          where: {
            userId: session.user.id,
            status: currentAp.status,
            position: { gt: currentAp.position, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        });
      } else {
        await tx.application.updateMany({
          where: {
            userId: session.user.id,
            status: currentAp.status,
            position: { gte: newPosition, lt: currentAp.position },
          },
          data: { position: { increment: 1 } },
        });
      }

      return tx.application.update({
        where: { id: idValidation.data, userId: session.user.id },
        data: { position: newPosition },
        include: { job: true, notes: true },
      });
    });

    revalidatePath("/kanban");
    revalidatePath("/dashboard");

    return application;
  });
}
