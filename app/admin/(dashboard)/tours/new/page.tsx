import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getDestinations } from "@/lib/destinations";

export default async function NewTourPage() {
  const destinations = await getDestinations();

  return (
    <div>
      <PageHeader title="Add Tour" description="Create a new tour package." />
      <TourForm destinations={destinations} />
    </div>
  );
}
