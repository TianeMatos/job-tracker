import { Prisma } from "@/generated/prisma/client";

export const kanbanSelect = {
  id: true, status: true, position: true, appliedAt: true, jobId: true,
  job: { select: { company: true, role: true, location: true, workplaceType: true } },
} satisfies Prisma.ApplicationSelect;

export type KanbanApplication = Prisma.ApplicationGetPayload<{ select: typeof kanbanSelect }>;