import type { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/lib/destinations";
import { getPublishedTours } from "@/lib/tours";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";
import TripSearch from "@/components/TripSearch";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{
    destination?: string;
    experience?: string;
    travelDate?: string;
    travelers?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { destination, experience, travelDate, travelers } = await searchParams;
  const destinationQuery = destination?.trim().toLowerCase();
  const experienceQuery = experience?.trim().toLowerCase();
  const hasQuery = Boolean(destinationQuery || experienceQuery);

  const [allDestinations, allTours] = hasQuery
    ? await Promise.all([getDestinations(), getPublishedTours()])
    : [[], []];

  const matchedDestinations = destinationQuery
    ? allDestinations.filter((d) => d.countryName.toLowerCase().includes(destinationQuery))
    : [];

  const matchedTours = experienceQuery
    ? allTours.filter(
        (t) =>
          t.title.toLowerCase().includes(experienceQuery) ||
          t.tagline.toLowerCase().includes(experienceQuery) ||
          t.shortDescription.toLowerCase().includes(experienceQuery)
      )
    : [];

  const plannerHref = (() => {
    const params = new URLSearchParams();
    if (destination?.trim()) params.set("destination", destination.trim());
    if (travelers?.trim()) params.set("travelers", travelers.trim());
    const qs = params.toString();
    return qs ? `/trip-planner?${qs}` : "/trip-planner";
  })();

  return (
    <div className="section">
      <h1 className="h1-page">Search</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        {hasQuery
          ? "Here's what matches your search."
          : "Enter a destination or experience below to see matching trips."}
        {travelDate && ` Travel date: ${travelDate}.`}
        {travelers && ` Travelers: ${travelers}.`}
      </p>

      <div className="mt-8">
        <TripSearch
          defaultDestination={destination}
          defaultExperience={experience}
          defaultTravelDate={travelDate}
          defaultTravelers={travelers}
        />
      </div>

      {!hasQuery && (
        <div className="mt-10 rounded-2xl bg-secondary/10 p-8 text-center">
          <p className="text-foreground/70">
            Not sure where to start? Our team can put together a custom itinerary for you.
          </p>
          <Link href={plannerHref} className="btn-primary mt-4 inline-block px-6 py-2.5 text-sm">
            Plan My Trip
          </Link>
        </div>
      )}

      {destinationQuery && (
        <section className="mt-10">
          <h2 className="h2-section">Destinations</h2>
          {matchedDestinations.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedDestinations.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-foreground/70">
              No destinations match &ldquo;{destination}&rdquo;.
            </p>
          )}
        </section>
      )}

      {experienceQuery && (
        <section className="mt-10">
          <h2 className="h2-section">Experiences</h2>
          {matchedTours.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedTours.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-foreground/70">
              No experiences match &ldquo;{experience}&rdquo;.
            </p>
          )}
        </section>
      )}

      {hasQuery && matchedDestinations.length === 0 && matchedTours.length === 0 && (
        <div className="mt-10 rounded-2xl bg-secondary/10 p-8 text-center">
          <p className="text-foreground/70">
            Nothing matched, but our team can still put together a custom trip for you.
          </p>
          <Link href={plannerHref} className="btn-primary mt-4 inline-block px-6 py-2.5 text-sm">
            Plan My Trip
          </Link>
        </div>
      )}
    </div>
  );
}
