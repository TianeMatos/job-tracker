"use server";

import { runAction } from "@/lib/action-helpers";
import { requireAuth } from "@/lib/auth-session";
import {
  ACTIVE_STATUSES,
  CLOSED_STATUSES,
  INTERVIEW_OR_BEYOND,
} from "@/lib/constants";
import prisma from "@/lib/prisma";

export async function getDashboardMetrics() {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  
  return runAction(async () => {
    const session = await requireAuth();

    const [
      savedJobs,
      activeApplications,
      closedApplications,
      totalApplications,
      advancedToInterview,
      applicationsThisWeek,
      totalOffers,
      totalRejected,
    ] = await Promise.all([
      prisma.job.count({
        where: { userId: session.user.id, application: null },
      }),
      prisma.application.count({
        where: { userId: session.user.id, status: { in: ACTIVE_STATUSES } },
      }),
      prisma.application.count({
        where: { userId: session.user.id, status: { in: CLOSED_STATUSES } },
      }),
      prisma.application.count({ where: { userId: session.user.id } }),
      prisma.application.count({
        where: { userId: session.user.id, status: { in: INTERVIEW_OR_BEYOND } },
      }),
      prisma.application.count({
        where: { userId: session.user.id, appliedAt: { gte: aWeekAgo } },
      }),
      prisma.application.count({
        where: { userId: session.user.id, status: { in: ["PROPOSAL"] } },
      }),
      prisma.application.count({
        where: { userId: session.user.id, status: { in: ["REJECTED"] } },
      }),
    ]);

    return {
      metrics: {
        savedJobs,
        activeApplications,
        closedApplications,
        interviewRate:
          totalApplications > 0
            ? Math.floor((advancedToInterview / totalApplications) * 100)
            : 0,
        applicationsThisWeek,
        totalOffers,
        totalRejected,
      },
    };
  });
}
