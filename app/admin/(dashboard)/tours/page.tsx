import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminToursPage() {
  const [tours, destinations] = await Promise.all([getTours(), getDestinations()]);
  const destinationName = (destinationId: string) => destinations.find((d) => d.id === destinationId)?.countryName ?? "-";

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

      <ResponsiveTable
        rows={tours}
        keyField={(t) => t.id}
        emptyMessage="No tours yet."
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
    </div>
  );
}
