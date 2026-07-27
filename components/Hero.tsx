import Link from "next/link";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[720px] items-center overflow-hidden text-white">
      <HeroCarousel />
      {/* Layered scrim: a permanent dark "text zone" over the left/bottom
          column where copy lives, independent of whichever video frame is
          showing — plus the original vertical fade for overall depth. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/70 via-black/30 to-transparent md:w-2/3 md:from-black/65 md:via-black/25 md:to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.2),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-40">
        <span className="animate-fadeUp inline-flex items-center gap-3 rounded-full bg-black/35 py-1.5 pl-4 pr-5 text-xs font-medium uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
          Africa, Beyond Expectation.
          <span className="h-px w-12 bg-accent" />
        </span>

        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.85),0_10px_32px_rgba(0,0,0,0.6)] md:text-6xl">
          <span className="animate-fadeUp block [animation-delay:100ms]">Extraordinary Journeys.</span>
          <span className="animate-fadeUp mt-1 block font-normal italic text-accent [animation-delay:200ms] [text-shadow:0_2px_8px_rgba(0,0,0,0.9),0_10px_32px_rgba(0,0,0,0.7)]">
            Wild Places. Deeper Connections.
          </span>
        </h1>

        <p className="animate-fadeUp max-w-xl text-lg text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] [animation-delay:300ms]">
          Based in Nairobi, Teyezilla Expeditions crafts safaris and journeys across Kenya,
          Tanzania, Zanzibar, Egypt, and Morocco - extraordinary Africa, planned by locals.
        </p>

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
