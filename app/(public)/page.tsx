import type { Destination } from "@/types";
import Link from "next/link";
import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import CategoryOverview from "@/components/CategoryOverview";
import TripSearch from "@/components/TripSearch";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import JourneyCard from "@/components/JourneyCard";
import WhyChoose from "@/components/WhyChoose";
import StatsBar from "@/components/StatsBar";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import { getDestinations, getFeaturedDestinations } from "@/lib/destinations";
import { getRegionsWithDestinations, type RegionWithDestinations } from "@/lib/regions";
import { getFeaturedTours, getPublishedTours } from "@/lib/tours";
import { getFeaturedJourneys, getJourneys } from "@/lib/journeys";
import { getApprovedReviews, getFeaturedReview } from "@/lib/reviews";
import { getSiteSetting } from "@/lib/settings";
import { FEATURED_DESTINATIONS_COUNT, FEATURED_EXPERIENCES_COUNT, FEATURED_JOURNEYS_COUNT, fillToCount } from "@/lib/featuredCounts";

export const revalidate = 3600;

// Round-robins across regions (launch destinations sort first within each
// region already) so the homepage doesn't just dump the first N rows in
// insertion order, e.g. four East African countries and nothing else.
function pickBalancedDestinations(
  all: Destination[],
  regions: RegionWithDestinations[],
  count: number
): Destination[] {
  const byId = new Map(all.map((d) => [d.id, d]));
  const seen = new Set<string>();
  const picked: Destination[] = [];

  for (let round = 0; picked.length < count; round++) {
    let addedAny = false;
    for (const region of regions) {
      const candidate = region.destinations[round];
      if (candidate && !seen.has(candidate.id) && byId.has(candidate.id)) {
        seen.add(candidate.id);
        picked.push(byId.get(candidate.id)!);
        addedAny = true;
        if (picked.length === count) break;
      }
    }
    if (!addedAny) break;
  }

  return picked;
}

export default async function HomePage() {
  const [destinations, regions, featuredDestinationsAll, featuredTours, allTours, featuredJourneysAll, journeysAll, reviews, featuredReview, happyTravelersCount] =
    await Promise.all([
      getDestinations(),
      getRegionsWithDestinations(),
      getFeaturedDestinations(),
      getFeaturedTours(),
      getPublishedTours(),
      getFeaturedJourneys(),
      getJourneys(),
      getApprovedReviews(),
      getFeaturedReview(),
      getSiteSetting("happy_travelers_count"),
    ]);

  // Manually-curated (destinations.featured) takes priority; any picks
  // beyond that are topped up from the balanced round-robin pick rather
  // than discarding partial manual picks outright, so a staff pick is
  // never silently dropped just because there weren't enough of them.
  const manualFeaturedDestinations = featuredDestinationsAll.slice(0, FEATURED_DESTINATIONS_COUNT);
  const featuredDestinations = fillToCount(
    manualFeaturedDestinations,
    pickBalancedDestinations(destinations, regions, FEATURED_DESTINATIONS_COUNT),
    FEATURED_DESTINATIONS_COUNT,
    (d) => d.id
  );
  // Tops up with other published tours/journeys (not already shown) when
  // fewer than the target count are marked featured, so the grid never
  // renders with empty trailing cells.
  const featuredExperiences = fillToCount(featuredTours, allTours, FEATURED_EXPERIENCES_COUNT, (t) => t.id);
  const featuredJourneys = fillToCount(featuredJourneysAll, journeysAll, FEATURED_JOURNEYS_COUNT, (j) => j.id);

  return (
    <>
      <Hero />
      <TrustIndicators />
      <CategoryOverview />
      <TripSearch />

      <section className="section">
        <ScrollReveal>
          <h2 className="h2-section">
            Featured Destinations
          </h2>
          <p className="mt-2 text-foreground/70">
            A balanced spread across Africa, from safari heartlands to island escapes.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map((destination, i) => (
            <ScrollReveal key={destination.id} delay={(i % 3) * 100}>
              <DestinationCard destination={destination} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="mt-10 text-center">
          <Link href="/destinations" className="btn-outline">
            View More Destinations
          </Link>
        </ScrollReveal>
      </section>

      {featuredJourneys.length > 0 && (
        <section className="section bg-secondary/10">
          <ScrollReveal>
            <h2 className="h2-section">
              Featured Journeys
            </h2>
            <p className="mt-2 text-foreground/70">
              Curated multi-day journeys connecting wildlife, culture, and place.
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJourneys.map((journey, i) => (
              <ScrollReveal key={journey.id} delay={(i % 3) * 100}>
                <JourneyCard journey={journey} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-10 text-center">
            <Link href="/journeys" className="btn-outline">
              View More Journeys
            </Link>
          </ScrollReveal>
        </section>
      )}

      <section className="section">
        <ScrollReveal>
          <h2 className="h2-section">
            Featured Experiences
          </h2>
          <p className="mt-2 text-foreground/70">
            Handpicked tours our travelers book again and again.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredExperiences.map((tour, i) => (
            <ScrollReveal key={tour.id} delay={(i % 4) * 100}>
              <TourCard tour={tour} />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="mt-10 text-center">
          <Link href="/experiences" className="btn-outline">
            View More Experiences
          </Link>
        </ScrollReveal>
      </section>

      <WhyChoose testimonial={featuredReview} happyTravelersCount={happyTravelersCount ?? "1,000"} />
      <StatsBar happyTravelersCount={happyTravelersCount ?? "1,000"} />

      <section className="section">
        <ScrollReveal>
          <h2 className="h2-section">
            What Our Travelers Say
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <TestimonialsCarousel reviews={reviews} />
        </ScrollReveal>
      </section>
    </>
  );
}
