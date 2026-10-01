// app/dashboard/error.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" aria-hidden="true" />
      </div>

      <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-secondary sm:text-3xl">
        Algo Deu Errado!!
      </h1>

      <p className="mt-3 max-w-md text-sm text-foreground/65 sm:text-base">
        Não Conseguimos Carregar o Dashboard.
      </p>
      {error.message && (
        <p className="max-w-md text-sm text-foreground/65 sm:text-base">
          {error.message}
        </p>
      )}

      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Código: {error.digest}
        </p>
      )}

      <Button
        variant={"default"}
        onClick={reset}
        size="lg"
        className="mt-8 font-semibold shadow-md cursor-pointer"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Recarregar Página
      </Button>
    </div>
  );
}
