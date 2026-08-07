import type { Review } from "@/types";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex text-accent" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          {review.source}
        </span>
      </div>
      {/* Fixed height (not just a line-clamp cap) so every card in the
          carousel is exactly the same height regardless of quote length --
          a resizing card was shifting ScrollReveal's IntersectionObserver
          boundary on every navigation, causing it to flicker in/out near
          its threshold ("shaking"). */}
      <p className="mt-4 line-clamp-4 h-24 text-sm leading-relaxed text-foreground/80">
        &ldquo;{review.quote}&rdquo;
      </p>
      <p className="mt-auto pt-4 font-heading text-sm font-semibold text-foreground">
        {review.authorName}
        {review.tourTitle && (
          <span className="font-body font-normal text-foreground/60"> · {review.tourTitle}</span>
        )}
      </p>
    </div>
  );
}
