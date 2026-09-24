import { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  value: { label: "Candidaturas" },
  applied: { label: "Aplicada", color: "var(--status-applied)" },
  inReview: { label: "Em análise", color: "var(--status-review)" },
  interviewing: { label: "Entrevistando", color: "var(--status-interview)" },
  technicalTest: { label: "Teste técnico", color: "var(--status-test)" },
  proposal: { label: "Proposta", color: "var(--status-offer)" },
  rejected: { label: "Rejeitada", color: "var(--status-rejected)" },
  hired: { label: "Contratada", color: "var(--status-hired)" },
} satisfies ChartConfig;
