import PageHeader from "@/components/admin/PageHeader";
import DestinationForm from "@/components/admin/DestinationForm";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function NewDestinationPage() {
  const mediaItems = await getMediaItems();

  return (
    <div>
      <PageHeader title="Add Destination" description="Add a new country or region to the site." />
      <DestinationForm mediaItems={mediaItems} />
    </div>
  );
}
