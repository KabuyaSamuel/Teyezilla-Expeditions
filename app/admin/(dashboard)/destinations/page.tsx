import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getDestinations } from "@/lib/destinations";

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();
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
      <ResponsiveTable
        rows={destinations}
        keyField={(d) => d.id}
        emptyMessage="No destinations yet."
        columns={[
          { header: "Destination", cell: (d) => `${d.flagEmoji} ${d.countryName}`, className: "font-medium text-foreground" },
          { header: "Best Time to Visit", cell: (d) => d.bestTimeToVisit },
          {
            header: "Status",
            cell: (d) => <Badge tone={d.isLaunchDestination ? "success" : "pending"}>{d.isLaunchDestination ? "Live" : "Coming Soon"}</Badge>,
          },
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
            </div>
          </>
        )}
      />
    </div>
  );
}
