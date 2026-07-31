import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Category {
  label: string;
  description: string;
  href: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Destinations",
    description: "Diverse lands. Diverse cultures. Unforgettable experiences.",
    href: "/destinations",
    image: "https://picsum.photos/seed/category-destinations/600/800",
  },
  {
    label: "Journeys",
    description: "Curated itineraries for every kind of traveler.",
    href: "/journeys",
    image: "https://picsum.photos/seed/category-journeys/600/800",
  },
  {
    label: "Experiences",
    description: "Handpicked activities that bring Africa to life.",
    href: "/experiences",
    image: "https://picsum.photos/seed/category-experiences/600/800",
  },
  {
    label: "Collections",
    description: "Seven ways to experience Africa with Teyezilla.",
    href: "/collections",
    image: "https://picsum.photos/seed/category-collections/600/800",
  },
  {
    label: "Safari",
    description: "The art of the African safari, perfectly crafted.",
    href: "/safari",
    image: "https://picsum.photos/seed/category-safari/600/800",
  },
  {
    label: "Bespoke",
    description: "Your journey. Your way. Designed around you.",
    href: "/tailor-made-trips",
    image: "https://picsum.photos/seed/category-bespoke/600/800",
  },
  {
    label: "Journal",
    description: "Travel stories, guides and inspiration from Africa.",
    href: "/blog",
    image: "https://picsum.photos/seed/category-journal/600/800",
  },
];

export default function CategoryOverview() {
  return (
    <section className="section">
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
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="relative">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide">{category.label}</h3>
                <p className="mt-1 text-xs text-white/80">{category.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent">
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
