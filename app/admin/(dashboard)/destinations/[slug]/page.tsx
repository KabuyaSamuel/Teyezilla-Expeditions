import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import DestinationForm from "@/components/admin/DestinationForm";
import { getDestinationBySlug } from "@/lib/destinations";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [destination, mediaItems] = await Promise.all([getDestinationBySlug(slug), getMediaItems()]);
  if (!destination) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${destination.countryName}`} description="Update destination content and travel guidance." />
      <DestinationForm existingDestination={destination} mediaItems={mediaItems} />
    </div>
  );
}
