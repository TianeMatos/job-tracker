"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Wallet,
  Calendar,
  BriefcaseBusiness,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobListItem } from "@/lib/types/jobs";
import { ApplyToJobDialog } from "./ApplyToJobDialog";
import { DeleteJobDialog } from "./DeleteJobDialog";
import { WORKPLACE_LABEL, EMPLOYMENT_LABEL } from "@/lib/job-labels";
import { RichJobDescription } from "./RichJobDescription";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function JobDetailsDialog({ item }: { item: JobListItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Ver detalhes da vaga: ${item.role}`}
                  className="cursor-pointer transition-colors bg-transparent! hover:bg-brand-gold/10! hover:text-brand-gold!"
                >
                  <Eye className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        ></TooltipTrigger>
        <TooltipContent>Detalhes</TooltipContent>
      </Tooltip>

      <DialogContent className="p-0 gap-0 max-h-[90dvh] bg-card overflow-hidden flex flex-col rounded-2xl text-secondary sm:max-w-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border text-left shrink-0 gap-1">
          <DialogTitle className="text-lg font-bold">
            Detalhes da Vaga
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm">
            Informações completas sobre a sua vaga.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8 overflow-y-auto flex-1">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                <Building2 className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary leading-tight sm:text-xl">
                  {item.role}
                </h2>
                <p className="text-xs wrap-break-word sm:text-sm">{item.company}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.employmentType && (
                    <Badge
                      variant="secondary"
                      className="px-3 bg-brand-gold/75 text-[0.65rem] sm:text-sm"
                    >
                      {EMPLOYMENT_LABEL[item.employmentType]}
                    </Badge>
                  )}
                  {item.source && (
                    <Badge
                      variant="secondary"
                      className="px-3 bg-brand-gold/75 text-[0.65rem] sm:text-sm"
                    >
                      {item.source}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 sm:w-auto">
              <ApplyToJobDialog
                jobId={item.id}
                jobRole={item.role}
                jobCompany={item.company}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-1 py-6 border-t border-b border-border/60 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-1">
              <div className="p-2 shrink-0">
                <Wallet className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary/60 items-center">
                  Salário
                </span>
                <span className="text-sm font-semibold wrap-break-word leading-">
                  {item.salary || "Não informado"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="p-2 shrink-0">
                <BriefcaseBusiness
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary/60">Modalidade</span>
                <span className="text-sm font-semibold truncate">
                  {WORKPLACE_LABEL[item.workplaceType]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="p-2 shrink-0">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary/60">Local</span>
                <span className="text-sm font-semibold">
                  {item.location || "Remoto"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="p-2 shrink-0">
                <Calendar className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary/60 whitespace-nowrap">
                  Prazo de Inscrição
                </span>
                <span className="text-sm font-semibold">
                  {item.deadline
                    ? new Date(item.deadline).toLocaleDateString("pt-BR")
                    : "Sem prazo"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-secondary mb-3">
              Descrição da vaga
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 whitespace-pre-wrap">
              <RichJobDescription content={item.description ?? ""} />
            </div>
          </div>

          {item.jobUrl && (
            <a
              href={item.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Acesse a publicação original
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-background/50 flex-row justify-end shrink-0">
          <div className="flex gap-2">
            <DeleteJobDialog
              jobId={item.id}
              label={`${item.role} - ${item.company}`}
            />
          </div>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer hover:bg-muted-foreground/30! py-4"
              >
                Fechar
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
