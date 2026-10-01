import { ArrowRight, ChevronRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { STATUS_CONFIG } from "@/lib/status";
import { Application } from "@/lib/types/dashboard";

export default function RecentApplications({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-card gap-0 last:pb-0">
      <CardHeader className="grid grid-cols-2 grid-rows-2 gap-x-3 border-b border-b-border">
        <CardTitle className="text-base font-bold text-secondary tracking-tight">
          Candidaturas Recentes
        </CardTitle>
        <CardDescription className="col-span-1 mt-1 text-xs text-foreground/65 sm:text-sm">
          Últimas Movimentações Registradas
        </CardDescription>
        <CardAction>
          <Link
            href="/applications"
            className={`px-2 py-3 text-xs text-secondary/50 transition-all hover:bg-primary/12 dark:hover:bg-primary/12 dark:hover:text-primary hover:scale-105 sm:px-4 sm:py-5 sm:text-sm ${buttonVariants({ variant: "ghost", size: "default" })}`}
          >
            Ver Todas
            <ArrowRight aria-hidden="true" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 mt-0 border-spacing-0 gap-y-0 divide-y divide-border">
        {applications.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            Nenhuma candidatura registrada ainda.
          </p>
        ) : (
          applications.map((item) => {
            const statusKey = item.status as keyof typeof STATUS_CONFIG;
            const status = STATUS_CONFIG[statusKey];
            return (
              <Link
                key={item.id}
                href={`/applications/${item.id}`}
                className="grid grid-cols-[40px_1fr_24px] items-center gap-y-3 gap-x-4 py-4 px-6 transition-colors hover:bg-primary/12 sm:grid-cols-[40px_3fr_1fr_24px] sm:grid-rows-none"
              >
                <div className="grid size-9 place-items-center rounded-lg border border-border bg-accent-foreground/85 text-xs font-bold text-secondary-foreground">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-card-foreground">
                    {item.role}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.company} · {item.date}
                  </p>
                </div>
                <Badge
                  variant={"default"}
                  className={`p-2.5 justify-self-start col-start-2 row-start-2 max-w-full truncate sm:col-start-auto sm:row-start-auto sm:justify-self-end ${status.badgeClassName} `}
                >
                  {status.label}
                </Badge>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground justify-self-end col-start-3 row-start-1 sm:col-start-auto sm:row-start-auto" aria-hidden="true" />
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
