import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import CustomerForm from "@/components/admin/CustomerForm";
import { getCustomerById } from "@/lib/admin/data/customers";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${customer.fullName}`} description="Update customer profile." />
      <CustomerForm existingCustomer={customer} />
    </div>
  );
}
