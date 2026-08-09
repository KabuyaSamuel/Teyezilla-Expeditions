import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTours, getTourBySlug, getRelatedTours, getToursByIds } from "@/lib/tours";
import { getDestinationById } from "@/lib/destinations";
import { getJourneysByDestination, getJourneysByIds } from "@/lib/journeys";
import { getRelatedBlogPosts, getBlogPostsByIds } from "@/lib/blog";
import { getApprovedReviewsByTourId } from "@/lib/reviews";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";
import { formatTourDuration } from "@/lib/duration";
import ProductItinerary from "@/components/ProductItinerary";
import ProductHighlights from "@/components/ProductHighlights";
import ProductFaqAccordion from "@/components/ProductFaqAccordion";
import ProductFactsGrid from "@/components/ProductFactsGrid";
import ProductIncludesExcludes from "@/components/ProductIncludesExcludes";
import ProductGoodToKnow from "@/components/ProductGoodToKnow";
import ProductTeyezillaMoment from "@/components/ProductTeyezillaMoment";
import ProductPricingTiers from "@/components/ProductPricingTiers";
import ProductAddons from "@/components/ProductAddons";
import ProductVehicles from "@/components/ProductVehicles";
import ProductAccommodations from "@/components/ProductAccommodations";
import RelatedContent from "@/components/RelatedContent";
import JsonLd from "@/components/JsonLd";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  return {
    title: tour.metaTitle || tour.title,
    description: tour.metaDescription || tour.shortDescription,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: tour.metaTitle || tour.title,
      description: tour.metaDescription || tour.shortDescription,
      images: tour.ogImage ? [tour.ogImage] : [tour.heroImage],
    },
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const [destination, tourReviews] = await Promise.all([
    getDestinationById(tour.destinationId),
    getApprovedReviewsByTourId(tour.id),
  ]);

  // "Bring This to Life": staff-curated picks take priority per category;
  // any category left empty falls back to the existing destination-match
  // auto-compute.
  const [manualRelatedTours, manualRelatedJourneys, manualRelatedArticles] = await Promise.all([
    getToursByIds(tour.relatedTourIds),
    getJourneysByIds(tour.relatedJourneyIds),
    getBlogPostsByIds(tour.relatedBlogPostIds),
  ]);
  const needsAutoTours = manualRelatedTours.length === 0;
  const needsAutoJourneys = manualRelatedJourneys.length === 0;
  const needsAutoArticles = manualRelatedArticles.length === 0;
  const [autoTours, autoJourneys, autoArticles] =
    needsAutoTours || needsAutoJourneys || needsAutoArticles
      ? await Promise.all([
          needsAutoTours ? getRelatedTours(tour.destinationId, tour.slug, 3) : Promise.resolve([]),
          needsAutoJourneys ? getJourneysByDestination(tour.destinationId, undefined, 3) : Promise.resolve([]),
          needsAutoArticles ? getRelatedBlogPosts(tour.destinationId, undefined, 3) : Promise.resolve([]),
        ])
      : [[], [], []];

  const relatedTours = needsAutoTours ? autoTours : manualRelatedTours;
  const relatedJourneys = needsAutoJourneys ? autoJourneys : manualRelatedJourneys;
  const relatedArticles = needsAutoArticles ? autoArticles : manualRelatedArticles;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the "${tour.title}" tour. Could you share more details?`
  )}`;
  const bookingHref = `/booking?tour=${tour.slug}`;

  const touristTripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.shortDescription,
    touristType: tour.categoryLabel,
    offers: {
      "@type": "Offer",
      price: tour.priceFrom,
      priceCurrency: tour.currency,
    },
    ...(tourReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number((tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length).toFixed(1)),
            reviewCount: tourReviews.length,
          },
        }
      : {}),
  };

  const faqs = [
    {
      question: `How much does the ${tour.title} cost?`,
      answer: `The ${tour.title} starts from ${tour.currency} ${tour.priceFrom} per person for ${formatTourDuration(tour)}.`,
    },
    ...(tour.difficulty
      ? [{ question: `How difficult is the ${tour.title}?`, answer: `This tour is rated ${tour.difficulty}.` }]
      : []),
    ...tour.faqs.map((f) => ({ question: f.question, answer: f.answer })),
  ];
  const faqJsonLd = faqPageJsonLd(faqs);

  const breadcrumbJsonLd = breadcrumbListJsonLd(
    destination
      ? [
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: destination.countryName, path: `/destinations/${destination.slug}` },
          { name: tour.title, path: `/tours/${tour.slug}` },
        ]
      : [
          { name: "Home", path: "/" },
          { name: tour.title, path: `/tours/${tour.slug}` },
        ]
  );

  const facts = [
    { label: "Duration", value: formatTourDuration(tour) },
    { label: "Location", value: destination?.countryName ?? "" },
    {
      label: "Experience",
      value: tour.productType === "private_travel" ? "Private" : tour.productType === "safari" ? "Safari" : "Private Experience",
    },
    { label: "Group Size", value: tour.minGuests && tour.maxGuests ? `${tour.minGuests}–${tour.maxGuests} Guests` : "" },
    { label: "Language", value: tour.languages.join(", ") },
    { label: "Fitness", value: tour.fitnessLevel },
    { label: "Best For", value: tour.bestFor.join(", ") },
    { label: "Availability", value: tour.availabilityNote },
    { label: "Transportation", value: tour.transportation },
    { label: "Guide", value: tour.guideInfo },
  ];

  return (
    <div>
      <JsonLd data={touristTripJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="relative h-[380px] w-full">
        {tour.heroImage && (
          <Image src={tour.heroImage} alt={tour.title} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              {tour.categoryLabel}
            </span>
            <h1 className="mt-3 h1-page text-white">
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <p className="text-foreground/70">{tour.shortDescription}</p>
            </div>

            <ProductFactsGrid facts={facts} />

            {tour.cancellationPolicy && (
              <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Cancellation & Refund Policy
                </p>
                <p className="mt-1 text-sm text-foreground/80">{tour.cancellationPolicy}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a href={bookingHref} className="btn-primary px-5 py-2.5 text-sm">
                Enquire Now
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline px-5 py-2.5 text-sm"
              >
                Book Now
              </a>
            </div>

            {tour.overview && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">The Experience</h2>
                <p className="mt-3 whitespace-pre-line text-foreground/70">{tour.overview}</p>
              </div>
            )}

            <ProductHighlights highlights={tour.highlights} />

            {tour.activities.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Experiences & Activities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.activities.map((a) => (
                    <span key={a.id} className="rounded-full bg-secondary/15 px-4 py-1.5 text-sm text-foreground">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ProductItinerary days={tour.itinerary} singleDay={tour.durationDays <= 1 || !!tour.durationHours} />
            <ProductAccommodations accommodations={tour.accommodations} />
            <ProductVehicles vehicles={tour.vehicles} />
            <ProductIncludesExcludes inclusions={tour.inclusions} exclusions={tour.exclusions} />
            <ProductGoodToKnow
              bringList={tour.bringList}
              importantInfo={tour.importantInfo}
              cancellationPolicy={tour.cancellationPolicy}
            />
            <ProductTeyezillaMoment text={tour.teyezillaMoment} />
            <ProductPricingTiers tiers={tour.pricingTiers} bookingHref={bookingHref} kind="tour" />
            <ProductAddons addons={tour.addons} bookingHref={bookingHref} />

            {tour.featuredInJourneys.length > 0 && (
              <div className="card p-6">
                <h2 className="font-heading text-xl font-semibold text-foreground">Featured In These Journeys</h2>
                <p className="mt-1 text-sm text-foreground/70">
                  This experience is included as part of the following journeys.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.featuredInJourneys.map((j) => (
                    <Link
                      key={j.slug}
                      href={`/journeys/${j.slug}`}
                      className="rounded-full bg-secondary/15 px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary/25"
                    >
                      {j.title} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <ProductFaqAccordion faqs={faqs} />
          </div>

          <aside className="card sticky top-24 h-fit p-6">
            <p className="font-heading text-2xl font-bold text-accent">
              {tour.currency} {tour.priceFrom}
            </p>
            <p className="text-sm text-foreground/60">per person</p>
            <a
              href={bookingHref}
              className="btn-primary mt-4 block text-center"
            >
              Enquire Now
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-3 block text-center"
            >
              Book Now
            </a>
          </aside>
        </div>
      </div>

      <RelatedContent tours={relatedTours} journeys={relatedJourneys} articles={relatedArticles} />
    </div>
  );
}
