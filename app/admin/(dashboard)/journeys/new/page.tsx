import PageHeader from "@/components/admin/PageHeader";
import JourneyForm from "@/components/admin/JourneyForm";
import { getDestinations } from "@/lib/destinations";
import { getJourneyTypes } from "@/lib/journeys";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getSafariThemes } from "@/lib/safari";
import { getActivities } from "@/lib/activities";
import { getTours } from "@/lib/tours";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";

export default async function NewJourneyPage() {
  const [destinations, journeyTypes, experienceTypes, safariThemes, activities, tours, vehicles, accommodations] =
    await Promise.all([
      getDestinations(),
      getJourneyTypes(),
      getExperienceTypes(),
      getSafariThemes(),
      getActivities(),
      getTours(),
      getAdminVehicles(),
      getAdminAccommodations(),
    ]);

  return (
    <div>
      <PageHeader title="Add Journey" description="Create a new multi-country or signature journey." />
      <JourneyForm
        destinations={destinations}
        journeyTypes={journeyTypes}
        experienceTypes={experienceTypes}
        safariThemes={safariThemes}
        activities={activities}
        tours={tours}
        vehicles={vehicles}
        accommodations={accommodations}
      />
    </div>
  );
}
