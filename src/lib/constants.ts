import { ApplicationStatus } from "@/generated/prisma/enums";

export const ACTIVE_STATUSES: ApplicationStatus[] = ["APPLIED", "IN_REVIEW", "INTERVIEWING", "TECHNICAL_TEST", "PROPOSAL"];
export const CLOSED_STATUSES: ApplicationStatus[] = ["WITHDRAWN", "REJECTED", "HIRED"];
export const INTERVIEW_OR_BEYOND: ApplicationStatus[] = ["INTERVIEWING", "TECHNICAL_TEST", "PROPOSAL", "HIRED"]