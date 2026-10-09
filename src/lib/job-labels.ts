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