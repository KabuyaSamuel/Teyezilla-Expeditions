import PageHeader from "@/components/admin/PageHeader";
import CustomerForm from "@/components/admin/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div>
      <PageHeader title="Add Customer" description="Create a customer profile." />
      <CustomerForm />
    </div>
  );
}
