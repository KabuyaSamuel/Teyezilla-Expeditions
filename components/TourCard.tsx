import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/types";
import { formatTourDuration } from "@/lib/duration";
import WishlistButton from "./WishlistButton";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="card group flex h-full flex-col overflow-hidden">
      <Link href={`/tours/${tour.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-secondary/10">
          {tour.heroImage && (
            <Image
              src={tour.heroImage}
              alt={tour.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={70}
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
            />
          )}
          {tour.categoryLabel && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              {tour.categoryLabel}
            </span>
          )}
          <WishlistButton id={tour.id} label={tour.title} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground hover:text-primary">
            {tour.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-foreground/70">{tour.tagline || tour.shortDescription}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <span>{formatTourDuration(tour)}</span>
            <span className="font-heading font-semibold text-accent-ink">
              From {tour.currency} {tour.priceFrom}
            </span>
          </div>
          <Link href={`/tours/${tour.slug}`} className="btn-primary mt-4 block w-full px-3 py-2 text-center text-sm">
            Explore More
          </Link>
        </div>
      </div>
    </div>
  );
}
