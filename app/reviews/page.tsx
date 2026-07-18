import type { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import { reviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Traveler Reviews",
  description: "Read what travelers say about Teyezilla Expeditions on Google, TripAdvisor, and GetYourGuide.",
};

export default function ReviewsPage() {
  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Traveler Reviews</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
