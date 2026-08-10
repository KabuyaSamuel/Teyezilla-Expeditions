import type { Metadata } from "next";
import Link from "next/link";
import { getJourneys, getJourneyTypes } from "@/lib/journeys";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { JOURNEYS_PAGE_DEFAULTS, type JourneysPageKey } from "@/lib/homepageContent";
import JourneyCard from "@/components/JourneyCard";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Journeys",
  description: "Curated multi-day journeys across Africa with Teyezilla Expeditions.",
  alternates: { canonical: "/journeys" },
};

export const revalidate = 3600;

const PAGE_SIZE = 9;
const TEXT_KEYS = Object.keys(JOURNEYS_PAGE_DEFAULTS) as JourneysPageKey[];

interface Props {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function JourneysPage({ searchParams }: Props) {
  const { type, page: rawPage } = await searchParams;
  const [allJourneys, journeyTypes, ...textValues] = await Promise.all([
    getJourneys(),
    getJourneyTypes(),
    ...TEXT_KEYS.map((key) => getSiteSetting(key)),
  ]);
  const text = resolveSiteText(JOURNEYS_PAGE_DEFAULTS, TEXT_KEYS, textValues);
  const filteredJourneys = type ? allJourneys.filter((j) => j.journeyTypes.includes(type)) : allJourneys;

  const totalPages = Math.max(1, Math.ceil(filteredJourneys.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(rawPage) || 1), totalPages);
  const journeys = filteredJourneys.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function buildHref(nextPage: number) {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `/journeys?${qs}` : "/journeys";
  }

  return (
    <div className="section">
      <h1 className="h1-page">{text.journeysHeadline}</h1>
      <p className="mt-3 max-w-2xl whitespace-pre-line text-foreground/70">{text.journeysIntro}</p>

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
        <>
          {/* Each JourneyCard has its own h3; without this, a bare h1
              followed directly by h3s skips a heading level. */}
          <h2 className="sr-only">Journeys</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      )}
    </div>
  );
}
