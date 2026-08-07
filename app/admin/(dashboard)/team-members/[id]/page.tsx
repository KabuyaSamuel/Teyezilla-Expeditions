import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { getAdminTeamMemberById } from "@/lib/admin/data/team-members";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [teamMember, mediaItems] = await Promise.all([getAdminTeamMemberById(id), getMediaItems()]);
  if (!teamMember) notFound();

  return (
    <div>
      <PageHeader title="Edit Team Member" description="Update this staff bio." />
      <TeamMemberForm existingTeamMember={teamMember} mediaItems={mediaItems} />
    </div>
  );
}
