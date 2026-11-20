"use client";

import { BriefcaseBusiness, Send, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState, useTransition } from "react";
import { ApplyStatus } from "@/lib/job-labels";
import { toast } from "../ui/toast";
import { applyToJob } from "@/actions/application";
import { ApplicationFields } from "../shared/ApplicationFields";
import { JobDialogShell } from "./JobDialogShell";
import { cn } from "@/lib/utils";

type ApplyToJobDialogProps = {
  jobId: string;
  jobRole: string;
  jobCompany: string;
  className?: string; 
};

export function ApplyToJobDialog({
  jobId,
  jobRole,
  jobCompany,
  className,
}: ApplyToJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({});
  const [status, setStatus] = useState<ApplyStatus>("APPLIED");

  function resetForm() {
    setStatus("APPLIED");
    setGeneralError(null);
    setErrors({});
  }

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
    if (!next) {
      resetForm();
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError(null);
    setErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await applyToJob({
          jobId,
          status,
          appliedAt: formData.get("appliedAt"),
        });

        if (!result.success) {
          setErrors(result.error.fields ?? {});
          setGeneralError(result.error.message);

          const firstField = Object.keys(result.error.fields ?? {})[0];
          if (firstField) {
            requestAnimationFrame(() => {
              document
                .querySelector<HTMLElement>(`[name="${firstField}"]`)
                ?.focus();
            });
          }
          return;
        }

        toast.add({
          type: "success",
          description: `A candidatura "${jobRole}" foi registrada!`,
        });
        resetForm();
        setOpen(false);
      } catch {
        setGeneralError("Algo deu errado. Tente novamente.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={(props) => (
          <Button
            {...props}
            variant="default"
            size="default"
            className={cn("py-5 px- text-xs sm:text-sm cursor-pointer", className)}
          >
            Candidatar-se
          </Button>
        )}
      />

      <JobDialogShell
        icon={SendIcon}
        title="Registrar Candidatura"
        description="Confirme os dados para adicionar esta vaga às suas candidaturas."
        submitLabel={"Salvar"}
        pendingLabel="Salvando..."
        isPending={isPending}
        generalError={generalError}
        onSubmit={handleSubmit}
        contentClassName="h-auto max-h-[90dvh] sm:max-w-md"
      >
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness className="size-4 text-primary" />
          <h3 className="text-sm font-medium">Informações da vaga</h3>
        </div>
        <div className="p-3 rounded-sm border-l-2 border-primary/70 bg-accent/40 ">
          <h4 className="font-serif text-sm font-medium text-secondary">
            {jobRole}
          </h4>
          <p className="text-foreground/80 text-xs">{jobCompany}</p>
        </div>

        <ApplicationFields
          status={status}
          onStatusChange={setStatus}
          errors={{
            status: errors["application.status"],
            appliedAt: errors["application.appliedAt"],
          }}
          disabled={isPending}
        />
      </JobDialogShell>
    </Dialog>
  );
}
