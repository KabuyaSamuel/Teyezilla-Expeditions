import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { CATEGORY_OVERVIEW_DEFAULTS, type CategoryOverviewKey } from "@/lib/homepageContent";

// label/href are structural (tied to real routes), so they stay fixed;
// only description/image are admin-editable, via site_settings.
const CATEGORIES = [
  { label: "Destinations", href: "/destinations", descKey: "categoryDestinationsDescription", imageKey: "categoryDestinationsImage" },
  { label: "Journeys", href: "/journeys", descKey: "categoryJourneysDescription", imageKey: "categoryJourneysImage" },
  { label: "Experiences", href: "/experiences", descKey: "categoryExperiencesDescription", imageKey: "categoryExperiencesImage" },
  { label: "Collections", href: "/collections", descKey: "categoryCollectionsDescription", imageKey: "categoryCollectionsImage" },
  { label: "Safari", href: "/safari", descKey: "categorySafariDescription", imageKey: "categorySafariImage" },
  { label: "Bespoke", href: "/tailor-made-trips", descKey: "categoryBespokeDescription", imageKey: "categoryBespokeImage" },
  { label: "Journal", href: "/blog", descKey: "categoryJournalDescription", imageKey: "categoryJournalImage" },
] as const;

export default async function CategoryOverview() {
  const keys = Object.keys(CATEGORY_OVERVIEW_DEFAULTS) as CategoryOverviewKey[];
  const values = await Promise.all(keys.map((key) => getSiteSetting(key)));
  const text = resolveSiteText(CATEGORY_OVERVIEW_DEFAULTS, keys, values);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-10 md:pb-24 md:pt-14">
      <ScrollReveal>
        <h2 className="h2-section">Explore Teyezilla</h2>
        <p className="mt-2 text-foreground/70">Seven ways to discover Africa, all in one place.</p>
      </ScrollReveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {CATEGORIES.map((category, i) => (
          <ScrollReveal key={category.href} delay={(i % 4) * 100}>
            <Link
              href={category.href}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-card transition-transform duration-300 ease-smooth hover:-translate-y-1"
            >
              <Image
                src={text[category.imageKey]}
                alt=""
                fill
                sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              {/* Fixed row heights (title row content-sized, description row
                  pinned to exactly 4rem) is the "standard positioning" --
                  every card's title sits at the same spot and every card's
                  "Explore" sits at the same spot, regardless of how many
                  lines that card's own description happens to need. The
                  admin field enforces CATEGORY_DESCRIPTION_MAX_LENGTH so
                  descriptions fit within those 4 lines without clipping. */}
              <div className="relative grid grid-rows-[auto_4rem_auto] gap-1">
                <h3 className="self-end font-heading text-lg font-bold uppercase tracking-wide">{category.label}</h3>
                <p className="line-clamp-4 text-xs text-white/80">{text[category.descKey]}</p>
                <span className="inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  Explore
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
