import Link from "next/link";

// Numbered pagination (not "Load More") so each page of a growing catalog
// gets its own crawlable, linkable URL -- better for SEO/AEO than a
// client-side infinite-scroll pattern would be, and needs no client JS.
export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pillClass = (active: boolean, disabled = false) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? "pointer-events-none bg-secondary/10 text-foreground/30"
        : active
          ? "bg-primary text-white"
          : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
    }`;

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={pillClass(false, currentPage === 1)}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            p === currentPage ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={pillClass(false, currentPage === totalPages)}
      >
        Next
      </Link>
    </nav>
  );
}
