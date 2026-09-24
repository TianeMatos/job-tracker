import KanbanIllustration from "@/components/auth/KanbanIllustration";
import LogoMark from "@/components/shared/Logo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col justify-between w-[45%] min-h-screen p-12 relative overflow-hidden bg-secondary">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-30 -left-20 w-105 h-105 rounded-full opacity-20 blur-[120px] bg-primary" />
        <div className="absolute -bottom-20 -right-15 w-75 h-75 rounded-full opacity-10 blur-[100px] bg-primary" />
        <div className="relative z-10 py-5">
          <LogoMark
            showText
            sizeText="text-3xl"
            size={50}
            className="text-primary-foreground"
          />
        </div>
        <div className="relative z-10 space-y-5 py-9">
          <div className="pb-5">
            <KanbanIllustration />
          </div>
          <p className="text-white font-serif text-[1.75rem] leading-tight font-semibold tracking-tight pt-2">
            Organize.
            <br />
            Acompanhe.
            <br />
            Conquiste.
          </p>
          <div className="space-y-3">
            <p className="text-muted text-[1.02rem] leading-snug">
              Organize sua busca por emprego em um só lugar.
            </p>
            <p className="text-gray-400 text-[0.955rem] leading-relaxed">
              Centralize suas vagas, acompanhe seus processos seletivos e
              mantenha tudo sob controle.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
