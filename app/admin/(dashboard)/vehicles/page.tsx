import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ResponsiveTable, { MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";

export default async function AdminVehiclesPage() {
  const vehicles = await getAdminVehicles();

  return (
    <div>
      <PageHeader
        title="Vehicle Library"
        description="Reusable named expedition vehicles that can be attached to any tour or journey."
        action={
          <Link href="/admin/vehicles/new" className="btn-primary text-sm">
            + Add Vehicle
          </Link>
        }
      />

      <ResponsiveTable
        rows={vehicles}
        keyField={(v) => v.id}
        emptyMessage="No vehicles yet. Add the first one to get started."
        columns={[
          { header: "Name", cell: (v) => v.name, className: "font-medium text-foreground" },
          { header: "Type", cell: (v) => v.vehicleType },
          { header: "Seats", cell: (v) => v.seats ?? "-" },
          { header: "", cell: (v) => <Link href={`/admin/vehicles/${v.slug}`} className="text-primary hover:underline">Edit</Link> },
        ]}
        renderMobileCard={(v) => (
          <>
            <MobileCardHeader
              title={v.name}
              subtitle={v.vehicleType}
              action={<Link href={`/admin/vehicles/${v.slug}`} className="hover:underline">Edit</Link>}
            />
            {v.description && <p className="mt-2 text-sm text-foreground/70">{v.description}</p>}
          </>
        )}
      />
    </div>
  );
}
