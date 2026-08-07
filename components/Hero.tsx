import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import { getSiteSetting } from "@/lib/settings";
import { getHeroSlides, HERO_TEXT_DEFAULTS, type HeroTextKey } from "@/lib/hero";

export default async function Hero() {
  const keys = Object.keys(HERO_TEXT_DEFAULTS) as HeroTextKey[];
  const [slides, ...values] = await Promise.all([
    getHeroSlides(),
    ...keys.map((key) => getSiteSetting(key)),
  ]);
  const text = Object.fromEntries(
    keys.map((key, i) => [key, values[i] || HERO_TEXT_DEFAULTS[key]])
  ) as typeof HERO_TEXT_DEFAULTS;

  return (
    <section className="relative -mt-20 flex min-h-[720px] items-center overflow-hidden text-white">
      <HeroCarousel slides={slides} />
      {/* Base darkening, strongest at the bottom where the text sits. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.2),transparent_60%)]" />
      {/* Extra vignette focused behind the text column specifically, so
          legibility doesn't depend on a solid backdrop behind every line
          (that read as a row of boxes) while still working against a
          bright video frame there. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_20%_75%,rgba(0,0,0,0.55),transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 pb-20 pt-36 sm:gap-5 sm:pb-24 sm:pt-40">
        <span className="animate-fadeUp inline-flex items-center gap-2 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] text-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:gap-3 sm:text-xs">
          {text.heroBadgeText}
          <span className="h-px w-8 bg-accent sm:w-12" />
        </span>

        <h1 className="h1-hero flex max-w-2xl flex-col items-start gap-1">
          <span className="animate-fadeUp inline-block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [animation-delay:100ms]">
            {text.heroHeadlineLine1}
          </span>
          <span className="animate-fadeUp inline-block font-normal italic text-accent drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [animation-delay:200ms]">
            {text.heroHeadlineLine2}
          </span>
        </h1>

        <p className="animate-fadeUp max-w-xl text-base leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] [animation-delay:300ms] sm:text-lg">
          {text.heroSubtitle}
        </p>

        <div className="animate-fadeUp mt-1 flex flex-wrap gap-3 [animation-delay:400ms] sm:gap-4">
          <Link href={text.heroCta1Href} className="btn-primary text-sm sm:text-base">
            {text.heroCta1Label}
          </Link>
          <Link
            href={text.heroCta2Href}
            className="rounded-full border-2 border-white px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary sm:px-6 sm:py-3 sm:text-base"
          >
            {text.heroCta2Label}
          </Link>
        </div>
      </div>
    </section>
  );
}
