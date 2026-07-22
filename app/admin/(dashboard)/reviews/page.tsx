import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAllReviews } from "@/lib/admin/data/reviews";
import { setReviewApproval, setFeaturedReview, unfeatureReview } from "@/lib/admin/actions/reviews";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Approve or hide testimonials, and choose the one featured on the homepage."
        action={
          <Link href="/admin/reviews/new" className="btn-primary text-sm">
            + Add Review
          </Link>
        }
      />
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-semibold text-foreground">{review.authorName}</p>
                <Badge tone="info">{review.source}</Badge>
                <Badge tone={review.isApproved ? "success" : "pending"}>
                  {review.isApproved ? "Approved" : "Pending"}
                </Badge>
                {review.isFeatured && <Badge tone="pending">Featured on Homepage</Badge>}
              </div>
              <p className="mt-1 text-sm text-foreground/70">&ldquo;{review.quote}&rdquo;</p>
              {review.tourTitle && <p className="mt-1 text-xs text-foreground/50">{review.tourTitle}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/reviews/${review.id}`} className="btn-outline px-4 py-2 text-xs">
                Edit
              </Link>
              <form action={setReviewApproval.bind(null, review.id, !review.isApproved)}>
                <button
                  type="submit"
                  className={`rounded-full border-2 px-4 py-2 text-xs font-medium transition-colors ${
                    review.isApproved
                      ? "border-error text-error hover:bg-error hover:text-white"
                      : "border-success text-success hover:bg-success hover:text-white"
                  }`}
                >
                  {review.isApproved ? "Hide" : "Approve"}
                </button>
              </form>
              <form
                action={
                  review.isFeatured
                    ? unfeatureReview.bind(null, review.id)
                    : setFeaturedReview.bind(null, review.id)
                }
              >
                <button
                  type="submit"
                  disabled={!review.isApproved && !review.isFeatured}
                  className="rounded-full border-2 border-accent px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {review.isFeatured ? "Unfeature" : "Feature on Homepage"}
                </button>
              </form>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-foreground/50">No reviews yet.</p>}
      </div>
    </div>
  );
}
