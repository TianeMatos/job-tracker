import { Bone } from "@/components/dashboard/Bone";

export default function DashboardLoading() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando dashboard"
    >
      {/* Sidebar (desktop) */}
      <aside className="sidebar-grid fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <Bone className="size-9 rounded-lg" />
          <Bone className="h-4 w-28" />
        </div>
        <div className="mt-12 space-y-1">
          <Bone className="mb-3 h-3 w-14 px-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-9 w-full" />
          ))}
        </div>
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <Bone className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-2.5 w-32" />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
            <Bone className="size-8 lg:hidden" />
            <Bone className="size-9 rounded-lg" />
            <div className="flex items-center gap-2">
              <Bone className="hidden h-8 w-px sm:block" />
              <Bone className="size-8 rounded-full" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-360 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
          {/* Saudação */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Bone className="h-3 w-20" />
              <Bone className="mt-3 h-7 w-52 sm:h-8" />
              <Bone className="mt-3 h-4 w-80 max-w-full" />
            </div>
            <Bone className="h-9 w-44 rounded-md" />
          </div>

          {/* Métricas */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Bone className="h-3.5 w-24" />
                    <Bone className="h-8 w-12" />
                  </div>
                  <Bone className="size-10 rounded-lg" />
                </div>
                <Bone className="mt-4 h-3 w-36" />
              </div>
            ))}
          </div>

          {/* Gráfico + resumo */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <Bone className="h-5 w-56" />
              <Bone className="mt-2 h-3.5 w-52" />
              <div className="mt-8 flex h-44 items-end gap-2 border-b border-border sm:h-48 sm:gap-4">
                {[64, 40, 24, 16, 8, 32, 4].map((h, i) => (
                  <div
                    key={i}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <Bone className="h-3 w-4" />
                    <Bone
                      className="w-full max-w-9"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2 sm:gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Bone key={i} className="h-2.5 min-w-0 flex-1" />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
              <Bone className="h-5 w-20" />
              <Bone className="mt-2 h-3.5 w-40" />
              <div className="mt-6 divide-y divide-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <Bone className="size-9 rounded-lg" />
                    <Bone className="h-3.5 min-w-0 flex-1" />
                    <Bone className="h-5 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Candidaturas recentes */}
          <div className="mt-5 rounded-2xl border border-border bg-card shadow-card">
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <Bone className="h-5 w-44" />
              <Bone className="mt-2 h-3.5 w-56" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-4 sm:px-6"
                >
                  <Bone className="size-10 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bone className="h-3.5 w-40" />
                    <Bone className="h-3 w-52" />
                  </div>
                  <Bone className="hidden h-6 w-24 rounded-full sm:block" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
