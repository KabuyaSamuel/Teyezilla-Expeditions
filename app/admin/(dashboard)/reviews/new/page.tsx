import PageHeader from "@/components/admin/PageHeader";
import ReviewForm from "@/components/admin/ReviewForm";
import { getTours } from "@/lib/tours";

export default async function NewReviewPage() {
  const tours = await getTours();
  return (
    <div>
      <PageHeader title="Add Review" description="Manually add a testimonial (e.g. one received by email)." />
      <ReviewForm tours={tours} />
    </div>
  );
}
