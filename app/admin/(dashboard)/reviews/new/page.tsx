import PageHeader from "@/components/admin/PageHeader";
import ReviewForm from "@/components/admin/ReviewForm";
import { getTours } from "@/lib/tours";
import { getAdminJourneys } from "@/lib/admin/data/journeys";

export default async function NewReviewPage() {
  const [tours, journeys] = await Promise.all([getTours(), getAdminJourneys()]);
  return (
    <div>
      <PageHeader title="Add Review" description="Manually add a testimonial (e.g. one received by email)." />
      <ReviewForm tours={tours} journeys={journeys} />
    </div>
  );
}
