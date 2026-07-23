import PageHeader from "@/components/admin/PageHeader";
import JourneyForm from "@/components/admin/JourneyForm";
import { getDestinations } from "@/lib/destinations";
import { getJourneyTypes } from "@/lib/journeys";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getSafariThemes } from "@/lib/safari";

export default async function NewJourneyPage() {
  const [destinations, journeyTypes, experienceTypes, safariThemes] = await Promise.all([
    getDestinations(),
    getJourneyTypes(),
    getExperienceTypes(),
    getSafariThemes(),
  ]);

  return (
    <div>
      <PageHeader title="Add Journey" description="Create a new multi-country or signature journey." />
      <JourneyForm
        destinations={destinations}
        journeyTypes={journeyTypes}
        experienceTypes={experienceTypes}
        safariThemes={safariThemes}
      />
    </div>
  );
}
