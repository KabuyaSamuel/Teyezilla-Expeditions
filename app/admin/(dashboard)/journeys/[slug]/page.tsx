import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import JourneyForm from "@/components/admin/JourneyForm";
import AvailabilityCalendar from "@/components/admin/AvailabilityCalendar";
import { getAdminJourneyBySlug } from "@/lib/admin/data/journeys";
import { getJourneyAvailability } from "@/lib/admin/data/availability";
import { addJourneyAvailabilityDate, removeJourneyAvailabilityDate } from "@/lib/admin/actions/availability";
import { getDestinations } from "@/lib/destinations";
import { getJourneyTypes } from "@/lib/journeys";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getSafariThemes } from "@/lib/safari";
import { getActivities } from "@/lib/activities";
import { getTours } from "@/lib/tours";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function EditJourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [journey, destinations, journeyTypes, experienceTypes, safariThemes, activities, tours, vehicles, accommodations, mediaItems] =
    await Promise.all([
      getAdminJourneyBySlug(slug),
      getDestinations(),
      getJourneyTypes(),
      getExperienceTypes(),
      getSafariThemes(),
      getActivities(),
      getTours(),
      getAdminVehicles(),
      getAdminAccommodations(),
      getMediaItems(),
    ]);
  if (!journey) notFound();

  const availability = await getJourneyAvailability(journey.id);

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
        vehicles={vehicles}
        accommodations={accommodations}
        mediaItems={mediaItems}
      />
      <div className="mt-8">
        <AvailabilityCalendar
          dates={availability}
          onAdd={addJourneyAvailabilityDate.bind(null, journey.id, journey.slug)}
          onRemove={removeJourneyAvailabilityDate.bind(null, journey.slug)}
        />
      </div>
    </div>
  );
}
