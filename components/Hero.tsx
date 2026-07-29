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

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 pb-20 pt-36 sm:gap-5 sm:pb-24 sm:pt-40">
        {/* Each line gets its own tight dark backdrop (not one big card) —
            box-decoration-break:clone keeps that backdrop snug per visual
            line even when text wraps, like a film subtitle, instead of one
            rectangle stretching across empty space. */}
        <span className="animate-fadeUp inline-flex items-center gap-2 rounded-full bg-black/55 py-1.5 pl-3.5 pr-4 text-[10px] font-medium uppercase tracking-[0.2em] text-accent sm:gap-3 sm:pl-4 sm:pr-5 sm:text-xs">
          Africa, Beyond Expectation.
          <span className="h-px w-8 bg-accent sm:w-12" />
        </span>

        <h1 className="flex max-w-2xl flex-col items-start gap-1 font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
          <span className="animate-fadeUp inline-block bg-black/55 px-2 py-0.5 text-white [animation-delay:100ms] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] sm:px-3 sm:py-1">
            Extraordinary Journeys.
          </span>
          <span className="animate-fadeUp inline-block bg-black/55 px-2 py-0.5 font-normal italic text-accent [animation-delay:200ms] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] sm:px-3 sm:py-1">
            Wild Places. Deeper Connections.
          </span>
        </h1>

        <p className="animate-fadeUp max-w-xl text-base leading-relaxed text-white/90 [animation-delay:300ms] sm:text-lg">
          <span className="bg-black/50 px-2 py-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone] sm:px-3 sm:py-1">
            Discover Africa through extraordinary safaris, immersive experiences, and
            thoughtfully crafted journeys — created by locals who know the places they call home.
          </span>
        </p>

        <div className="animate-fadeUp mt-1 flex flex-wrap gap-3 [animation-delay:400ms] sm:gap-4">
          <Link href="/destinations" className="btn-primary text-sm sm:text-base">
            Explore Tours
          </Link>
          <Link
            href="/tailor-made-trips"
            className="rounded-full border-2 border-white px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary sm:px-6 sm:py-3 sm:text-base"
          >
            Design My Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
