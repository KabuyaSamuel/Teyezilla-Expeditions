import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import AdminListToolbar from "@/components/admin/AdminListToolbar";
import Pagination from "@/components/admin/Pagination";
import { getAdminJourneysPaginated } from "@/lib/admin/data/journeys";
import { getDestinations } from "@/lib/destinations";
import { contentStatusTone } from "@/lib/admin/status-tone";
import { ADMIN_LIST_PAGE_SIZE, parsePage, parseSort, parseString, parseBoolean } from "@/lib/admin/list-query";

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest First" },
  { value: "created_at_asc", label: "Oldest First" },
  { value: "title_asc", label: "Name A–Z" },
  { value: "title_desc", label: "Name Z–A" },
  { value: "price_from_asc", label: "Price: Low to High" },
  { value: "price_from_desc", label: "Price: High to Low" },
];

export default async function AdminJourneysPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);
  const search = parseString(params, "q");
  const destinationId = parseString(params, "country");
  const featured = parseBoolean(params, "featured");
  const { sortBy, sortDir } = parseSort<"created_at" | "title" | "price_from">(params, "created_at_desc");

  const [{ items: journeys, total }, destinations] = await Promise.all([
    getAdminJourneysPaginated({ page, pageSize: ADMIN_LIST_PAGE_SIZE, search, sortBy, sortDir, destinationId, featured }),
    getDestinations(),
  ]);

  return (
    <div>
      <PageHeader
        title="Journey Management"
        description="Multi-country and signature journeys, distinct from single-destination tours."
        action={
          <Link href="/admin/journeys/new" className="btn-primary text-sm">
            + Add Journey
          </Link>
        }
      />

      <AdminListToolbar
        searchPlaceholder="Search journeys by name…"
        sortOptions={SORT_OPTIONS}
        countries={destinations.map((d) => ({ id: d.id, label: d.countryName }))}
        showFeaturedFilter
      />

      <ResponsiveTable
        rows={journeys}
        keyField={(j) => j.id}
        emptyMessage="No journeys found."
        columns={[
          { header: "Journey", cell: (j) => j.title, className: "font-medium text-foreground" },
          { header: "Primary Destination", cell: (j) => j.primaryDestinationName },
          { header: "Duration", cell: (j) => `${j.durationDays}d` },
          { header: "Price From", cell: (j) => `${j.currency} ${j.priceFrom}` },
          { header: "Featured", cell: (j) => (j.featured ? "★" : "-") },
          { header: "Status", cell: (j) => <Badge tone={contentStatusTone(j.status)}>{j.status}</Badge> },
          { header: "", cell: (j) => <Link href={`/admin/journeys/${j.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(j) => (
          <>
            <MobileCardHeader
              title={j.featured ? `★ ${j.title}` : j.title}
              subtitle={j.primaryDestinationName}
              action={<Link href={`/admin/journeys/${j.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Duration" value={`${j.durationDays}d`} />
              <MobileCardField label="Price From" value={`${j.currency} ${j.priceFrom}`} />
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(j.status)}>{j.status}</Badge>} />
            </div>
          </>
        )}
      />

      <Pagination
        basePath="/admin/journeys"
        currentParams={{ q: search, sort: `${sortBy}_${sortDir}`, country: destinationId, featured: featured === undefined ? undefined : String(featured) }}
        page={page}
        pageSize={ADMIN_LIST_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
