import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTours } from "@/lib/tours";
import { getDestinations } from "@/lib/destinations";
import { getExperienceTypes, getToursByExperienceType } from "@/lib/experienceTypes";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { EXPERIENCES_PAGE_DEFAULTS, type ExperiencesPageKey } from "@/lib/homepageContent";
import TourCard from "@/components/TourCard";
import Pagination from "@/components/Pagination";
import FilterSelect from "@/components/FilterSelect";

const TEXT_KEYS = Object.keys(EXPERIENCES_PAGE_DEFAULTS) as ExperiencesPageKey[];

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

const PAGE_SIZE = 9;

interface Props {
  searchParams: Promise<{ productType?: string; destination?: string; category?: string; page?: string }>;
}

export default async function ExperiencesPage({ searchParams }: Props) {
  const { productType, destination, category, page: rawPage } = await searchParams;
  const [allTours, destinations, experienceTypes, ...textValues] = await Promise.all([
    getPublishedTours(),
    getDestinations(),
    getExperienceTypes(),
    ...TEXT_KEYS.map((key) => getSiteSetting(key)),
  ]);
  const text = resolveSiteText(EXPERIENCES_PAGE_DEFAULTS, TEXT_KEYS, textValues);
  // Only fetched when a category filter is actually applied -- the join
  // query is otherwise unnecessary work on every unfiltered page view.
  const categoryTours = category ? await getToursByExperienceType(category) : undefined;

  const availableDestinationIds = new Set(allTours.map((t) => t.destinationId));
  const destinationOptions = destinations
    .filter((d) => availableDestinationIds.has(d.id))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));

  function buildHref(overrides: { productType?: string; destination?: string; category?: string; page?: number }) {
    const params = new URLSearchParams();
    const nextProductType = "productType" in overrides ? overrides.productType : productType;
    const nextDestination = "destination" in overrides ? overrides.destination : destination;
    const nextCategory = "category" in overrides ? overrides.category : category;
    const nextPage = overrides.page ?? 1;
    if (nextProductType) params.set("productType", nextProductType);
    if (nextDestination) params.set("destination", nextDestination);
    if (nextCategory) params.set("category", nextCategory);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `/experiences?${qs}` : "/experiences";
  }

  const selectedDestination = destination ? destinations.find((d) => d.slug === destination) : undefined;
  const filteredTours = (categoryTours ?? allTours).filter((t) => {
    if (productType && t.productType !== productType) return false;
    if (selectedDestination && t.destinationId !== selectedDestination.id) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(rawPage) || 1), totalPages);
  const tours = filteredTours.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function pillClass(active: boolean) {
    return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active ? "bg-primary text-white" : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
    }`;
  }

  return (
    <div className="section">
      <h1 className="h1-page">{text.experiencesHeadline}</h1>
      <p className="mt-3 max-w-2xl whitespace-pre-line text-foreground/70">{text.experiencesIntro1}</p>
      <p className="mt-3 max-w-2xl whitespace-pre-line text-foreground/70">{text.experiencesIntro2}</p>

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

      {/* Category and destination lists both grow as staff add more of
          them, so they're dropdowns rather than pill rows -- the fixed set
          of 3 product types above reads fine as pills. */}
      {(experienceTypes.length > 0 || destinationOptions.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {experienceTypes.length > 0 && (
            <FilterSelect
              ariaLabel="Filter by category"
              value={category ?? ""}
              options={[
                { value: "", label: "All Categories", href: buildHref({ category: undefined }) },
                ...experienceTypes.map((t) => ({ value: t.slug, label: t.name, href: buildHref({ category: t.slug }) })),
              ]}
            />
          )}
          {destinationOptions.length > 0 && (
            <FilterSelect
              ariaLabel="Filter by destination"
              value={destination ?? ""}
              options={[
                { value: "", label: "All Destinations", href: buildHref({ destination: undefined }) },
                ...destinationOptions.map((d) => ({ value: d.slug, label: d.countryName, href: buildHref({ destination: d.slug }) })),
              ]}
            />
          )}
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
        <>
          {/* Each TourCard has its own h3; without this, a bare h1
              followed directly by h3s skips a heading level. */}
          <h2 className="sr-only">Experiences</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} priority={i === 0} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => buildHref({ page: p })} />
        </>
      )}
    </div>
  );
}
