import PageHeader from "@/components/admin/PageHeader";
import CollectionForm from "@/components/admin/CollectionForm";
import { getTours } from "@/lib/tours";
import { getAdminJourneys } from "@/lib/admin/data/journeys";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function NewCollectionPage() {
  const [tours, journeys, mediaItems] = await Promise.all([getTours(), getAdminJourneys(), getMediaItems()]);

  return (
    <div>
      <PageHeader title="Add Collection" description="Create a new curated collection." />
      <CollectionForm tours={tours} journeys={journeys} mediaItems={mediaItems} />
    </div>
  );
}
