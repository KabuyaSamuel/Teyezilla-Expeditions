import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import CollectionForm from "@/components/admin/CollectionForm";
import { getAdminCollectionBySlug } from "@/lib/admin/data/collections";
import { getTours } from "@/lib/tours";
import { getAdminJourneys } from "@/lib/admin/data/journeys";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collection, tours, journeys] = await Promise.all([
    getAdminCollectionBySlug(slug),
    getTours(),
    getAdminJourneys(),
  ]);
  if (!collection) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${collection.name}`} description="Update this collection's details." />
      <CollectionForm existingCollection={collection} tours={tours} journeys={journeys} />
    </div>
  );
}
