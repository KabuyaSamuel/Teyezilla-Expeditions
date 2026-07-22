import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import DestinationForm from "@/components/admin/DestinationForm";
import { getDestinationBySlug } from "@/lib/destinations";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${destination.countryName}`} description="Update destination content and travel guidance." />
      <DestinationForm existingDestination={destination} />
    </div>
  );
}
