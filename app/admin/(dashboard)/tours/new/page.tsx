import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getDestinations } from "@/lib/destinations";
import { getActivities } from "@/lib/activities";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";

export default async function NewTourPage() {
  const [destinations, activities, experienceTypes, vehicles, accommodations] = await Promise.all([
    getDestinations(),
    getActivities(),
    getExperienceTypes(),
    getAdminVehicles(),
    getAdminAccommodations(),
  ]);

  return (
    <div>
      <PageHeader title="Add Tour" description="Create a new tour package." />
      <TourForm
        destinations={destinations}
        activities={activities}
        experienceTypes={experienceTypes}
        vehicles={vehicles}
        accommodations={accommodations}
      />
    </div>
  );
}
