import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminJourneys } from "@/lib/admin/data/journeys";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminJourneysPage() {
  const journeys = await getAdminJourneys();

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

      <ResponsiveTable
        rows={journeys}
        keyField={(j) => j.id}
        emptyMessage="No journeys yet. Add the first one to get started."
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
    </div>
  );
}
