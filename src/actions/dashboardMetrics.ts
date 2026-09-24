"use server";

import { runAction } from "@/lib/action-helpers";
import { requireAuth } from "@/lib/auth/auth-session";
import {
  ACTIVE_STATUSES,
  CLOSED_STATUSES,
  INTERVIEW_OR_BEYOND,
} from "@/lib/constants";
import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@/schemas/application";

function getInitials(company: string): string {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}

export async function getDashboardMetrics() {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);

  return runAction(async () => {
    const session = await requireAuth();
    const userId = session.user.id;

    const [
      savedJobs,
      statusGroups,
      applicationsThisWeek,
      nextInterview,
      advancedToInterview,
    ] = await Promise.all([
      prisma.job.count({ where: { userId, application: null } }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.application.count({
        where: { userId, appliedAt: { gte: aWeekAgo } },
      }),
      prisma.application.findFirst({
        where: {
          userId,
          status: "INTERVIEWING",
          interviewDate: { gte: new Date() },
        },
        orderBy: { interviewDate: "asc" },
        select: { interviewDate: true },
      }),
      prisma.applicationStatusHistory
        .findMany({
          where: {
            status: { in: INTERVIEW_OR_BEYOND },
            application: { userId },
          },
          distinct: ["applicationId"],
          select: { applicationId: true },
        })
        .then((rows) => rows.length),
    ]);

    const countByStatus = Object.fromEntries(
      statusGroups.map((g) => [g.status, g._count._all]),
    ) as Record<ApplicationStatus, number | undefined>;

    const sumStatuses = (statuses: ApplicationStatus[]) =>
      statuses.reduce((sum, s) => sum + (countByStatus[s] ?? 0), 0);

    const totalApplications = statusGroups.reduce(
      (sum, g) => sum + g._count._all,
      0,
    );
    const activeApplications = sumStatuses(ACTIVE_STATUSES);
    const closedApplications = sumStatuses(CLOSED_STATUSES);
    const withdrawnApplications = countByStatus["WITHDRAWN"];
    const interviewingCount = countByStatus["INTERVIEWING"] ?? 0;

    const daysUntilNextInterview = nextInterview?.interviewDate
      ? Math.ceil(
          (nextInterview.interviewDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return {
      metrics: {
        savedJobs,
        totalApplications,
        activeApplications,
        closedApplications,
        interviewRate:
          totalApplications > 0
            ? Math.round((advancedToInterview / totalApplications) * 100)
            : 0,
        applicationsThisWeek,
        interviewingCount,
        daysUntilNextInterview,
        withdrawnApplications,
        totalOffers: countByStatus["PROPOSAL"] ?? 0,
        totalRejected: countByStatus["REJECTED"] ?? 0,
      },
      statusDistribution: countByStatus,
    };
  });
}

export async function getRecentApplications(limit = 4) {
  return runAction(async () => {
    const session = await requireAuth();

    const applications = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        updatedAt: true,
        job: { select: { company: true, role: true } },
      },
    });

    return {
      applications: applications.map((app) => ({
        id: app.id,
        company: app.job.company,
        initials: getInitials(app.job.company),
        role: app.job.role,
        date: app.updatedAt.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: app.status,
      })),
    };
  });
}