// Shared read-side types + row mappers for the product-enrichment tables
// (pricing tiers, highlights, add-ons); tour_X and journey_X tables are
// column-identical apart from their parent FK, so one mapper covers both.
// Used by both the public lib (lib/tours.ts, lib/journeys.ts) and the admin
// data layer (lib/admin/data/tours.ts, lib/admin/data/journeys.ts).

export interface ItineraryDay {
  day: number;
  fromLocation?: string;
  toLocation?: string;
  title: string;
  description: string;
  teyezillaMoment?: string;
  overnight?: string;
  meals?: string[];
}

export interface PricingTier {
  id: string;
  tierName: string;
  tagline: string;
  price: number;
  currency: string;
  accommodationSummary: string;
  features: string[];
  ctaLabel: string;
  displayOrder: number;
}

export interface ProductHighlight {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface ProductAddon {
  id: string;
  kind: "addon" | "extension";
  title: string;
  description: string;
  price: number | null;
  currency: string;
  extraDaysMin: number | null;
  extraDaysMax: number | null;
  ctaLabel: string;
  displayOrder: number;
}

export interface ProductScalars {
  productType: string;
  minGuests: number | null;
  maxGuests: number | null;
  fitnessLevel: string;
  bestFor: string[];
  languages: string[];
  transportation: string;
  guideInfo: string;
  foodAndDrinks: string;
  importantInfo: string;
  bringList: string[];
  cancellationPolicy: string;
  availabilityNote: string;
  teyezillaMoment: string;
}

export function mapPricingTierRow(row: Record<string, any>): PricingTier {
  return {
    id: row.id,
    tierName: row.tier_name,
    tagline: row.tagline ?? "",
    price: Number(row.price ?? 0),
    currency: row.currency ?? "USD",
    accommodationSummary: row.accommodation_summary ?? "",
    features: row.features ?? [],
    ctaLabel: row.cta_label ?? "",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapHighlightRow(row: Record<string, any>): ProductHighlight {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapAddonRow(row: Record<string, any>): ProductAddon {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    description: row.description ?? "",
    price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
    currency: row.currency ?? "USD",
    extraDaysMin: row.extra_days_min ?? null,
    extraDaysMax: row.extra_days_max ?? null,
    ctaLabel: row.cta_label ?? "",
    displayOrder: Number(row.display_order ?? 0),
  };
}

export function mapProductScalars(row: Record<string, any>): ProductScalars {
  return {
    productType: row.product_type ?? "",
    minGuests: row.min_guests ?? null,
    maxGuests: row.max_guests ?? null,
    fitnessLevel: row.fitness_level ?? "",
    bestFor: row.best_for ?? [],
    languages: row.languages ?? [],
    transportation: row.transportation ?? "",
    guideInfo: row.guide_info ?? "",
    foodAndDrinks: row.food_and_drinks ?? "",
    importantInfo: row.important_info ?? "",
    bringList: row.bring_list ?? [],
    cancellationPolicy: row.cancellation_policy ?? "",
    availabilityNote: row.availability_note ?? "",
    teyezillaMoment: row.teyezilla_moment ?? "",
  };
}
