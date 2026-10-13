import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { JobListItem } from "@/lib/types/jobs";
import { cn, formatSavedAt } from "@/lib/utils";
import { EMPLOYMENT_LABEL, WORKPLACE_LABEL } from "@/lib/job-labels";
import { Globe, MapPin, Pencil, Send, Wallet } from "lucide-react";
import { DeleteJobButton } from "./DeleteJobButton";
import Link from "next/link";

export function JobCard({ item }: { item: JobListItem }) {
  const meta = [
    item.location,
    item.workplaceType && item.workplaceType !== "UNSPECIFIED"
      ? WORKPLACE_LABEL[item.workplaceType]
      : null,
    item.employmentType ? EMPLOYMENT_LABEL[item.employmentType] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="rounded-2xl gap-y-1 gap-x-0 p-6 border border-border bg-card shadow-card transition-all xl:p-7">
      <CardHeader className="p-0 gap-1">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle
              id={`job-${item.id}-title`}
              className="text-base line-clamp-2"
            >
              <Link href={`/jobs/${item.id}`} className="hover:underline">
                {item.role}
              </Link>
            </CardTitle>

            <CardDescription className="text-sm text-foreground/65 font-medium truncate">
              {item.company}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="mb-2 shrink-0 font-semibold bg-brand-gold/10 text-brand-gold sm:mb-0"
          >
            Salva
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3 sm:gap-1.5">
        {meta && (
          <p className="flex items-center gap-2 text-xs text-secondary/75 sm:text-sm">
            <MapPin className="size-3.5 shrink-0" />
            {meta}
          </p>
        )}
        {item.salary && (
          <p className="flex items-center gap-2 text-xs font-medium sm:text-sm">
            <Wallet className="size-3.5 shrink-0" />
            {item.salary}
          </p>
        )}
        <p className="flex items-center gap-2 text-xs text-secondary/75 sm:text-sm">
          <Globe className="size-3.5 shrink-0" />
          {item.source
            ? `${item.source} · Salva ${formatSavedAt(item.createdAt)}`
            : `Salva ${formatSavedAt(item.createdAt)}`}
        </p>
      </CardContent>
      <CardFooter className="p-0 mt-4 gap-1 border-t border-border [.border-t]:pt-3">
        <Link
          href={`/jobs/${item.id}/apply`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "mr-auto py-5 text-xs sm:text-sm",
          )}
        >
          <Send className="size-3.5" aria-hidden="true" />
          Candidatar-se
        </Link>
        <Link
          href={`/jobs/${item.id}/edit`}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "transition-colors bg-transparent! hover:bg-primary/10! hover:text-primary!",
          )}
          aria-label="Editar Vaga"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Link>
        <DeleteJobButton
          jobId={item.id}
          label={`${item.role} - ${item.company}`}
        />
      </CardFooter>
    </Card>
  );
}
