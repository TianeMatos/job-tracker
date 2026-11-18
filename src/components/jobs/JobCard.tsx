import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobListItem } from "@/lib/types/jobs";
import { formatSavedAt } from "@/lib/utils";
import { EMPLOYMENT_LABEL, WORKPLACE_LABEL } from "@/lib/job-labels";
import { Globe, MapPin, Wallet } from "lucide-react";
import { DeleteJobDialog } from "./DeleteJobDialog";
import Link from "next/link";
import { ApplyToJobDialog } from "./ApplyToJobDialog";
import { EditJobDialog } from "./EditJobDialog";

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
            <CardTitle>
              <h3 id={`job-${item.id}-title`} className="capitalize text-base line-clamp-2">
                <Link href={`/jobs/${item.id}`} className="hover:text-primary hover:underline">
                  {item.role}
                </Link>
              </h3>
            </CardTitle>

            <CardDescription className="capitalize text-sm text-foreground/65 font-medium truncate">
              {item.company}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="mb-2 shrink-0 font-medium bg-brand-gold/10 text-brand-gold sm:mb-0"
          >
            Não Aplicada
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-3 sm:gap-1.5">
        {meta && (
          <p className="flex items-center gap-2 text-xs text-secondary/75 sm:text-sm">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {meta}
          </p>
        )}
        {item.salary && (
          <p className="flex items-center gap-2 text-xs font-medium sm:text-sm">
            <Wallet className="size-3.5 shrink-0" aria-hidden="true" />
            {item.salary}
          </p>
        )}
        <p className="flex items-center gap-2 text-xs text-secondary/75 sm:text-sm">
          <Globe className="size-3.5 shrink-0" aria-hidden="true" />
          {item.source
            ? `${item.source} · Salva ${formatSavedAt(item.createdAt)}`
            : `Salva ${formatSavedAt(item.createdAt)}`}
        </p>
      </CardContent>
      <CardFooter className="p-0 pt-3! mt-4 gap-1 border-t border-border">
        <ApplyToJobDialog jobId={item.id} jobRole={item.role} jobCompany={item.company} />
        <EditJobDialog item={item} />
        <DeleteJobDialog
          jobId={item.id}
          label={`${item.role} - ${item.company}`}
        />
      </CardFooter>
    </Card>
  );
}
