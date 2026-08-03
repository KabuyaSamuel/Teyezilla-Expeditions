import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import AvailabilityCalendar from "@/components/admin/AvailabilityCalendar";
import { getAdminTourBySlug } from "@/lib/admin/data/tours";
import { getTourAvailability } from "@/lib/admin/data/availability";
import { addTourAvailabilityDate, removeTourAvailabilityDate } from "@/lib/admin/actions/availability";
import { getDestinations } from "@/lib/destinations";
import { getActivities } from "@/lib/activities";
import { getExperienceTypes } from "@/lib/experienceTypes";
import { getAdminVehicles } from "@/lib/admin/data/vehicles";
import { getAdminAccommodations } from "@/lib/admin/data/accommodations";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tour, destinations, activities, experienceTypes, vehicles, accommodations, mediaItems] = await Promise.all([
    getAdminTourBySlug(slug),
    getDestinations(),
    getActivities(),
    getExperienceTypes(),
    getAdminVehicles(),
    getAdminAccommodations(),
    getMediaItems(),
  ]);
  if (!tour) notFound();

  const availability = await getTourAvailability(tour.id);

  return (
    <div>
      <PageHeader title={`Edit: ${tour.title}`} description="Update this tour's details." />
      <TourForm
        existingTour={tour}
        destinations={destinations}
        activities={activities}
        experienceTypes={experienceTypes}
        vehicles={vehicles}
        accommodations={accommodations}
        mediaItems={mediaItems}
      />
      <div className="mt-8">
        <AvailabilityCalendar
          dates={availability}
          onAdd={addTourAvailabilityDate.bind(null, tour.id, tour.slug)}
          onRemove={removeTourAvailabilityDate.bind(null, tour.slug)}
        />
      </div>
    </div>
  );
}
