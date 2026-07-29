import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTours, getTourBySlug } from "@/lib/tours";
import { getDestinationById } from "@/lib/destinations";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";
import { formatTourDuration } from "@/lib/duration";
import ProductItinerary from "@/components/ProductItinerary";
import ProductHighlights from "@/components/ProductHighlights";
import ProductFactsGrid from "@/components/ProductFactsGrid";
import ProductIncludesExcludes from "@/components/ProductIncludesExcludes";
import ProductGoodToKnow from "@/components/ProductGoodToKnow";
import ProductTeyezillaMoment from "@/components/ProductTeyezillaMoment";
import ProductPricingTiers from "@/components/ProductPricingTiers";
import ProductAddons from "@/components/ProductAddons";

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
    title: tour.metaTitle,
    description: tour.metaDescription,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: tour.metaTitle,
      description: tour.metaDescription,
      images: [tour.ogImage],
    },
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const destination = await getDestinationById(tour.destinationId);
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
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does the ${tour.title} cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${tour.title} starts from ${tour.currency} ${tour.priceFrom} per person for ${formatTourDuration(tour)}.`,
        },
      },
      {
        "@type": "Question",
        name: `How difficult is the ${tour.title}?`,
        acceptedAnswer: { "@type": "Answer", text: `This tour is rated ${tour.difficulty}.` },
      },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="relative h-[380px] w-full">
        <Image src={tour.heroImage} alt={tour.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              {tour.categoryLabel}
            </span>
            <h1 className="mt-3 font-heading text-4xl font-bold text-white md:text-5xl">
              {tour.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="section">
        {/* Answer-first block for AEO/GEO */}
        <p className="max-w-3xl text-lg font-medium text-foreground">
          The {tour.title} runs {formatTourDuration(tour)} and
          starts from {tour.currency} {tour.priceFrom} per person
          {destination ? ` in ${destination.countryName}` : ""}. Difficulty: {tour.difficulty}.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Overview</h2>
              <p className="mt-3 text-foreground/70">{tour.shortDescription}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a href={bookingHref} className="btn-primary px-5 py-2.5 text-sm">
                  Enquire Now
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-5 py-2.5 text-sm"
                >
                  Book Now: WhatsApp a Travel Expert
                </a>
              </div>

              {tour.cancellationPolicy && (
                <div className="mt-5 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Cancellation & Refund Policy
                  </p>
                  <p className="mt-1 text-sm text-foreground/80">{tour.cancellationPolicy}</p>
                </div>
              )}
            </div>

            <ProductItinerary days={tour.itinerary} singleDay={tour.durationDays <= 1 || !!tour.durationHours} />
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

            <ProductFactsGrid facts={facts} />
            <ProductIncludesExcludes inclusions={tour.inclusions} exclusions={tour.exclusions} />
            <ProductGoodToKnow
              bringList={tour.bringList}
              importantInfo={tour.importantInfo}
              cancellationPolicy={tour.cancellationPolicy}
            />
            <ProductTeyezillaMoment text={tour.teyezillaMoment} />
            <ProductPricingTiers tiers={tour.pricingTiers} bookingHref={bookingHref} />
            <ProductAddons addons={tour.addons} />

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

            <div className="card p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">FAQs</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    How much does the {tour.title} cost?
                  </h3>
                  <p className="mt-1 text-sm text-foreground/70">
                    Starts from {tour.currency} {tour.priceFrom} per person for {formatTourDuration(tour)}.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    How difficult is this tour?
                  </h3>
                  <p className="mt-1 text-sm text-foreground/70">Rated {tour.difficulty}.</p>
                </div>
              </div>
            </div>
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
              Book Now: WhatsApp a Travel Expert
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
