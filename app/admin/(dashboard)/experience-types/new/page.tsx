import PageHeader from "@/components/admin/PageHeader";
import ExperienceTypeForm from "@/components/admin/ExperienceTypeForm";

export default function NewExperienceTypePage() {
  return (
    <div>
      <PageHeader title="Add Experience Type" description="Create a new tour/journey category." />
      <ExperienceTypeForm />
    </div>
  );
}
