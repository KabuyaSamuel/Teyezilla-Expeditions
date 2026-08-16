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
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { FEATURED_DESTINATIONS_COUNT, FEATURED_EXPERIENCES_COUNT, FEATURED_JOURNEYS_COUNT, fillToCount } from "@/lib/featuredCounts";
import { FEATURED_SECTIONS_DEFAULTS, type FeaturedSectionsKey } from "@/lib/homepageContent";

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
  const featuredSectionKeys = Object.keys(FEATURED_SECTIONS_DEFAULTS) as FeaturedSectionsKey[];
  const [destinationsAll, regions, featuredDestinationsAllRaw, featuredToursRaw, allToursRaw, featuredJourneysAllRaw, journeysAllRaw, reviews, featuredReview, happyTravelersCount, featuredSectionValues] =
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
      Promise.all(featuredSectionKeys.map((key) => getSiteSetting(key))),
    ]);
  const featuredSectionText = resolveSiteText(FEATURED_SECTIONS_DEFAULTS, featuredSectionKeys, featuredSectionValues);

  // A destination/tour/journey without a hero image can't be featured on
  // the homepage -- an empty/placeholder card in these grids undercuts the
  // whole point of a curated, photo-led homepage. Scoped to the homepage's
  // own featured selections only (via withImage below), not the shared
  // getDestinations/getTours/getJourneys used by the full listing pages,
  // where an image-less item should still be visible.
  const withImage = <T extends { heroImage: string }>(items: T[]): T[] =>
    items.filter((item) => item.heroImage);

  const destinations = withImage(destinationsAll);
  const featuredDestinationsAll = withImage(featuredDestinationsAllRaw);
  const featuredTours = withImage(featuredToursRaw);
  const allTours = withImage(allToursRaw);
  const featuredJourneysAll = withImage(featuredJourneysAllRaw);
  const journeysAll = withImage(journeysAllRaw);

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

      {/* This section, Featured Journeys, Featured Experiences, and
          WhyChoose share a reduced py-12/16 (instead of the default
          .section py-16/24) -- Featured Journeys only renders when there
          are featured journeys, so any of these can end up directly
          adjacent to any other. Keeping all four symmetric and equally
          reduced avoids a ~192px dead gap wherever two of them meet on the
          same cream background, without needing to special-case which
          pair is actually touching. */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ScrollReveal>
          <h2 className="h2-section">
            {featuredSectionText.featuredDestinationsHeadline}
          </h2>
          <p className="mt-2 text-foreground/70">
            {featuredSectionText.featuredDestinationsSubtext}
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
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16 bg-secondary/10">
          <ScrollReveal>
            <h2 className="h2-section">
              {featuredSectionText.featuredJourneysHeadline}
            </h2>
            <p className="mt-2 text-foreground/70">
              {featuredSectionText.featuredJourneysSubtext}
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

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <ScrollReveal>
          <h2 className="h2-section">
            {featuredSectionText.featuredExperiencesHeadline}
          </h2>
          <p className="mt-2 text-foreground/70">
            {featuredSectionText.featuredExperiencesSubtext}
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
