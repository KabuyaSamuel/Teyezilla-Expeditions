import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";
import { contentStatusTone } from "@/lib/admin/status-tone";

export default async function AdminAccommodationsPage() {
  const accommodations = await getAdminAccommodations();

  return (
    <div>
      <PageHeader
        title="Accommodation Library"
        description="Camps, lodges, and hotels by destination that can be attached to any tour or journey."
        action={
          <Link href="/admin/accommodations/new" className="btn-primary text-sm">
            + Add Accommodation
          </Link>
        }
      />

      <ResponsiveTable
        rows={accommodations}
        keyField={(a) => a.id}
        emptyMessage="No accommodations yet. Add the first one to get started."
        columns={[
          { header: "Name", cell: (a) => a.name, className: "font-medium text-foreground" },
          { header: "Destination", cell: (a) => a.destinationName },
          { header: "Tier", cell: (a) => a.tier || "-" },
          { header: "Status", cell: (a) => <Badge tone={contentStatusTone(a.status)}>{a.status}</Badge> },
          { header: "", cell: (a) => <Link href={`/admin/accommodations/${a.id}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(a) => (
          <>
            <MobileCardHeader
              title={a.name}
              subtitle={a.destinationName}
              action={<Link href={`/admin/accommodations/${a.id}`} className="hover:underline">Edit</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Tier" value={a.tier || "-"} />
              <MobileCardField label="Status" value={<Badge tone={contentStatusTone(a.status)}>{a.status}</Badge>} />
            </div>
          </>
        )}
      />
    </div>
  );
}
