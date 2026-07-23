import PageHeader from "@/components/admin/PageHeader";
import CollectionForm from "@/components/admin/CollectionForm";
import { getTours } from "@/lib/tours";
import { getAdminJourneys } from "@/lib/admin/data/journeys";

export default async function NewCollectionPage() {
  const [tours, journeys] = await Promise.all([getTours(), getAdminJourneys()]);

  return (
    <div>
      <PageHeader title="Add Collection" description="Create a new curated collection." />
      <CollectionForm tours={tours} journeys={journeys} />
    </div>
  );
}
