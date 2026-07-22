import Link from "next/link";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[720px] items-center overflow-hidden text-white">
      <HeroCarousel />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.25),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-40">
        <span className="animate-fadeUp flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Discover Africa with Teyezilla Expeditions
          <span className="h-px w-12 bg-accent" />
        </span>

        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight md:text-6xl">
          <span className="animate-fadeUp block [animation-delay:100ms]">Discover Kenya,</span>
          <span className="animate-fadeUp mt-1 block font-normal italic text-accent [animation-delay:200ms]">
            Your Gateway to Africa.
          </span>
        </h1>

        <p className="animate-fadeUp max-w-xl text-lg text-white/85 [animation-delay:300ms]">
          Based in Nairobi, Teyezilla Expeditions crafts safaris and journeys across Kenya,
          Tanzania, Zanzibar, Egypt, and Morocco - extraordinary Africa, planned by locals.
        </p>

        <div className="animate-fadeUp flex flex-wrap gap-4 [animation-delay:400ms]">
          <Link href="/destinations" className="btn-primary">
            Explore Tours
          </Link>
          <Link
            href="/trip-planner"
            className="rounded-full border-2 border-white px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary"
          >
            Tailor Your Trip
          </Link>
        </div>
      </div>
    </section>
  );
}
