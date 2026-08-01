import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import AccommodationForm from "@/components/admin/AccommodationForm";
import { getAdminAccommodationById } from "@/lib/admin/data/accommodations";
import { getDestinations } from "@/lib/destinations";

export default async function EditAccommodationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [accommodation, destinations] = await Promise.all([
    getAdminAccommodationById(id),
    getDestinations(),
  ]);
  if (!accommodation) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${accommodation.name}`} description="Update this accommodation's details." />
      <AccommodationForm destinations={destinations} existingAccommodation={accommodation} />
    </div>
  );
}
