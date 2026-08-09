import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ExperienceTypeForm from "@/components/admin/ExperienceTypeForm";
import { getAdminExperienceTypeBySlug } from "@/lib/admin/data/experience-types";

export default async function EditExperienceTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experienceType = await getAdminExperienceTypeBySlug(slug);
  if (!experienceType) notFound();

  return (
    <div>
      <PageHeader title={`Edit: ${experienceType.name}`} description="Update this experience type's details." />
      <ExperienceTypeForm existingExperienceType={experienceType} />
    </div>
  );
}
