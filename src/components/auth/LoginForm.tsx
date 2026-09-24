"use client";

import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { EyeOff, Eye, Loader2, AlertCircleIcon } from "lucide-react";
import { signIn } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false)


  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn({
        email: fd.get("email"),
        password: fd.get("password"),
      });
      if (!result.success) {
        setError(result.error.message);
        return;
      }

      router.push("/dashboard");
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="h-12 px-4 py-3 text-secondary bg-primary-foreground placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 px-4 py-3 text-secondary bg-primary-foreground placeholder:text-gray-400"
          />
          <Button
            type="button"
            variant={"ghost"}
            size={"icon-xs"}
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-4.5 text-secondary" />
            ) : (
              <Eye className="size-4.5 text-secondary" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex gap-1 items-center text-sm text-destructive bg-destructive/10 rounded-sm p-2"
        >
          <AlertCircleIcon className="size-4 mx-1" />
          <span>{error.split("\n")[0].split("✖")[1]}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full bg-brand-gold/90 text-base font-semibold hover:bg-brand-gold transition-colors cursor-pointer"
        disabled={isPending}
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
