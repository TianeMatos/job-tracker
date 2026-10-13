"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteJob } from "@/actions/job";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteJobButton({
  jobId,
  label,
}: {
  jobId: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await deleteJob(jobId);
        if (result.success) {
          toast.add({
            type: "success",
            description: "Vaga excluída com sucesso.",
          });
        } else {
          toast.add({
            type: "error",
            description: "Não foi possível excluir a vaga.",
          });
        }
      } catch {
        toast.add({
          type: "error",
          description: "Não foi possível excluir a vaga.",
        });
      } finally {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) setOpen(next);
      }}
    >
      <AlertDialogTrigger
        render={(props) => (
          <Button
            {...props}
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Excluir vaga: ${label || "sem título"}`}
            className="cursor-pointer transition-colors bg-transparent! hover:bg-destructive/10! hover:text-destructive!"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        )}
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir esta vaga?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">{label}</span> será removida. Essa
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant={"outline"}
            size={"default"}
            disabled={isPending}
            className={
              "cursor-pointer bg-transparent! hover:bg-muted-foreground/10!"
            }
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant={"destructive"}
            size={"default"}
            disabled={isPending}
            onClick={handleDelete}
            className={"cursor-pointer"}
          >
            {isPending ? (
              <>
                <Loader2
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
