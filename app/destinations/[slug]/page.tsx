import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestinations, getDestinationBySlug } from "@/lib/destinations";
import { getToursByDestination } from "@/lib/tours";
import TourCard from "@/components/TourCard";

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

  const relatedTours = await getToursByDestination(destination.id);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Destinations", item: "/destinations" },
      { "@type": "ListItem", position: 3, name: destination.countryName, item: `/destinations/${destination.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best time to visit ${destination.countryName}?`,
        acceptedAnswer: { "@type": "Answer", text: destination.bestTimeToVisit },
      },
      {
        "@type": "Question",
        name: `Do I need a visa to visit ${destination.countryName}?`,
        acceptedAnswer: { "@type": "Answer", text: destination.visaInfo },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
            <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
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
          <Link href={`/booking?destination=${destination.slug}`} className="btn-primary">
            Start Booking Your {destination.countryName} Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
