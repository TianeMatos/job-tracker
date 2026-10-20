import { ApplicationStatus, EmploymentType, WorkplaceType } from "@/generated/prisma/enums";

export const WORKPLACE_LABEL: Record<WorkplaceType, string> = {
  UNSPECIFIED: "Não informado",
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
};

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERN: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCE: "Freelancer",
  OTHER: "Outro",
};

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "Aplicada",
  IN_REVIEW: "Em análise",
  INTERVIEWING: "Entrevistando",
  TECHNICAL_TEST: "Teste Técnico",
  PROPOSAL: "Proposta",
  REJECTED: "Rejeitada",
  WITHDRAWN: "Desistência",
  HIRED: "Contratada",
};

export const APPLY_STATUSES = [
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEWING",
  "TECHNICAL_TEST",
  "PROPOSAL",
  "HIRED",
] as const satisfies readonly ApplicationStatus[];

export type ApplyStatus = (typeof APPLY_STATUSES)[number];

export const APPLY_STATUS_LABEL = Object.fromEntries(
  APPLY_STATUSES.map((s) => [s, STATUS_LABEL[s]]),
) as Record<ApplyStatus, string>;