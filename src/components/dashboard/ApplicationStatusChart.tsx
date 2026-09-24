"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { STATUS_CONFIG, STATUS_ORDER } from "@/lib/status";
import { ApplicationStatus } from "@/schemas/application";

const chartConfig = {
  value: { label: "Candidaturas" },
  ...Object.fromEntries(
    STATUS_ORDER.map((key) => [
      key,
      {
        label: STATUS_CONFIG[key].label,
        color: `var(--status-${key.toLowerCase()})`,
      },
    ]),
  ),
} satisfies ChartConfig;

export default function ApplicationStatusChart({
  distribution,
}: {
  distribution: Partial<Record<ApplicationStatus, number>>;
}) {
  const data = STATUS_ORDER.map((key) => ({
    key,
    label: STATUS_CONFIG[key].label,
    value: distribution[key] ?? 0,
    fill: `var(--color-${key})`,
  }));

  const hasData = data.some((d) => d.value > 0);
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-secondary">
            Progresso das Candidaturas
          </h2>
          <p className="mt-1 text-xs text-foreground/65 sm:text-sm">
            Distribuição por Etapa do Processo
          </p>
        </div>
      </div>

      {hasData ? (
        <>
          <ChartContainer
            config={chartConfig}
            className="mt-4 w-full sm:min-w-sm h-50 sm:h-55 text-[10px] sm:text-xs"
          >
            <table className="sr-only">
              <caption>Distribuição de Candidaturas por Etapa</caption>
              <thead>
                <tr>
                  <th scope="col">Etapa</th>
                  <th scope="col">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.key}>
                    <td>{d.label}</td>
                    <td>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 16, left: 10, right: 12, bottom: 16 }}
            >
              <XAxis
                dataKey="label"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                angle={-28}
                textAnchor="middle"
                stroke="var(--secondary)"
                interval={0}
              />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                <LabelList
                  position="top"
                  className="text-xs fill-secondary font-semibold"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          <p className="mt-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Veja como suas candidaturas estão distribuídas entre as etapas do
            processo.
          </p>
        </>
      ) : (
        <p className="mt-6 py-10 text-center text-sm text-muted-foreground">
          Você ainda não tem candidaturas registradas.
        </p>
      )}
    </section>
  );
}
