import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { inventoryRecords } from "@/lib/admin/data/inventory";

export default function AdminInventoryPage() {
  return (
    <div>
      <PageHeader
        title="Inventory & Availability"
        description="Tour capacity, guide and driver assignment, and real-time availability."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Tour</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Capacity</th>
              <th className="px-5 py-3">Booked</th>
              <th className="px-5 py-3">Guide</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {inventoryRecords.map((r) => (
              <tr key={r.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{r.tourTitle}</td>
                <td className="px-5 py-3 text-foreground/70">{r.date}</td>
                <td className="px-5 py-3 text-foreground/70">{r.capacity}</td>
                <td className="px-5 py-3">
                  <Badge tone={r.bookedCount >= r.capacity ? "error" : "success"}>
                    {r.bookedCount} / {r.capacity}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-foreground/70">{r.guideAssigned ?? "Unassigned"}</td>
                <td className="px-5 py-3 text-foreground/70">{r.driverAssigned ?? "Unassigned"}</td>
                <td className="px-5 py-3 text-foreground/70">{r.vehicle ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
