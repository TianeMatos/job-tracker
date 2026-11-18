"use client";

import { AlertCircle, Loader2, type LucideIcon } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type JobDialogShellProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  generalError: string | null;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  contentClassName?: string;
};

export function JobDialogShell({
  icon: Icon,
  title,
  description,
  submitLabel,
  pendingLabel,
  isPending,
  generalError,
  onSubmit,
  children,
  contentClassName,
}: JobDialogShellProps) {
  return (
    <DialogContent className={cn(
        "grid-rows-[auto_minmax(0,1fr)] gap-0 bg-card p-0",
        "max-h-[calc(100dvh-2rem)] w-full sm:max-w-2xl",
        contentClassName
      )}>
      <DialogHeader className="px-4 py-5 gap-1 text-left border-b border-border sm:px-5">
        <DialogTitle className="text-lg font-bold flex items-center gap-1 sm:text-xl">
          <Icon className="size-3.5 text-primary sm:size-4.5" aria-hidden="true" />
          <span>{title}</span>
        </DialogTitle>
        <DialogDescription className="pl-1">{description}</DialogDescription>
      </DialogHeader>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden"
      >
        <div className="space-y-5 px-4 py-5 min-h-0 overflow-y-auto overscroll-contain sm:px-5">
          {generalError && (
            <div role="alert">
              <FieldError className="flex gap-2 px-3 py-2 items-center rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="size-4" />
                {generalError}
              </FieldError>
            </div>
          )}
          
          {children}
        </div>

        <DialogFooter className="py-4 px-5 gap-2 rounded-b-lg border-t border-border bg-background/50 sm:gap-5">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="cursor-pointer bg-transparent! hover:bg-muted-foreground/10! py-5"
              >
                Cancelar
              </Button>
            }
          />
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer py-5 px-4"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}