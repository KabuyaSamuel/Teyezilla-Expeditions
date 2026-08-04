import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import TourCard from "@/components/TourCard";

export const metadata: Metadata = {
  title: "African Travel Experiences",
  description:
    "Handpicked tours and experiences across Africa, from street food walks and city tours to safaris and cultural immersions, with Teyezilla Expeditions.",
  alternates: { canonical: "/experiences" },
};

export const revalidate = 3600;

const PRODUCT_TYPES = [
  { value: "experience", label: "Experiences" },
  { value: "safari", label: "Safaris" },
  { value: "private_travel", label: "Private Travel" },
];

interface Props {
  searchParams: Promise<{ productType?: string; destination?: string }>;
}

export default async function ExperiencesPage({ searchParams }: Props) {
  const { productType, destination } = await searchParams;
  const [allTours, destinations] = await Promise.all([getPublishedTours(), getDestinations()]);

  const availableDestinationIds = new Set(allTours.map((t) => t.destinationId));
  const destinationOptions = destinations
    .filter((d) => availableDestinationIds.has(d.id))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));

  function buildHref(overrides: { productType?: string; destination?: string }) {
    const params = new URLSearchParams();
    const nextProductType = "productType" in overrides ? overrides.productType : productType;
    const nextDestination = "destination" in overrides ? overrides.destination : destination;
    if (nextProductType) params.set("productType", nextProductType);
    if (nextDestination) params.set("destination", nextDestination);
    const qs = params.toString();
    return qs ? `/experiences?${qs}` : "/experiences";
  }

  const selectedDestination = destination ? destinations.find((d) => d.slug === destination) : undefined;
  const tours = allTours.filter((t) => {
    if (productType && t.productType !== productType) return false;
    if (selectedDestination && t.destinationId !== selectedDestination.id) return false;
    return true;
  });

  function pillClass(active: boolean) {
    return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
    }`;
  }

  return (
    <div className="section">
      <h1 className="h1-page">Experiences</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        From street food in Nairobi to safaris in the Mara and desert camps in the Sahara.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={buildHref({ productType: undefined })} className={pillClass(!productType)}>
          All
        </Link>
        {PRODUCT_TYPES.map((t) => (
          <Link key={t.value} href={buildHref({ productType: t.value })} className={pillClass(productType === t.value)}>
            {t.label}
          </Link>
        ))}
      </div>

      {destinationOptions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={buildHref({ destination: undefined })} className={pillClass(!destination)}>
            All destinations
          </Link>
          {destinationOptions.map((d) => (
            <Link key={d.id} href={buildHref({ destination: d.slug })} className={pillClass(destination === d.slug)}>
              {d.countryName}
            </Link>
          ))}
        </div>
      )}

      {tours.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">Nothing matches those filters yet.</p>
          <p className="mt-2 text-sm text-foreground/70">
            Try a different combination, or get in touch and our travel team will help you find the right trip.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
