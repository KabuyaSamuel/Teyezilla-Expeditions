import type { Destination } from "@/types";
import Link from "next/link";
import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import CategoryOverview from "@/components/CategoryOverview";
import TripSearch from "@/components/TripSearch";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import JourneyCard from "@/components/JourneyCard";
import BlogCard from "@/components/BlogCard";
import WhyChoose from "@/components/WhyChoose";
import StatsBar from "@/components/StatsBar";
import ReviewCard from "@/components/ReviewCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getDestinations } from "@/lib/destinations";
import { getRegionsWithDestinations, type RegionWithDestinations } from "@/lib/regions";
import { getFeaturedTours, getFeaturedSafaris } from "@/lib/tours";
import { getFeaturedJourneys } from "@/lib/journeys";
import { getApprovedReviews, getFeaturedReview } from "@/lib/reviews";
import { getPublishedBlogPosts } from "@/lib/blog";
import { getSiteSetting } from "@/lib/settings";

export const revalidate = 3600;

const FEATURED_DESTINATIONS_COUNT = 6;
const FEATURED_EXPERIENCES_COUNT = 4;
const FEATURED_REVIEWS_COUNT = 3;
const FEATURED_ARTICLES_COUNT = 3;

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
  const [
    destinations,
    regions,
    featuredTours,
    featuredJourneys,
    featuredSafaris,
    reviews,
    featuredReview,
    happyTravelersCount,
    latestPosts,
  ] = await Promise.all([
    getDestinations(),
    getRegionsWithDestinations(),
    getFeaturedTours(),
    getFeaturedJourneys(),
    getFeaturedSafaris(),
    getApprovedReviews(),
    getFeaturedReview(),
    getSiteSetting("happy_travelers_count"),
    getPublishedBlogPosts(),
  ]);

  const featuredDestinations = pickBalancedDestinations(destinations, regions, FEATURED_DESTINATIONS_COUNT);
  const featuredExperiences = featuredTours.slice(0, FEATURED_EXPERIENCES_COUNT);
  const featuredReviews = reviews.slice(0, FEATURED_REVIEWS_COUNT);
  const latestArticles = latestPosts.slice(0, FEATURED_ARTICLES_COUNT);

  return (
    <>
      <Hero />
      <TrustIndicators />

      {(featuredJourneys.length > 0 || featuredSafaris.length > 0) && (
        <section className="section">
          {featuredJourneys.length > 0 && (
            <div>
              <ScrollReveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">Featured Journeys</h2>
              </ScrollReveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {featuredJourneys.slice(0, 2).map((journey, i) => (
                  <ScrollReveal key={journey.id} delay={i * 100}>
                    <JourneyCard journey={journey} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {featuredSafaris.length > 0 && (
            <div className={featuredJourneys.length > 0 ? "mt-12" : ""}>
              <ScrollReveal>
                <h2 className="font-heading text-2xl font-bold text-foreground">Featured Safaris</h2>
              </ScrollReveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {featuredSafaris.slice(0, 2).map((tour, i) => (
                  <ScrollReveal key={tour.id} delay={i * 100}>
                    <TourCard tour={tour} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <CategoryOverview />
      <TripSearch />

      <section className="section">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-bold text-foreground">
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

      <section className="section bg-secondary/10">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-bold text-foreground">
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
          <h2 className="font-heading text-3xl font-bold text-foreground">
            What Our Travelers Say
          </h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredReviews.map((review, i) => (
            <ScrollReveal key={review.id} delay={(i % 3) * 100}>
              <ReviewCard review={review} />
            </ScrollReveal>
          ))}
        </div>
        {reviews.length > 0 && (
          <ScrollReveal className="mt-10 text-center">
            <Link href="/reviews" className="btn-outline">
              Read More Travellers Stories
            </Link>
          </ScrollReveal>
        )}
      </section>

      {latestArticles.length > 0 && (
        <section className="section bg-secondary/10">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold text-foreground">The Teyezilla Journal</h2>
            <p className="mt-2 text-foreground/70">
              Stories, guides, and inspiration from Africa.
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((post, i) => (
              <ScrollReveal key={post.id} delay={(i % 3) * 100}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
