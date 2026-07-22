import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import TripSearch from "@/components/TripSearch";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import WhyChoose from "@/components/WhyChoose";
import StatsBar from "@/components/StatsBar";
import ReviewCard from "@/components/ReviewCard";
import { getDestinations } from "@/lib/destinations";
import { getFeaturedTours } from "@/lib/tours";
import { getApprovedReviews, getFeaturedReview } from "@/lib/reviews";
import { getSiteSetting } from "@/lib/settings";

export const revalidate = 3600;

export default async function HomePage() {
  const [destinations, featuredTours, reviews, featuredReview, happyTravelersCount] = await Promise.all([
    getDestinations(),
    getFeaturedTours(),
    getApprovedReviews(),
    getFeaturedReview(),
    getSiteSetting("happy_travelers_count"),
  ]);

  return (
    <>
      <Hero />
      <TrustIndicators />
      <TripSearch />

      <section className="section">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Featured Destinations
        </h2>
        <p className="mt-2 text-foreground/70">
          Ten African destinations, five open for booking today.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <section className="section bg-secondary/10">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Featured Experiences
        </h2>
        <p className="mt-2 text-foreground/70">
          Handpicked tours our travelers book again and again.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <WhyChoose testimonial={featuredReview} happyTravelersCount={happyTravelersCount ?? "1,000"} />
      <StatsBar happyTravelersCount={happyTravelersCount ?? "1,000"} />

      <section className="section">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          What Our Travelers Say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </>
  );
}
