import {
  getDashboardMetrics,
  getRecentApplications,
} from "@/actions/dashboardMetrics";
import ApplicationStatusChart from "@/components/dashboard/ApplicationStatusChart";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import MetricCard from "@/components/dashboard/MetricCard";
import RecentApplications from "@/components/dashboard/RecentApplications";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/auth-session";
import { Metric, Summary } from "@/lib/types/dashboard";
import {
  Bookmark,
  Clock3,
  FileText,
  TrendingUpIcon,
  CheckCircle2,
  FileXCorner,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";

function formatInterviewCountdown(days: number | null) {
  if (days == null) return "Nenhuma agendada";
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `Próxima em ${days} dias`;
}

export default async function DashboardPage() {
  const [session, metricsResult, recentResult] = await Promise.all([
    requireAuth(),
    getDashboardMetrics(),
    getRecentApplications(),
  ]);
  if (!metricsResult.success || !recentResult.success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">
          Não foi possível carregar o dashboard
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente novamente em alguns instantes.
        </p>
      </div>
    );
  }

  const { metrics, statusDistribution } = metricsResult.data;
  const { applications } = recentResult.data;

  const firstName = session.user.name.trim().split(/\s+/)[0];

  const metricCards: Metric[] = [
    {
      label: "Vagas Salvas",
      value: String(metrics.savedJobs),
      detail: `Aguardando candidatura`,
      icon: Bookmark,
      iconBg: "#5b4fe518",
      iconColor: "#4f46e5",
      iconFilled: true
    },
    {
      label: "Candidaturas Ativas",
      value: String(metrics.activeApplications),
      detail: `${metrics.applicationsThisWeek} enviadas esta semana`,
      icon: FileText,
      iconBg: "#16a34a18",
      iconColor: "#16a34a",
    },
    {
      label: "Candidaturas Encerradas",
      value: String(metrics.closedApplications),
      detail: "Rejeitadas, desistências ou contratações",
      icon: Clock3,
      iconBg: "#d9770618",
      iconColor: "#d97706",
    },
    {
      label: "Taxa de Avanço para Entrevistas",
      value: String(metrics.interviewRate) + "%",
      detail: formatInterviewCountdown(metrics.daysUntilNextInterview),
      icon: TrendingUpIcon,
      iconBg: "#9333ea18",
      iconColor: "#9333ea",
    },
  ];

  const summaries: Summary[] = [
    {
      label: "Candidaturas esta Semana",
      value: String(metrics.applicationsThisWeek),
      icon: FileText,
    },
    {
      label: "Entrevistas",
      value: String(metrics.interviewingCount),
      icon: Users,
    },
    {
      label: "Proposta(s)",
      value: String(metrics.totalOffers),
      icon: CheckCircle2,
    },
    {
      label: "Desistência(s)",
      value: String(metrics.withdrawnApplications),
      icon: FileXCorner,
    },
  ];

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-5 justify-between items-center">
        <div className="flex flex-col gap-3 sm:items-start sm:justify-between">
          <p className="text-xs text-primary font-semibold uppercase tracking-widest">
            Visão geral
          </p>
          <h1 className="font-serif text-2xl font-semibold text-secondary tracking-tight sm:text-3xl">
            Olá, {firstName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="text-foreground/60 text-sm tracking-wide lg:text-base">
            Acompanhe o progresso da sua busca por oportunidades.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className={`w-full items-center gap-1 font-semibold shadow-md hover:scale-105 sm:w-auto ${buttonVariants({ variant: "default", size: "lg" })}`}
        >
          <Plus className="size-5" />
          Adicionar Vaga
        </Link>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => (
          <MetricCard key={item.label} item={item} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(15rem,0.75fr)]">
        <ApplicationStatusChart distribution={statusDistribution} />
        <DashboardSummary items={summaries} />
      </div>
      <div className="mt-5">
        <RecentApplications applications={applications} />
      </div>
    </div>
  );
}
