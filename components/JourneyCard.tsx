import Link from "next/link";
import Image from "next/image";
import type { Journey } from "@/lib/journeys";
import { WHATSAPP_NUMBER } from "@/lib/enquiry-shared";

export default function JourneyCard({ journey }: { journey: Journey }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the "${journey.title}" journey. Could you share more details?`
  )}`;
  const destinationNames = journey.destinations.map((d) => d.countryName).join(" · ");

  return (
    <div className="card group overflow-hidden">
      <Link href={`/journeys/${journey.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-secondary/10">
          {journey.heroImage && (
            <Image
              src={journey.heroImage}
              alt={journey.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
            />
          )}
          {destinationNames && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              {destinationNames}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/journeys/${journey.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground hover:text-primary">
            {journey.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-foreground/70">{journey.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
          <span>{journey.durationDays} day{journey.durationDays !== 1 ? "s" : ""}</span>
          <span className="font-heading font-semibold text-accent">
            From {journey.currency} {journey.priceFrom.toLocaleString()}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/journeys/${journey.slug}`} className="btn-primary flex-1 px-3 py-2 text-sm">
            View Journey
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 px-3 py-2 text-sm"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
