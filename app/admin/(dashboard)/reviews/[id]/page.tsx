import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ReviewForm from "@/components/admin/ReviewForm";
import { getReviewById } from "@/lib/admin/data/reviews";
import { getTours } from "@/lib/tours";
import { getAdminJourneys } from "@/lib/admin/data/journeys";
import { formatDateTime } from "@/lib/formatDate";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [review, tours, journeys] = await Promise.all([getReviewById(id), getTours(), getAdminJourneys()]);
  if (!review) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit Review: ${review.authorName}`}
        description={`Update this testimonial. Added ${formatDateTime(review.createdAt)}.`}
      />
      <ReviewForm existingReview={review} tours={tours} journeys={journeys} />
    </div>
  );
}
