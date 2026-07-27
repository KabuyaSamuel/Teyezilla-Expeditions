import type { Metadata } from "next";
import { getJourneys, getJourneyTypes } from "@/lib/journeys";
import JourneyCard from "@/components/JourneyCard";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Curated multi-day journeys across Africa with Teyezilla Expeditions.",
};

export const revalidate = 3600;

export default async function JourneysPage() {
  const [journeys, journeyTypes] = await Promise.all([getJourneys(), getJourneyTypes()]);

  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-foreground">Journeys</h1>
      <p className="mt-3 max-w-2xl text-foreground/70">
        Thoughtfully designed, multi-day itineraries — from signature single-country trips to
        multi-country expeditions across Africa.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {journeyTypes.map((type) => (
          <span key={type.id} className="rounded-full bg-secondary/15 px-4 py-2 text-sm font-medium text-foreground/70">
            {type.name}
          </span>
        ))}
      </div>

      {journeys.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            Our first curated journeys are coming soon.
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            In the meantime, explore our individual tours and destinations, or get in touch to
            start planning a custom multi-day itinerary.
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
