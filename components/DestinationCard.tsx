import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/types";
import WishlistButton from "./WishlistButton";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={destination.heroImage}
          alt={`${destination.countryName} travel and safari tours`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
        />
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
