import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import StaffForm from "@/components/admin/StaffForm";
import { getStaffMemberById } from "@/lib/admin/data/staff";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staffMember = await getStaffMemberById(id);
  if (!staffMember) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${staffMember.fullName}`} description="Update role and access." />
      <StaffForm existingStaff={staffMember} />
    </div>
  );
}
