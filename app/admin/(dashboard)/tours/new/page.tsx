import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getDestinations } from "@/lib/destinations";
import { getActivities } from "@/lib/activities";

export default async function NewTourPage() {
  const [destinations, activities] = await Promise.all([getDestinations(), getActivities()]);

  return (
    <div>
      <PageHeader title="Add Tour" description="Create a new tour package." />
      <TourForm destinations={destinations} activities={activities} />
    </div>
  );
}
