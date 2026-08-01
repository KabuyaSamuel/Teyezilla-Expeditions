import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import VehicleForm from "@/components/admin/VehicleForm";
import { getAdminVehicleBySlug } from "@/lib/admin/data/vehicles";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getAdminVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${vehicle.name}`} description="Update this vehicle's details." />
      <VehicleForm existingVehicle={vehicle} />
    </div>
  );
}
