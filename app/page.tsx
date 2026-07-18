import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import WhyChoose from "@/components/WhyChoose";
import ReviewCard from "@/components/ReviewCard";
import { getDestinations } from "@/lib/destinations";
import { getFeaturedTours } from "@/lib/tours";
import { reviews } from "@/lib/reviews";

export default async function HomePage() {
  const destinations = await getDestinations();
  const featuredTours = await getFeaturedTours();

  return (
    <>
      <Hero />
      <TrustIndicators />

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

      <WhyChoose />

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
