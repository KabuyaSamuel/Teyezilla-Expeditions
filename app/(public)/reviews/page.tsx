import type { Metadata } from "next";
import ReviewCard from "@/components/ReviewCard";
import JsonLd from "@/components/JsonLd";
import { getApprovedReviews } from "@/lib/reviews";
import { reviewsJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Traveler Reviews",
  description: "Read what travelers say about Teyezilla Expeditions on Google, TripAdvisor, and GetYourGuide.",
};

export const revalidate = 3600;

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const jsonLd = reviewsJsonLd(reviews.map((r) => ({ authorName: r.authorName, rating: r.rating, quote: r.quote })));

  return (
    <div className="section">
      {jsonLd && <JsonLd data={jsonLd} />}
      <h1 className="h1-page">Traveler Reviews</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
