import PageHeader from "@/components/admin/PageHeader";
import DestinationForm from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div>
      <PageHeader title="Add Destination" description="Add a new country or region to the site." />
      <DestinationForm />
    </div>
  );
}
