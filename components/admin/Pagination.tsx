import Link from "next/link";

export default function Pagination({
  basePath,
  currentParams,
  page,
  pageSize,
  total,
}: {
  basePath: string;
  /** Current search params (q, sort, country, etc), excluding `page`. */
  currentParams: Record<string, string | undefined>;
  page: number;
  pageSize: number;
  total: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(currentParams)) {
      if (value) params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex items-center justify-between gap-4 text-sm">
      <p className="text-foreground/50">
        Showing {from}-{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="rounded-full border border-secondary/40 px-4 py-1.5 hover:bg-secondary/10">
            ← Prev
          </Link>
        ) : (
          <span className="rounded-full border border-secondary/20 px-4 py-1.5 text-foreground/30">← Prev</span>
        )}
        <span className="text-foreground/60">
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} className="rounded-full border border-secondary/40 px-4 py-1.5 hover:bg-secondary/10">
            Next →
          </Link>
        ) : (
          <span className="rounded-full border border-secondary/20 px-4 py-1.5 text-foreground/30">Next →</span>
        )}
      </div>
    </div>
  );
}
