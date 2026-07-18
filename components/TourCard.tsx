import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/types";

export default function TourCard({ tour }: { tour: Tour }) {
  const whatsappHref = `https://wa.me/254700000000?text=${encodeURIComponent(
    `Hi! I'm interested in the "${tour.title}" tour. Could you share more details?`
  )}`;

  return (
    <div className="card group overflow-hidden">
      <Link href={`/tours/${tour.slug}`} className="block">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
          />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
            {tour.categoryLabel}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground hover:text-primary">
            {tour.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-foreground/70">{tour.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
          <span>{tour.durationDays} day{tour.durationDays > 1 ? "s" : ""}</span>
          <span className="font-heading font-semibold text-accent">
            From {tour.currency} {tour.priceFrom}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/booking?tour=${tour.slug}`} className="btn-primary flex-1 px-3 py-2 text-sm">
            Book Now
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 px-3 py-2 text-sm"
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}
