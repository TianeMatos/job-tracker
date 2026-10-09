import { Prisma } from "@/generated/prisma/client"

export const jobListSelect = {
  id: true,
  company: true,
  role: true,
  location: true,
  workplaceType: true,
  employmentType: true,
  salary: true,
  deadline: true,
  source: true,
  createdAt: true,
} satisfies Prisma.JobSelect

export type JobListItem = Prisma.JobGetPayload<{
  select: typeof jobListSelect
}>