import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestinations, getDestinationBySlug } from "@/lib/destinations";
import { getToursByDestination } from "@/lib/tours";
import { getJourneysByDestination } from "@/lib/journeys";
import { getRelatedBlogPosts } from "@/lib/blog";
import TourCard from "@/components/TourCard";
import RelatedContent from "@/components/RelatedContent";
import JsonLd from "@/components/JsonLd";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: destination.metaTitle,
    description: destination.metaDescription,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: destination.metaTitle,
      description: destination.metaDescription,
      images: [destination.ogImage],
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const [relatedTours, relatedJourneys, relatedArticles] = await Promise.all([
    getToursByDestination(destination.id),
    getJourneysByDestination(destination.id, undefined, 3),
    getRelatedBlogPosts(destination.id, undefined, 3),
  ]);

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: destination.countryName, path: `/destinations/${destination.slug}` },
  ]);

  const faqJsonLd = faqPageJsonLd([
    { question: `What is the best time to visit ${destination.countryName}?`, answer: destination.bestTimeToVisit },
    { question: `Do I need a visa to visit ${destination.countryName}?`, answer: destination.visaInfo },
  ]);

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <div className="relative h-[420px] w-full">
        <Image
          src={destination.heroImage}
          alt={`${destination.countryName} safari and travel`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10">
            <h1 className="h1-page text-white">
              {destination.flagEmoji} {destination.countryName}
            </h1>
          </div>
        </div>
      </div>

      <div className="section">
        {/* Answer-first block for AEO/GEO */}
        <p className="max-w-3xl text-lg font-medium text-foreground">
          {destination.overview}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Best Time to Visit
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{destination.bestTimeToVisit}</p>
          </div>
          <div className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Visa Information
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{destination.visaInfo}</p>
          </div>
        </div>

        {(destination.healthGuidance || destination.packingList || destination.insuranceInfo) && (
          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Travel Guide</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {destination.healthGuidance && (
                <div className="card p-6">
                  <h3 className="font-heading text-base font-semibold text-foreground">Health & Vaccinations</h3>
                  <p className="mt-2 text-sm text-foreground/70">{destination.healthGuidance}</p>
                </div>
              )}
              {destination.packingList && (
                <div className="card p-6">
                  <h3 className="font-heading text-base font-semibold text-foreground">What to Pack</h3>
                  <p className="mt-2 text-sm text-foreground/70">{destination.packingList}</p>
                </div>
              )}
              {destination.insuranceInfo && (
                <div className="card p-6">
                  <h3 className="font-heading text-base font-semibold text-foreground">Travel Insurance</h3>
                  <p className="mt-2 text-sm text-foreground/70">{destination.insuranceInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {relatedTours.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Tour Packages
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 card p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                What is the best time to visit {destination.countryName}?
              </h3>
              <p className="mt-1 text-sm text-foreground/70">{destination.bestTimeToVisit}</p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                Do I need a visa to visit {destination.countryName}?
              </h3>
              <p className="mt-1 text-sm text-foreground/70">{destination.visaInfo}</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/booking" className="btn-primary">
            Enquire About Your {destination.countryName} Trip
          </Link>
        </div>
      </div>

      <RelatedContent journeys={relatedJourneys} articles={relatedArticles} />
    </div>
  );
}
