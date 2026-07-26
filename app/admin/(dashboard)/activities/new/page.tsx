import PageHeader from "@/components/admin/PageHeader";
import ActivityForm from "@/components/admin/ActivityForm";

export default function NewActivityPage() {
  return (
    <div>
      <PageHeader title="Add Activity" description="Create a new reusable activity for the library." />
      <ActivityForm />
    </div>
  );
}
