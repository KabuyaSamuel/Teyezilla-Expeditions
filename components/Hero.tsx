import Link from "next/link";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[720px] items-center overflow-hidden text-white">
      <HeroCarousel />
      {/* General depth/atmosphere — not relied on alone for text contrast,
          since it can't guarantee enough darkness against every video frame. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.2),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-40">
        {/* Bounded, blurred dark panel — this (not the gradient above) is
            what guarantees WCAG-safe contrast, since it's dark and opaque
            enough to hold up regardless of what's playing behind it. */}
        <div className="animate-fadeUp rounded-3xl bg-black/60 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Africa, Beyond Expectation.
            <span className="h-px w-12 bg-accent" />
          </span>

          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
            <span className="block">Extraordinary Journeys.</span>
            <span className="mt-1 block font-normal italic text-accent">
              Wild Places. Deeper Connections.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-lg text-white/90">
            Based in Nairobi, Teyezilla Expeditions crafts safaris and journeys across Kenya,
            Tanzania, Zanzibar, Egypt, and Morocco - extraordinary Africa, planned by locals.
          </p>
        </div>

        <div className="animate-fadeUp flex flex-wrap gap-4 [animation-delay:400ms]">
          <Link href="/destinations" className="btn-primary">
            Explore Tours
          </Link>
          <Link
            href="/tailor-made-trips"
            className="rounded-full border-2 border-white px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary"
          >
            Design My Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
