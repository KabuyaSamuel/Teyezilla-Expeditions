import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ReviewForm from "@/components/admin/ReviewForm";
import { getReviewById } from "@/lib/admin/data/reviews";
import { getTours } from "@/lib/tours";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [review, tours] = await Promise.all([getReviewById(id), getTours()]);
  if (!review) notFound();

  return (
    <div>
      <PageHeader title={`Edit Review: ${review.authorName}`} description="Update this testimonial." />
      <ReviewForm existingReview={review} tours={tours} />
    </div>
  );
}
