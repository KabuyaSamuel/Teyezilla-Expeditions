import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminCollections } from "@/lib/admin/data/collections";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Curated groupings of tours and journeys, e.g. The Wild, The Ocean, The Heritage."
        action={
          <Link href="/admin/collections/new" className="btn-primary text-sm">
            + Add Collection
          </Link>
        }
      />

      <ResponsiveTable
        rows={collections}
        keyField={(c) => c.id}
        emptyMessage="No collections yet. Add the first one to get started."
        columns={[
          { header: "Collection", cell: (c) => c.name, className: "font-medium text-foreground" },
          { header: "Tours", cell: (c) => c.tourCount },
          { header: "Journeys", cell: (c) => c.journeyCount },
          { header: "Status", cell: (c) => <Badge tone={contentStatusTone(c.status)}>{c.status}</Badge> },
          { header: "", cell: (c) => <Link href={`/admin/collections/${c.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(c) => (
          <>
            <MobileCardHeader
              title={c.name}
              action={<Link href={`/admin/collections/${c.slug}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Tours" value={c.tourCount} />
              <MobileCardField label="Journeys" value={c.journeyCount} />
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(c.status)}>{c.status}</Badge>} />
            </div>
          </>
        )}
      />
    </div>
  );
}
