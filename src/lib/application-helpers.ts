import type { Prisma, ApplicationStatus } from "@/generated/prisma/client";

type Tx = Prisma.TransactionClient;

export function clampToNow(date?: Date) {
  const now = new Date();
  return date && date < now ? date : now;
}

export async function nextPosition(
  tx: Tx,
  userId: string,
  status: ApplicationStatus,
) {
  const { _max } = await tx.application.aggregate({
    where: { userId, status },
    _max: { position: true },
  });
  return (_max.position ?? -1) + 1;
}

export async function closeGap(
  tx: Tx,
  userId: string,
  status: ApplicationStatus,
  position: number,
) {
  await tx.application.updateMany({
    where: { userId, status, position: { gt: position } },
    data: { position: { decrement: 1 } },
  });
}

export async function moveInTx(
  tx: Tx,
  userId: string,
  id: string,
  newStatus: ApplicationStatus,
  requestedPosition?: number,
) {
  const current = await tx.application.findFirstOrThrow({
    where: { id, userId },
    select: { status: true, position: true, jobId: true },
  });

  const statusChanged = current.status !== newStatus;
  const inTarget = await tx.application.count({
    where: { userId, status: newStatus },
  });
  const last = statusChanged ? inTarget : inTarget - 1;
  const position =
    requestedPosition === undefined
      ? statusChanged
        ? last
        : current.position
      : Math.min(requestedPosition, last);

  const positionChanged = current.position !== position;

  if (!statusChanged && !positionChanged)
    return {
      statusChanged: false,
      jobId: current.jobId,
      positionChanged: false,
    };

  if (statusChanged) {
    await closeGap(tx, userId, current.status, current.position);
    await tx.application.updateMany({
      where: { userId, status: newStatus, position: { gte: position } },
      data: { position: { increment: 1 } },
    });
  } else if (position > current.position) {
    await tx.application.updateMany({
      where: {
        userId,
        status: newStatus,
        position: { gt: current.position, lte: position },
      },
      data: { position: { decrement: 1 } },
    });
  } else {
    await tx.application.updateMany({
      where: {
        userId,
        status: newStatus,
        position: { gte: position, lt: current.position },
      },
      data: { position: { increment: 1 } },
    });
  }

  await tx.application.update({
    where: { id },
    data: {
      status: newStatus,
      position,
      ...(statusChanged && {
        statusHistory: { create: { status: newStatus } },
      }),
    },
  });

  return {
    statusChanged,
    jobId: current.jobId,
    positionChanged,
  };
}
