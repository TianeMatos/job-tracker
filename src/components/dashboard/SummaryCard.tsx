import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Summary } from "@/lib/types/dashboard";

export default function SummaryCard({ items }: { items: Summary[] }) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-bold text-secondary tracking-tight">
          Resumo
        </CardTitle>
        <CardDescription className="mt-1 text-xs text-foreground/75 sm:text-sm">
          Seu desempenho até agora
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-4 gap-y-9 divide-y divide-border">
        {items.length !== 0 ? (
          items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-5 py-1 last:pb-0"
            >
              <span className="text-sm font-medium text-foreground/65 leading-tight mb-1.5">
                {item.label}
              </span>
              <span className="text-2xl font-bold text-card-foreground tabular-nums leading-none" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-secondary/50">
            Sem dados disponíveis
          </p>
        )}
      </CardContent>
    </Card>
  );
}
