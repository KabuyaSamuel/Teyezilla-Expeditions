import type { Metadata } from "next";
import Image from "next/image";
import BookingEnquiryForm, { type ProductOption } from "@/components/BookingEnquiryForm";
import { getTours, getTourBySlug } from "@/lib/tours";
import { getJourneys, getJourneyBySlug } from "@/lib/journeys";
import { whatsappLink } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Enquire About Your Trip",
  description:
    "Tell us about your dream African journey, and our travel team replies with a personal quote within 24 hours. No payment is taken online.",
};

interface SummaryProduct {
  title: string;
  heroImage: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  slug: string;
  kind: "tour" | "journey";
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string; journey?: string }>;
}) {
  const { tour: tourSlug, journey: journeySlug } = await searchParams;

  let product: SummaryProduct | undefined;
  if (tourSlug) {
    const tour = await getTourBySlug(tourSlug);
    if (tour) {
      product = {
        title: tour.title,
        heroImage: tour.heroImage,
        durationDays: tour.durationDays,
        priceFrom: tour.priceFrom,
        currency: tour.currency,
        slug: tour.slug,
        kind: "tour",
      };
    }
  } else if (journeySlug) {
    const journey = await getJourneyBySlug(journeySlug);
    if (journey) {
      product = {
        title: journey.title,
        heroImage: journey.heroImage,
        durationDays: journey.durationDays,
        priceFrom: journey.priceFrom,
        currency: journey.currency,
        slug: journey.slug,
        kind: "journey",
      };
    }
  }

  // No (or unrecognized) pre-fill: offer the full published catalogue.
  let options: ProductOption[] = [];
  if (!product) {
    const [tours, journeys] = await Promise.all([getTours(), getJourneys()]);
    options = [
      ...tours
        .filter((t) => t.status === "published")
        .map((t): ProductOption => ({ slug: t.slug, title: t.title, kind: "tour" })),
      ...journeys.map((j): ProductOption => ({ slug: j.slug, title: j.title, kind: "journey" })),
    ];
  }

  return (
    <div className="section max-w-3xl">
      <h1 className="h1-page">
        Enquire About {product ? "This Journey" : "Your Journey"}
      </h1>
      <p className="mt-3 text-foreground/70">
        Share a few details and our travel team will reply within 24 hours with a personal
        quote. No payment is taken online; everything is arranged directly with your consultant.
      </p>

      {product && (
        <div className="card mt-8 flex items-center gap-5 overflow-hidden p-4">
          {product.heroImage && (
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
              <Image src={product.heroImage} alt={product.title} fill sizes="128px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground/50">
              You&apos;re enquiring about
            </p>
            <p className="font-heading text-lg font-semibold text-foreground">{product.title}</p>
            <p className="mt-1 text-sm text-foreground/60">
              {product.durationDays} day{product.durationDays !== 1 ? "s" : ""} · From{" "}
              <span className="font-semibold text-accent">
                {product.currency} {product.priceFrom.toLocaleString()}
              </span>{" "}
              per person
            </p>
          </div>
        </div>
      )}

      <BookingEnquiryForm
        preselected={product ? { slug: product.slug, title: product.title, kind: product.kind } : undefined}
        options={options}
      />

      <div className="mt-8 rounded-2xl bg-secondary/10 p-5 text-center">
        <p className="text-sm text-foreground/70">Prefer to chat right away?</p>
        <a
          href={whatsappLink(
            product
              ? `Hi! I'd like to enquire about "${product.title}".`
              : "Hi! I'd like to plan a trip with Teyezilla Expeditions."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-3 text-sm"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
