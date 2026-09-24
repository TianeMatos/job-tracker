import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Summary } from "@/lib/types/dashboard";

export default function DashboardSummary({ items }: { items: Summary[] }) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="text-base font-bold text-secondary">
          Resumo
        </CardTitle>
        <CardDescription className="mt-1 text-xs text-foreground/65 sm:text-sm">
          Seu desempenho até agora
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {items.length !== 0 ? (
          items.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center place-content-between gap-3 py-4 first:pt-2 last:pb-0"
            >
              <span className="grid size-7 sm:size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-sm text-secondary/75">
                {item.label}
              </span>
              <span className="ml-1 text-lg font-bold text-card-foreground">
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
