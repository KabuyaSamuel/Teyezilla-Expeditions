import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import AdminListToolbar from "@/components/admin/AdminListToolbar";
import Pagination from "@/components/admin/Pagination";
import { getDestinationsPaginated } from "@/lib/destinations";
import { ADMIN_LIST_PAGE_SIZE, parsePage, parseSort, parseString, parseBoolean } from "@/lib/admin/list-query";

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest First" },
  { value: "created_at_asc", label: "Oldest First" },
  { value: "country_name_asc", label: "Name A–Z" },
  { value: "country_name_desc", label: "Name Z–A" },
];

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);
  const search = parseString(params, "q");
  const featured = parseBoolean(params, "featured");
  const { sortBy, sortDir } = parseSort<"created_at" | "country_name">(params, "created_at_desc");

  const { items: destinations, total } = await getDestinationsPaginated({
    page,
    pageSize: ADMIN_LIST_PAGE_SIZE,
    search,
    sortBy,
    sortDir,
    featured,
  });

  return (
    <div>
      <PageHeader
        title="Destination Management"
        description="Countries, overviews, visa and best-time-to-visit info"
        action={
          <Link href="/admin/destinations/new" className="btn-primary text-sm">
            + Add Destination
          </Link>
        }
      />
      <AdminListToolbar searchPlaceholder="Search destinations by name…" sortOptions={SORT_OPTIONS} showFeaturedFilter />
      <ResponsiveTable
        rows={destinations}
        keyField={(d) => d.id}
        emptyMessage="No destinations found."
        columns={[
          { header: "Destination", cell: (d) => `${d.flagEmoji} ${d.countryName}`, className: "font-medium text-foreground" },
          { header: "Best Time to Visit", cell: (d) => d.bestTimeToVisit },
          {
            header: "Status",
            cell: (d) => <Badge tone={d.isLaunchDestination ? "success" : "pending"}>{d.isLaunchDestination ? "Live" : "Coming Soon"}</Badge>,
          },
          { header: "Featured", cell: (d) => (d.featured ? "★" : "-") },
          { header: "", cell: (d) => <Link href={`/admin/destinations/${d.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(d) => (
          <>
            <MobileCardHeader
              title={`${d.flagEmoji} ${d.countryName}`}
              action={<Link href={`/admin/destinations/${d.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Best Time to Visit" value={d.bestTimeToVisit || "-"} />
              <MobileCardField
                label="Status"
                value={<Badge tone={d.isLaunchDestination ? "success" : "pending"}>{d.isLaunchDestination ? "Live" : "Coming Soon"}</Badge>}
              />
              <MobileCardField label="Featured" value={d.featured ? "★" : "-"} />
            </div>
          </>
        )}
      />
      <Pagination
        basePath="/admin/destinations"
        currentParams={{ q: search, sort: `${sortBy}_${sortDir}`, featured: featured === undefined ? undefined : String(featured) }}
        page={page}
        pageSize={ADMIN_LIST_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
