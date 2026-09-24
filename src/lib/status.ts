import { ApplicationStatus } from "@/schemas/application";

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; badgeClassName: string }
> = {
  APPLIED: {
    label: "Aplicada",
    badgeClassName: "bg-status-applied/15 text-status-applied border-status-applied/20",
  },
  IN_REVIEW: {
    label: "Em Análise",
    badgeClassName: "bg-status-in_review/15 text-status-in_review border-status-in_review/20",
  },
  INTERVIEWING: {
    label: "Entrevista",
    badgeClassName: "bg-status-interviewing/15 text-status-interviewing border-status-interviewing/20",
  },
  TECHNICAL_TEST: {
    label: "Teste Técnico",
    badgeClassName: "bg-status-technical_test/15 text-status-technical_test border-status-technical_test/20",
  },
  PROPOSAL: {
    label: "Proposta",
    badgeClassName: "bg-status-proposal/15 text-status-proposal border-status-proposal/20",
  },
  REJECTED: {
    label: "Rejeitada",
    badgeClassName: "bg-status-rejected/15 text-status-rejected border-status-rejected/20",
  },
  WITHDRAWN: {
    label: "Desistência",
    badgeClassName: "bg-status-withdrawn/50 text-status-withdrawn dark:text-status-withdrawn/50",
  },
  HIRED: {
    label: "Contratação",
    badgeClassName: "bg-status-hired/15 text-status-hired border-status-hired/20",
  },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "IN_REVIEW",
  "INTERVIEWING",
  "TECHNICAL_TEST",
  "PROPOSAL",
  "REJECTED",
  "WITHDRAWN",
  "HIRED",
];