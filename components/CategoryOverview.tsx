import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Category {
  icon: string;
  label: string;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    icon: "🦁",
    label: "Safaris",
    tagline: "Into the wild.",
    description: "Discover Africa's iconic wildlife and extraordinary wilderness.",
    cta: "Explore Safaris",
    href: "/safari",
    image: "https://picsum.photos/seed/category-safaris/600/800",
  },
  {
    icon: "🧭",
    label: "Journeys",
    tagline: "Go beyond the ordinary.",
    description: "Curated multi-day journeys connecting wildlife, culture, adventure and place.",
    cta: "Explore Journeys",
    href: "/journeys",
    image: "https://picsum.photos/seed/category-journeys/600/800",
  },
  {
    icon: "✨",
    label: "Experiences",
    tagline: "Experience the real Africa.",
    description: "Authentic activities, local encounters and unforgettable moments.",
    cta: "Explore Experiences",
    href: "/experiences",
    image: "https://picsum.photos/seed/category-experiences/600/800",
  },
  {
    icon: "🌍",
    label: "Destinations",
    tagline: "Choose where to go.",
    description: "Explore the destinations that make Africa extraordinary.",
    cta: "Explore Destinations",
    href: "/destinations",
    image: "https://picsum.photos/seed/category-destinations/600/800",
  },
  {
    icon: "🎨",
    label: "Collections",
    tagline: "Travel by what inspires you.",
    description: "Discover journeys curated around your passions and travel style.",
    cta: "Explore Collections",
    href: "/collections",
    image: "https://picsum.photos/seed/category-collections/600/800",
  },
  {
    icon: "🛻",
    label: "Private Travel",
    tagline: "Africa, exclusively yours.",
    description: "Private journeys designed around your time, interests and travel style.",
    cta: "Explore Private Travel",
    href: "/private-travel",
    image: "https://picsum.photos/seed/category-private-travel/600/800",
  },
  {
    icon: "✦",
    label: "Bespoke & Concierge",
    tagline: "Travel, personally designed.",
    description: "Create your perfect journey and receive personalised support along the way.",
    cta: "Discover Bespoke & Concierge",
    href: "/tailor-made-trips",
    image: "https://picsum.photos/seed/category-bespoke/600/800",
  },
];

export default function CategoryOverview() {
  return (
    <section className="section">
      <ScrollReveal>
        <h2 className="font-heading text-3xl font-bold text-foreground">
          Seven Ways to Discover Africa, All in One Place
        </h2>
        <p className="mt-2 text-foreground/70">Explore Africa through the way you want to travel.</p>
      </ScrollReveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="relative">
                <span aria-hidden className="text-2xl">{category.icon}</span>
                <h3 className="mt-2 font-heading text-xl font-bold leading-tight">{category.label}</h3>
                <p className="mt-1 text-sm font-semibold leading-snug text-accent">{category.tagline}</p>
                <p className="mt-1.5 text-sm leading-snug text-white/80">{category.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  {category.cta}
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
