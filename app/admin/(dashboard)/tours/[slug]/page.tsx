import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";
import { getAdminTourBySlug } from "@/lib/admin/data/tours";
import { getDestinations } from "@/lib/destinations";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tour, destinations] = await Promise.all([getAdminTourBySlug(slug), getDestinations()]);
  if (!tour) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${tour.title}`} description="Update this tour's details." />
      <TourForm existingTour={tour} destinations={destinations} />
    </div>
  );
}
