import PageHeader from "@/components/admin/PageHeader";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { getMediaItems } from "@/lib/admin/data/media";

export default async function NewTeamMemberPage() {
  const mediaItems = await getMediaItems();

  return (
    <div>
      <PageHeader title="Add Team Member" description="Add a new staff bio." />
      <TeamMemberForm mediaItems={mediaItems} />
    </div>
  );
}
