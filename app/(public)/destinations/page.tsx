import type { Metadata } from "next";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { getDestinations } from "@/lib/destinations";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { DESTINATIONS_PAGE_DEFAULTS, type DestinationsPageKey } from "@/lib/homepageContent";

export const metadata: Metadata = {
  title: "African Destinations: Kenya, Tanzania, Zanzibar, Egypt, Morocco & More",
  description:
    "Explore Teyezilla Expeditions' African destinations, from Kenya's Maasai Mara to Morocco's Sahara desert.",
  alternates: { canonical: "/destinations" },
};

export const revalidate = 3600;

const FILTERS = [
  { value: "available", label: "Available" },
  { value: "coming-soon", label: "Coming Soon" },
  { value: "all", label: "All" },
] as const;
type FilterValue = (typeof FILTERS)[number]["value"];

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

export default async function DestinationsPage({ searchParams }: Props) {
  const { filter: rawFilter } = await searchParams;
  const filter: FilterValue = FILTERS.some((f) => f.value === rawFilter) ? (rawFilter as FilterValue) : "available";

  const allDestinations = await getDestinations();
  const destinations =
    filter === "all"
      ? allDestinations
      : allDestinations.filter((d) => (filter === "available" ? d.isLaunchDestination : !d.isLaunchDestination));

  const pageKeys = Object.keys(DESTINATIONS_PAGE_DEFAULTS) as DestinationsPageKey[];
  const pageValues = await Promise.all(pageKeys.map((key) => getSiteSetting(key)));
  const pageText = resolveSiteText(DESTINATIONS_PAGE_DEFAULTS, pageKeys, pageValues);

  return (
    <div className="section">
      <h1 className="h1-page">{pageText.destinationsHeadline}</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        {pageText.destinationsIntro1}
      </p>
      <p className="mt-3 max-w-2xl text-foreground/70">
        {pageText.destinationsIntro2}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "available" ? "/destinations" : `/destinations?filter=${f.value}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {destinations.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            {filter === "coming-soon" ? "Nothing coming soon right now." : "No destinations to show yet."}
          </p>
          <p className="mt-2 text-sm text-foreground/70">Check back soon, or explore what&rsquo;s already open.</p>
        </div>
      ) : (
        <>
          {/* Each DestinationCard has its own h3 (also used correctly
              nested under a section h2 on the homepage) -- without this,
              a bare h1 followed directly by h3s skips a heading level. */}
          <h2 className="sr-only">Destinations</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
