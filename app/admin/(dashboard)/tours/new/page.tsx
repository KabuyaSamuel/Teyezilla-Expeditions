import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getDestinations } from "@/lib/destinations";
import { getActivities } from "@/lib/activities";
import { getExperienceTypes } from "@/lib/experienceTypes";

export default async function NewTourPage() {
  const [destinations, activities, experienceTypes] = await Promise.all([
    getDestinations(),
    getActivities(),
    getExperienceTypes(),
  ]);

  return (
    <div>
      <PageHeader title="Add Tour" description="Create a new tour package." />
      <TourForm destinations={destinations} activities={activities} experienceTypes={experienceTypes} />
    </div>
  );
}
