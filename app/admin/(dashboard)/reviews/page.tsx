import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { reviews } from "@/lib/reviews";

export default function AdminReviewsPage() {
  return (
    <div>
      <PageHeader title="Reviews" description="Approve or hide testimonials pulled from Google, TripAdvisor, and GetYourGuide." />
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-semibold text-foreground">{review.authorName}</p>
                <Badge tone="info">{review.source}</Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/70">&ldquo;{review.quote}&rdquo;</p>
              {review.tourTitle && <p className="mt-1 text-xs text-foreground/50">{review.tourTitle}</p>}
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border-2 border-success px-4 py-2 text-xs font-medium text-success hover:bg-success hover:text-white transition-colors">
                Approve
              </button>
              <button className="rounded-full border-2 border-error px-4 py-2 text-xs font-medium text-error hover:bg-error hover:text-white transition-colors">
                Hide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
