import PageHeader from "@/components/admin/PageHeader";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <PageHeader title="Add Team Member" description="Add a new staff bio." />
      <TeamMemberForm />
    </div>
  );
}
