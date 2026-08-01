import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import AdminListToolbar from "@/components/admin/AdminListToolbar";
import Pagination from "@/components/admin/Pagination";
import { getAdminToursPaginated } from "@/lib/admin/data/tours";
import { getDestinations } from "@/lib/destinations";
import { contentStatusTone } from "@/lib/admin/status-tone";
import { ADMIN_LIST_PAGE_SIZE, parsePage, parseSort, parseString } from "@/lib/admin/list-query";

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest First" },
  { value: "created_at_asc", label: "Oldest First" },
  { value: "title_asc", label: "Name A–Z" },
  { value: "title_desc", label: "Name Z–A" },
  { value: "price_from_asc", label: "Price: Low to High" },
  { value: "price_from_desc", label: "Price: High to Low" },
];

export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);
  const search = parseString(params, "q");
  const destinationId = parseString(params, "country");
  const { sortBy, sortDir } = parseSort<"created_at" | "title" | "price_from">(params, "created_at_desc");

  const [{ items: tours, total }, destinations] = await Promise.all([
    getAdminToursPaginated({ page, pageSize: ADMIN_LIST_PAGE_SIZE, search, sortBy, sortDir, destinationId }),
    getDestinations(),
  ]);
  const destinationName = (id: string) => destinations.find((d) => d.id === id)?.countryName ?? "-";

  return (
    <div>
      <PageHeader
        title="Tour Management"
        description="Create and manage every tour package across all destinations."
        action={
          <Link href="/admin/tours/new" className="btn-primary text-sm">
            + Add Tour
          </Link>
        }
      />

      <AdminListToolbar
        searchPlaceholder="Search tours by name…"
        sortOptions={SORT_OPTIONS}
        countries={destinations.map((d) => ({ id: d.id, label: d.countryName }))}
      />

      <ResponsiveTable
        rows={tours}
        keyField={(t) => t.id}
        emptyMessage="No tours found."
        columns={[
          { header: "Tour", cell: (t) => t.title, className: "font-medium text-foreground" },
          { header: "Destination", cell: (t) => destinationName(t.destinationId) },
          { header: "Category", cell: (t) => t.categoryLabel },
          { header: "Duration", cell: (t) => `${t.durationDays}d` },
          { header: "Price From", cell: (t) => `${t.currency} ${t.priceFrom}` },
          { header: "Featured", cell: (t) => (t.featured ? "★" : "-") },
          { header: "Status", cell: (t) => <Badge tone={contentStatusTone(t.status)}>{t.status}</Badge> },
          { header: "", cell: (t) => <Link href={`/admin/tours/${t.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(t) => (
          <>
            <MobileCardHeader
              title={t.featured ? `★ ${t.title}` : t.title}
              subtitle={destinationName(t.destinationId)}
              action={<Link href={`/admin/tours/${t.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Category" value={t.categoryLabel} />
              <MobileCardField label="Duration" value={`${t.durationDays}d`} />
              <MobileCardField label="Price From" value={`${t.currency} ${t.priceFrom}`} />
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(t.status)}>{t.status}</Badge>} />
            </div>
          </>
        )}
      />

      <Pagination
        basePath="/admin/tours"
        currentParams={{ q: search, sort: `${sortBy}_${sortDir}`, country: destinationId }}
        page={page}
        pageSize={ADMIN_LIST_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
