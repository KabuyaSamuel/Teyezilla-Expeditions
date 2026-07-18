import PageHeader from "@/components/admin/PageHeader";
import TourForm from "@/components/admin/TourForm";

export default function NewTourPage() {
  return (
    <div>
      <PageHeader title="Add Tour" description="Create a new tour package." />
      <TourForm />
    </div>
  );
}
