import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/types";
import WishlistButton from "./WishlistButton";

export default function DestinationCard({
  destination,
  priority = false,
}: {
  destination: Destination;
  // Set on the first card of a page's main grid (e.g. /destinations) so
  // that card's image -- the likely LCP element on mobile, same pattern
  // confirmed via PageSpeed Insights on TourCard -- skips lazy-loading
  // and gets fetchpriority=high instead of being discovered only after
  // JS runs.
  priority?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-56 w-full overflow-hidden bg-secondary/10">
        {destination.heroImage && (
          <Image
            src={destination.heroImage}
            alt={`${destination.countryName} travel and safari tours`}
            fill
            // Breakpoints match every grid this renders in (sm:grid-cols-2
            // lg:grid-cols-3) exactly -- the old 768px cutoff didn't
            // correspond to either Tailwind breakpoint actually used,
            // so next/image was fetching a full-width image between
            // 640-768px (already a 2-col grid there) and a too-small one
            // between 768-1024px (still 2-col, not yet 3), confirmed via
            // real PageSpeed Insights flagging oversized downloads.
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {!destination.isLaunchDestination && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
            Coming Soon
          </span>
        )}
        <WishlistButton id={destination.id} label={destination.countryName} />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {destination.flagEmoji} {destination.countryName}
        </h3>
        <p className="mt-2 text-sm text-foreground/70">{destination.shortDescription}</p>
      </div>
    </Link>
  );
}
