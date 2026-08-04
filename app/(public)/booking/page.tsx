import type { Metadata } from "next";
import BookingEnquiryForm, { type ProductOption } from "@/components/BookingEnquiryForm";
import { getTours, getTourBySlug } from "@/lib/tours";
import { getJourneys, getJourneyBySlug } from "@/lib/journeys";
import { getBookableAddonsBySlug } from "@/lib/productShared";
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
  /** Set when the visitor arrived via a specific pricing tier's "Enquire" link. */
  tierId?: string;
}

// Swaps in the selected pricing tier's price/currency in place of the
// product's default priceFrom -- arrives as ?tier=<tierId> from
// ProductPricingTiers' per-tier CTA links. tierId is kept on the result so
// the form can carry it through to the server action, which re-verifies the
// price server-side.
function applyTierOverride<T extends { pricingTiers: { id: string; tierName: string; price: number; currency: string }[] }>(
  product: SummaryProduct,
  detail: T,
  tierId: string | undefined
): SummaryProduct {
  if (!tierId) return product;
  const tier = detail.pricingTiers.find((t) => t.id === tierId);
  if (!tier) return product;
  return { ...product, priceFrom: tier.price, currency: tier.currency, tierId: tier.id };
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string; journey?: string; tier?: string; addon?: string }>;
}) {
  const { tour: tourSlug, journey: journeySlug, tier: tierId, addon: addonId } = await searchParams;

  let product: SummaryProduct | undefined;
  // The starting-from price, unaffected by any tier override -- used as the
  // booking form's baseline so switching tiers there always has a true
  // "from" price to fall back to.
  let basePriceFrom: number | undefined;
  let pricingTiers: { id: string; tierName: string; price: number; currency: string }[] = [];
  if (tourSlug) {
    const tour = await getTourBySlug(tourSlug);
    if (tour) {
      product = applyTierOverride(
        {
          title: tour.title,
          heroImage: tour.heroImage,
          durationDays: tour.durationDays,
          priceFrom: tour.priceFrom,
          currency: tour.currency,
          slug: tour.slug,
          kind: "tour",
        },
        tour,
        tierId
      );
      basePriceFrom = tour.priceFrom;
      pricingTiers = tour.pricingTiers;
    }
  } else if (journeySlug) {
    const journey = await getJourneyBySlug(journeySlug);
    if (journey) {
      product = applyTierOverride(
        {
          title: journey.title,
          heroImage: journey.heroImage,
          durationDays: journey.durationDays,
          priceFrom: journey.priceFrom,
          currency: journey.currency,
          slug: journey.slug,
          kind: "journey",
        },
        journey,
        tierId
      );
      basePriceFrom = journey.priceFrom;
      pricingTiers = journey.pricingTiers;
    }
  }

  const addonsBySlug = await getBookableAddonsBySlug();

  // No (or unrecognized) pre-fill: offer the full published catalogue.
  let options: ProductOption[] = [];
  if (!product) {
    const [tours, journeys] = await Promise.all([getTours(), getJourneys()]);
    options = [
      ...tours
        .filter((t) => t.status === "published")
        .map((t): ProductOption => ({
          slug: t.slug,
          title: t.title,
          kind: "tour",
          priceFrom: t.priceFrom,
          currency: t.currency,
          addons: addonsBySlug[t.slug] ?? [],
        })),
      ...journeys.map((j): ProductOption => ({
        slug: j.slug,
        title: j.title,
        kind: "journey",
        priceFrom: j.priceFrom,
        currency: j.currency,
        addons: addonsBySlug[j.slug] ?? [],
      })),
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

      <BookingEnquiryForm
        preselected={
          product
            ? {
                slug: product.slug,
                title: product.title,
                kind: product.kind,
                priceFrom: basePriceFrom ?? product.priceFrom,
                currency: product.currency,
                addons: addonsBySlug[product.slug] ?? [],
                pricingTiers: pricingTiers,
                tierId: product.tierId,
                heroImage: product.heroImage,
                durationDays: product.durationDays,
              }
            : undefined
        }
        preselectedAddonId={addonId}
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
