import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import JourneyForm from "@/components/admin/JourneyForm";
import { getAdminJourneyBySlug } from "@/lib/admin/data/journeys";
import { getDestinations } from "@/lib/destinations";
import { getJourneyTypes } from "@/lib/journeys";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getSafariThemes } from "@/lib/safari";
import { getActivities } from "@/lib/activities";
import { getTours } from "@/lib/tours";

export default async function EditJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [journey, destinations, journeyTypes, experienceTypes, safariThemes, activities, tours] = await Promise.all([
    getAdminJourneyBySlug(slug),
    getDestinations(),
    getJourneyTypes(),
    getExperienceTypes(),
    getSafariThemes(),
    getActivities(),
    getTours(),
  ]);
  if (!journey) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${journey.title}`} description="Update this journey's details." />
      <JourneyForm
        existingJourney={journey}
        destinations={destinations}
        journeyTypes={journeyTypes}
        experienceTypes={experienceTypes}
        safariThemes={safariThemes}
        activities={activities}
        tours={tours}
      />
    </div>
  );
}
