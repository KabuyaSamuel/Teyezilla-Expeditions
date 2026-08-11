import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getJourneys, getJourneyBySlug, getJourneysByDestination, getJourneysByIds } from "@/lib/journeys";
import { getRelatedTours, getToursByIds } from "@/lib/tours";
import { getRelatedBlogPosts, getBlogPostsByIds } from "@/lib/blog";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";
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
  const journeys = await getJourneys();
  return journeys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);
  if (!journey) return {};

  return {
    title: journey.metaTitle || journey.title,
    description: journey.metaDescription || journey.shortDescription,
    alternates: { canonical: `/journeys/${journey.slug}` },
    openGraph: {
      title: journey.metaTitle || journey.title,
      description: journey.metaDescription || journey.shortDescription,
      images: journey.ogImage ? [journey.ogImage] : undefined,
    },
  };
}

export default async function JourneyPage({ params }: Props) {
  const { slug } = await params;
  const journey = await getJourneyBySlug(slug);
  if (!journey) notFound();

  const destinationNames = journey.destinations.map((d) => d.countryName).join(" · ");
  const primaryDestinationId = journey.destinations[0]?.id;
  const includedTourIds = new Set(journey.includedTours.map((t) => t.id));

  // "Bring This to Life": staff-curated picks take priority per category;
  // any category left empty falls back to the existing destination-match
  // auto-compute.
  const [manualRelatedJourneys, manualRelatedTours, manualRelatedArticles] = await Promise.all([
    getJourneysByIds(journey.relatedJourneyIds),
    getToursByIds(journey.relatedTourIds),
    getBlogPostsByIds(journey.relatedBlogPostIds),
  ]);
  const needsAutoTours = manualRelatedTours.length === 0;
  const needsAutoJourneys = manualRelatedJourneys.length === 0;
  const needsAutoArticles = manualRelatedArticles.length === 0;
  const [autoToursRaw, autoJourneys, autoArticles] =
    primaryDestinationId && (needsAutoTours || needsAutoJourneys || needsAutoArticles)
      ? await Promise.all([
          needsAutoTours ? getRelatedTours(primaryDestinationId, undefined, 6) : Promise.resolve([]),
          needsAutoJourneys ? getJourneysByDestination(primaryDestinationId, journey.slug, 3) : Promise.resolve([]),
          needsAutoArticles ? getRelatedBlogPosts(primaryDestinationId, undefined, 3) : Promise.resolve([]),
        ])
      : [[], [], []];

  const relatedTours = needsAutoTours
    ? autoToursRaw.filter((t) => !includedTourIds.has(t.id)).slice(0, 3)
    : manualRelatedTours;
  const relatedJourneys = needsAutoJourneys ? autoJourneys : manualRelatedJourneys;
  const relatedArticles = needsAutoArticles ? autoArticles : manualRelatedArticles;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the "${journey.title}" journey. Could you share more details?`
  )}`;
  const bookingHref = `/booking?journey=${journey.slug}`;

  const touristTripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: journey.title,
    description: journey.shortDescription,
    offers: {
      "@type": "Offer",
      price: journey.priceFrom,
      priceCurrency: journey.currency,
    },
  };

  const facts = [
    { label: "Duration", value: `${journey.durationDays} Days / ${Math.max(journey.durationDays - 1, 0)} Nights` },
    { label: "Destination", value: destinationNames },
    { label: "Experience", value: journey.productType === "multi_country_expedition" ? "Multi-Country Expedition" : "Signature Journey" },
    { label: "Group Size", value: journey.minGuests && journey.maxGuests ? `${journey.minGuests}–${journey.maxGuests} Guests` : "" },
    { label: "Transport", value: journey.transportation },
    { label: "Guide", value: journey.guideInfo },
    { label: "Meals", value: journey.foodAndDrinks },
    { label: "Best Time", value: journey.availabilityNote },
    { label: "Fitness Level", value: journey.fitnessLevel },
    { label: "Ideal For", value: journey.bestFor.join(", ") },
    { label: "Languages", value: journey.languages.join(", ") },
  ];

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Journeys", path: "/journeys" },
    { name: journey.title, path: `/journeys/${journey.slug}` },
  ]);

  const faqs = [
    {
      question: `How much does the ${journey.title} cost?`,
      answer: `The ${journey.title} starts from ${journey.currency} ${journey.priceFrom} per person for ${journey.durationDays} days.`,
    },
    ...(journey.difficulty
      ? [{ question: `How difficult is the ${journey.title}?`, answer: `This journey is rated ${journey.difficulty}.` }]
      : []),
    ...journey.faqs.map((f) => ({ question: f.question, answer: f.answer })),
  ];
  const faqJsonLd = faqPageJsonLd(faqs);

  return (
    <div>
      <JsonLd data={touristTripJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="relative h-[380px] w-full">
        {journey.heroImage && (
          <Image src={journey.heroImage} alt={journey.title} fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10">
            {journey.journeyTypes[0] && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                {journey.journeyTypes[0]}
              </span>
            )}
            <h1 className="mt-3 h1-page text-white">
              {journey.title}
            </h1>
            <p className="mt-2 text-sm text-white/80">{destinationNames}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <p className="text-foreground/70">{journey.shortDescription}</p>
            </div>

            <ProductFactsGrid facts={facts} />

            {journey.cancellationPolicy.length > 0 && (
              <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Cancellation & Refund Policy
                </p>
                <ul className="mt-1 space-y-1 text-sm text-foreground/80">
                  {journey.cancellationPolicy.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a href={bookingHref} className="btn-primary px-5 py-2.5 text-sm">
                Enquire About This Journey
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

            {journey.overview && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">The Journey Story</h2>
                <p className="mt-3 whitespace-pre-line text-foreground/70">{journey.overview}</p>
              </div>
            )}

            <ProductHighlights highlights={journey.highlights} />

            {journey.activities.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Experiences & Activities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {journey.activities.map((a) => (
                    <span key={a.id} className="rounded-full bg-secondary/15 px-4 py-1.5 text-sm text-foreground">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ProductItinerary days={journey.itinerary} singleDay={false} />
            <ProductAccommodations accommodations={journey.accommodations} />
            <ProductVehicles vehicles={journey.vehicles} />
            <ProductIncludesExcludes inclusions={journey.inclusions} exclusions={journey.exclusions} />
            <ProductGoodToKnow
              bringList={journey.bringList}
              importantInfo={journey.importantInfo}
              cancellationPolicy={journey.cancellationPolicy}
            />
            <ProductTeyezillaMoment text={journey.teyezillaMoment} />
            <ProductPricingTiers tiers={journey.pricingTiers} bookingHref={bookingHref} kind="journey" />
            <ProductAddons addons={journey.addons} bookingHref={bookingHref} />

            <ProductFaqAccordion faqs={faqs} />
          </div>

          <aside className="card sticky top-24 h-fit p-6">
            <p className="font-heading text-2xl font-bold text-accent">
              {journey.currency} {journey.priceFrom.toLocaleString()}
            </p>
            <p className="text-sm text-foreground/60">per person</p>
            <a href={bookingHref} className="btn-primary mt-4 block text-center">
              Enquire About This Journey
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
