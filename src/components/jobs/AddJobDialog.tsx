"use client";

import { Bookmark, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState, useTransition } from "react";

import {
  ApplyStatus,
  EMPLOYMENT_LABEL,
  WORKPLACE_LABEL,
} from "@/lib/job-labels";
import { toast } from "../ui/toast";

import { createJob } from "@/actions/job";
import { JobFields } from "./JobFields";
import { FieldGroup, FieldSeparator } from "../ui/field";
import { FormCheckbox } from "../shared/FormCheckbox";
import { ApplicationFields } from "../shared/ApplicationFields";
import { JobDialogShell } from "./JobDialogShell";

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string[]>>>({});
  const [workplaceType, setWorkplaceType] = useState<
    keyof typeof WORKPLACE_LABEL | null
  >("UNSPECIFIED");
  const [employmentType, setEmploymentType] = useState<
    keyof typeof EMPLOYMENT_LABEL | null
  >(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>("APPLIED");

  function resetForm() {
    setGeneralError(null);
    setErrors({});
    setWorkplaceType("UNSPECIFIED");
    setEmploymentType(null);
    setHasApplied(false);
    setApplyStatus("APPLIED");
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
      hasApplied: hasApplied,
      application: hasApplied
        ? {
            status: applyStatus,
            appliedAt: formData.get("appliedAt"),
          }
        : null,
    };

    startTransition(async () => {
      try {
        const result = await createJob(input);

        if (!result.success) {
          setErrors(result.error.fields ?? {});
          setGeneralError(result.error.message);
          return;
        }

        toast.add({
          type: "success",
          description: input.hasApplied
            ? `A candidatura "${input.role || "vaga"}" foi registrada!`
            : `Vaga salva com sucesso!`,
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
            size="lg"
            className={
              "w-full items-center gap-1 font-semibold shadow-md cursor-pointer sm:w-auto"
            }
          >
            <Plus className="size-5" aria-hidden="true" />
            Adicionar Vaga
          </Button>
        )}
      />
      <JobDialogShell
        icon={Bookmark}
        title="Nova Vaga"
        description="Salve uma oportunidade para analisar e acompanhar depois."
        submitLabel={hasApplied ? "Salvar vaga e candidatura" : "Salvar vaga"}
        pendingLabel="Salvando..."
        isPending={isPending}
        generalError={generalError}
        onSubmit={handleSubmit}
      >
        <JobFields
          errors={errors}
          disabled={isPending}
          workplaceType={workplaceType}
          onWorkplaceTypeChange={setWorkplaceType}
          employmentType={employmentType}
          onEmploymentTypeChange={setEmploymentType}
        />

        <FieldSeparator />

        <FieldGroup className="py-5">
          <h2 className="mb-0 text-base font-semibold">Candidatura</h2>
          <FormCheckbox
            name="hasApplied"
            label="Já se candidatou a esta vaga?"
            description="Marque esta opção para registrar sua candidatura junto com a vaga."
            checked={hasApplied}
            onCheckedChange={setHasApplied}
            disabled={isPending}
          />
          {hasApplied && (
            <ApplicationFields
              className="p-4 rounded-sm border-l-2 border-primary/40 bg-accent/30 sm:grid-cols-2"
              status={applyStatus}
              onStatusChange={setApplyStatus}
              errors={{
                status: errors["application.status"],
                appliedAt: errors["application.appliedAt"],
              }}
              disabled={isPending}
              autoFocusStatus={hasApplied}
            />
          )}
        </FieldGroup>
      </JobDialogShell>
    </Dialog>
  );
}
