import PageHeader from "@/components/admin/PageHeader";
import OperationsBoard from "@/components/admin/OperationsBoard";
import { getUpcomingDepartures } from "@/lib/admin/data/operations";
import { getStaffMembers } from "@/lib/admin/data/staff";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { assignDeparture } from "@/lib/admin/actions/operations";

export default async function AdminOperationsPage() {
  const [departures, staff, vehicles] = await Promise.all([
    getUpcomingDepartures(),
    getStaffMembers(),
    getAdminVehicles(),
  ]);

  const guides = staff.filter((s) => s.role === "tour_guide");
  const drivers = staff.filter((s) => s.role === "driver");

  return (
    <div>
      <PageHeader
        title="Operations"
        description="Assign a guide, driver, and vehicle to each confirmed upcoming departure."
      />
      <OperationsBoard departures={departures} guides={guides} drivers={drivers} vehicles={vehicles} onAssign={assignDeparture} />
    </div>
  );
}
