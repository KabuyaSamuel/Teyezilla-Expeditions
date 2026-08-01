import PageHeader from "@/components/admin/PageHeader";
import AccommodationForm from "@/components/admin/AccommodationForm";
import { getDestinations } from "@/lib/destinations";

export default async function NewAccommodationPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <PageHeader title="Add Accommodation" description="Create a new reusable accommodation for the library." />
      <AccommodationForm destinations={destinations} />
    </div>
  );
}
