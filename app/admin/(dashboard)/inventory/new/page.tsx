import PageHeader from "@/components/admin/PageHeader";
import InventoryForm from "@/components/admin/InventoryForm";
import { getTours } from "@/lib/tours";

export default async function NewInventoryPage() {
  const tours = await getTours();
  return (
    <div>
      <PageHeader title="Add Availability" description="Add a departure date and capacity for a tour." />
      <InventoryForm tours={tours} />
    </div>
  );
}
