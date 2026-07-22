import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import InventoryForm from "@/components/admin/InventoryForm";
import { getInventoryRecordById } from "@/lib/admin/data/inventory";
import { getTours } from "@/lib/tours";

export default async function EditInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [record, tours] = await Promise.all([getInventoryRecordById(id), getTours()]);
  if (!record) notFound();

  return (
    <div>
      <PageHeader title={`Edit Availability: ${record.tourTitle}`} description="Update capacity and departure date." />
      <InventoryForm existingRecord={record} tours={tours} />
    </div>
  );
}
