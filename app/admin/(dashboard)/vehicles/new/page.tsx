import PageHeader from "@/components/admin/PageHeader";
import VehicleForm from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div>
      <PageHeader title="Add Vehicle" description="Create a new reusable vehicle for the library." />
      <VehicleForm />
    </div>
  );
}
