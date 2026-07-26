import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ActivityForm from "@/components/admin/ActivityForm";
import { getAdminActivityBySlug } from "@/lib/admin/data/activities";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getAdminActivityBySlug(slug);
  if (!activity) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${activity.name}`} description="Update this activity's details." />
      <ActivityForm existingActivity={activity} />
    </div>
  );
}
