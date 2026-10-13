import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  paramName?: string;
};

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const visible = new Set(
    [1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total),
  );
  const sorted = [...visible].sort((a, b) => a - b);

  const items: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("ellipsis");
    items.push(p);
  });

  return items;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  basePath = "",
  paramName = "page",
}: PaginationProps) {
  const buildHref = (page: number) => `${basePath}?${paramName}=${page}`;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const btn = buttonVariants({ variant: "outline", size: "icon-lg", className: "bg-card! gap-0 tabular-nums transition-colors rounded-xl" });
  const hover = "hover:bg-accent! hover:text-accent-foreground!";
  const active = "bg-primary! text-primary-foreground! border-primary!";
  const disabled = "cursor-not-allowed  opacity-60";

  return (
    <Pagination aria-label="Paginação">
      <PaginationContent className="gap-1.5">
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(Math.max(1, currentPage - 1))}
            aria-disabled={isFirst}
            tabIndex={isFirst ? -1 : undefined}
            className={cn(btn, hover, isFirst && disabled, "[&>span:not(.sr-only)]:hidden")}
          />
        </PaginationItem>

        {getPageItems(currentPage, totalPages).map((p, i) => 
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${p}`}>
              <PaginationLink
                href={buildHref(p)}
                isActive={p === currentPage}
                aria-current={p === currentPage ? "page" : undefined}
                tabIndex={p === currentPage ? -1 : undefined}
                size="icon"
                className={cn(
                  btn,
                  p === currentPage ? active : hover,
                  p === currentPage && "pointer-events-none"
                )}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={buildHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={isLast}
            tabIndex={isLast ? -1 : undefined}
            className={cn(btn, hover, isLast && disabled, "[&>span:not(.sr-only)]:hidden")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
