import PageHeader from "@/components/admin/PageHeader";
import FaqForm from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader title="Add FAQ" description="Create a new question and answer." />
      <FaqForm />
    </div>
  );
}
