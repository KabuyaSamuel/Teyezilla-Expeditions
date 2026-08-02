import type { Metadata } from "next";
import Link from "next/link";
import { getJourneys, getJourneyTypes } from "@/lib/journeys";
import JourneyCard from "@/components/JourneyCard";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Curated multi-day journeys across Africa with Teyezilla Expeditions.",
  alternates: { canonical: "/journeys" },
};

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function JourneysPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const [allJourneys, journeyTypes] = await Promise.all([getJourneys(), getJourneyTypes()]);
  const journeys = type ? allJourneys.filter((j) => j.journeyTypes.includes(type)) : allJourneys;

  return (
    <div className="section">
      <h1 className="h1-page">Journeys</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Thoughtfully designed, multi-day itineraries, from signature single-country trips to
        multi-country expeditions across Africa.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/journeys"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !type ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
          }`}
        >
          All
        </Link>
        {journeyTypes.map((t) => (
          <Link
            key={t.id}
            href={`/journeys?type=${encodeURIComponent(t.name)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              type === t.name ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
            }`}
          >
            {t.name}
          </Link>
        ))}
      </div>

      {journeys.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            {type ? `No journeys under "${type}" yet.` : "Our first curated journeys are coming soon."}
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            {type
              ? "Try another journey type, or get in touch to start planning a custom multi-day itinerary."
              : "In the meantime, explore our individual tours and destinations, or get in touch to start planning a custom multi-day itinerary."}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </div>
      )}
    </div>
  );
}
