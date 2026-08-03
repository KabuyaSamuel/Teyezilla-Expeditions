import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getDestinations } from "@/lib/destinations";
import { getActivities } from "@/lib/activities";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function NewTourPage() {
  const [destinations, activities, experienceTypes, vehicles, accommodations, mediaItems] = await Promise.all([
    getDestinations(),
    getActivities(),
    getExperienceTypes(),
    getAdminVehicles(),
    getAdminAccommodations(),
    getMediaItems(),
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
        mediaItems={mediaItems}
      />
    </div>
  );
}
