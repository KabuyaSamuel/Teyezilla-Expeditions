import PageHeader from "@/components/admin/PageHeader";
import StaffForm from "@/components/admin/StaffForm";

export default function NewStaffPage() {
  return (
    <div>
      <PageHeader title="Add Staff Member" description="Create a login-capable staff account." />
      <StaffForm />
    </div>
  );
}
