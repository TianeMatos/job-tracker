"use client";

import { Loader2, Send } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { toDateInputValue } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { APPLY_STATUS_LABEL, ApplyStatus } from "@/lib/job-labels";
import { toast } from "../ui/toast";
import { applyToJob } from "@/actions/application";

type ApplyToJobDialogProps = {
  jobId: string;
  jobRole: string;
  jobCompany: string;
};

export function ApplyToJobDialog({
  jobId,
  jobRole,
  jobCompany,
}: ApplyToJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [appliedAt, setAppliedAt] = useState(toDateInputValue(new Date()));
  const [status, setStatus] = useState<ApplyStatus>("APPLIED");

  function resetForm() {
    setStatus("APPLIED");
    setAppliedAt(toDateInputValue(new Date()));
    setError(null);
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
    setError(null);

    startTransition(async () => {
      const result = await applyToJob({ jobId, status, appliedAt });
      if (!result.success) {
        setError(
          result.error.message ?? "Não foi possível registrar a candidatura.",
        );
        return;
      }
      toast.add({
        type: "success",
        description: `Candidatura a "${jobRole}" registrada!`,
      });

      resetForm();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={(props) => (
          <Button
            {...props}
            variant="default"
            size="sm"
            className={"mr-auto py-5 text-xs sm:text-sm"}
          >
            <Send className="size-3.5" aria-hidden="true" />
            Candidatar-se
          </Button>
        )}
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Registrar Candidatura</DialogTitle>
          <DialogDescription>
            Confirme os dados para adicionar esta vaga às suas candidaturas.
          </DialogDescription>

          <div className="flex flex-col gap-0.5 mt-3 bg-brand-gold/20 rounded-2xl p-3">
            <p className="text-xs text-primary font-medium uppercase tracking-widest">
              Vaga
            </p>
            <h2 className="font-serif text-sm font-medium text-secondary">
              {jobRole}
            </h2>
            <p className="text-foreground/60 text-xs">{jobCompany}</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                items={APPLY_STATUS_LABEL}
                value={status}
                onValueChange={(v) => setStatus(v as ApplyStatus)}
                disabled={isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(APPLY_STATUS_LABEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="appliedAt">Data da candidatura</FieldLabel>
              <Input
                id="appliedAt"
                name="appliedAt"
                type="date"
                value={appliedAt}
                onChange={(e) => setAppliedAt(e.target.value)}
                max={toDateInputValue(new Date())}
                disabled={isPending}
              />
              <FieldDescription className="px-2 tracking-tight leading-snug">
                Preenchida automaticamente com a data atual, mas pode ser
                alterada.
              </FieldDescription>
            </Field>
          </FieldGroup>
          {error && (
            <FieldError className="mt-3 px-3 py-2 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </FieldError>
          )}
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              className="cursor-pointer bg-transparent! hover:bg-muted-foreground/10! py-5"
            >
              Cancelar
            </Button>
            <Button
              variant={"default"}
              type="submit"
              disabled={isPending}
              className="cursor-pointer py-5 px-4"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              Confirmar candidatura
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
