import { Bone } from "@/components/dashboard/Bone";

export default function SavedJobsLoading() {
  return (
    <main
      className="container mr-auto"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando vagas salvas"
    >
      
      <section className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_190px]">
        <div className="flex flex-col gap-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-8 w-48 sm:h-9" />
          <Bone className="h-4 w-full max-w-lg" />
        </div>

        <Bone className="h-10 w-full rounded-md sm:w-47.5" />
      </section>

      <section className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-2">

        <div className="col-span-full ml-2">
          <Bone className="h-4 w-24" />
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <article
            key={i}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex flex-col gap-4">

              <div className="space-y-3">
                <Bone className="h-5 w-3/4 max-w-56" />
                <Bone className="h-4 w-2/5 max-w-36" />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Bone className="h-6 w-20 rounded-full" />
                <Bone className="h-6 w-24 rounded-full" />
                <Bone className="h-6 w-20 rounded-full" />
              </div>
 
              <div className="space-y-2">
                <Bone className="h-3.5 w-full" />
                <Bone className="h-3.5 w-4/5" />
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                <Bone className="h-3 w-28" />

                <div className="flex items-center gap-2">
                  <Bone className="h-9 w-24 rounded-md" />
                  <Bone className="size-9 rounded-md" />
                  <Bone className="size-9 rounded-md" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="my-5 flex justify-center gap-2 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="size-9 rounded-md" />
        ))}
      </section>
    </main>
  );
}