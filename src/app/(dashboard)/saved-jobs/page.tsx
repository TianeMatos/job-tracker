import { getJobs } from "@/actions/job";
import { JobCard } from "@/components/jobs/JobCard";
import { PaginationComponent } from "@/components/shared/Pagination";
import { buttonVariants } from "@/components/ui/button";
import { unwrapAction } from "@/lib/action-helpers";
import { Bookmark, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function SavedJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const rawPage = params.page;

  if (
    rawPage !== undefined &&
    (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(Number(rawPage)))
  ) {
    notFound();
  }

  const page = rawPage === undefined ? 1 : Number(rawPage);

  const { jobs, metaData } = await getJobs({ page, limit: 6 }).then(
    unwrapAction,
  );

  if (page > metaData.totalPages && metaData.totalPages > 0) {
    redirect(`/saved-jobs?page=${metaData.totalPages}`);
  }

  return (
    <div className="container">
      <section className="mb-7 grid grid-cols-1 gap-5 place-content-between items-center sm:grid-cols-[1fr_190px] rounded-">
        <div className="flex flex-col gap-3 sm:items-start sm:justify-between">
          <p className="text-xs text-primary font-semibold uppercase tracking-widest">
            Oportunidades
          </p>
          <h1 className="font-serif text-2xl font-semibold text-secondary tracking-tight sm:text-3xl">
            Vagas Salvas
          </h1>
          <p className="text-foreground/60 text-sm tracking-wide lg:text-base">
            Organize as oportunidades que você encontrou e acompanhe seu
            processo.
          </p>
        </div>
        {jobs.length !== 0 && (
          <Link
            href="/jobs/new"
            className={`w-full items-center gap-1 font-semibold shadow-md sm:w-auto ${buttonVariants({ variant: "default", size: "lg" })}`}
          >
            <Plus className="size-5" />
            Adicionar Vaga
          </Link>
        )}
      </section>
      <section className="pt-2 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
          <div className="col-span-full ml-2 text-sm font-medium">
            {metaData.total > 0 && (
              <p>
                {metaData.total}{" "}
                {metaData.total === 1 ? "vaga salva" : "vagas salvas"}
              </p>
            )}
          </div>
        {jobs.length !== 0 ? (
          jobs.map((job) => (
            <article key={job.id} >
              <JobCard item={job} />
            </article>
          ))
        ) : (
          <div className="col-span-full place-items-center py-16 px-6 bg-card border border-border rounded-2xl shadow-card">
            <div className="mb-6 p-5 w-fit bg-primary/13 rounded-2xl">
              <Bookmark className="size-8 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mb-1 text-2xl font-serif font-semibold">
              Nenhuma Vaga Salva Ainda
            </h2>
            <p className="mb-8 text-muted-foreground text-base">
              Salve oportunidades que você encontrar para acompanhá-las depois.
            </p>
            <div>
              <Link
                href={`/jobs/new`}
                className={`${buttonVariants({ size: "lg", variant: "default", className: "self-center px-7" })}`}
              >
                <Plus className="size-4 " />
                Adicionar Primeira Vaga
              </Link>
            </div>
          </div>
        )}
      </section>
      {jobs.length > 0 && metaData.totalPages > 1 && (
        <section className="my-5 pt-4">
          <PaginationComponent
            currentPage={metaData.page}
            totalPages={metaData.totalPages}
          />
        </section>
      )}
    </div>
  );
}
