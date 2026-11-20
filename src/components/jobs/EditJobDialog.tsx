"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateJob } from "@/actions/job";
import { toast } from "@/components/ui/toast";
import { EMPLOYMENT_LABEL, WORKPLACE_LABEL } from "@/lib/job-labels";
import { JobFields } from "./JobFields";
import { JobDialogShell } from "./JobDialogShell";
import { JobListItem } from "@/lib/types/jobs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function EditJobDialog({ item }: { item: JobListItem }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({});
  const [workplaceType, setWorkplaceType] = useState<
    keyof typeof WORKPLACE_LABEL | null
  >(item.workplaceType ?? "UNSPECIFIED");
  const [employmentType, setEmploymentType] = useState<
    keyof typeof EMPLOYMENT_LABEL | null
  >(item.employmentType ?? null);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    const formData = new FormData(e.currentTarget);

    const input = {
      company: formData.get("company"),
      role: formData.get("role"),
      description: formData.get("description"),
      jobUrl: formData.get("jobUrl"),
      salary: formData.get("salary"),
      location: formData.get("location"),
      source: formData.get("source"),
      deadline: formData.get("deadline"),
      workplaceType: workplaceType ?? "UNSPECIFIED",
      employmentType: employmentType ?? undefined,
    };

    startTransition(async () => {
      try {
        const result = await updateJob(item.id, input);

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
          description: "Vaga atualizada com sucesso!",
        });
        setOpen(false);
      } catch {
        setGeneralError("Algo deu errado. Tente novamente.");
      }
    });
  }

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
                  aria-label="Editar vaga"
                  className="cursor-pointer transition-colors bg-transparent! hover:bg-primary/10! hover:text-primary!"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        ></TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>

      <JobDialogShell
        icon={Pencil}
        title="Editar Vaga"
        description="Atualize os dados desta oportunidade."
        submitLabel="Salvar alterações"
        pendingLabel="Salvando..."
        isPending={isPending}
        generalError={generalError}
        onSubmit={handleSubmit}
      >
        <JobFields
          initialData={item}
          errors={errors}
          disabled={isPending}
          workplaceType={workplaceType}
          onWorkplaceTypeChange={setWorkplaceType}
          employmentType={employmentType}
          onEmploymentTypeChange={setEmploymentType}
        />
      </JobDialogShell>
    </Dialog>
  );
}
