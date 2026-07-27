import type { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Travel Guide",
  description: "Best time to visit and visa information for every Teyezilla destination in Africa.",
};

export const revalidate = 3600;

export default async function TravelGuidePage() {
  const destinations = await getDestinations();

  return (
    <div className="section max-w-3xl">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Inspiration</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-foreground">Travel Guide</h1>
      <p className="mt-4 text-foreground/70">
        Best time to visit and visa essentials for every destination we travel to. For anything
        specific to your trip, our travel team is always a message away.
      </p>

      <div className="mt-10 space-y-6">
        {destinations.map((d) => (
          <div key={d.id} className="card p-5">
            <Link href={`/destinations/${d.slug}`}>
              <h2 className="font-heading text-lg font-semibold text-foreground hover:text-primary">
                {d.flagEmoji} {d.countryName}
              </h2>
            </Link>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {d.bestTimeToVisit && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Best Time to Visit
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/70">{d.bestTimeToVisit}</dd>
                </div>
              )}
              {d.visaInfo && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Visa</dt>
                  <dd className="mt-1 text-sm text-foreground/70">{d.visaInfo}</dd>
                </div>
              )}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
