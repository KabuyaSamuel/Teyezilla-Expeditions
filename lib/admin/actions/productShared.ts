// Shared write-side sync helpers for the product-enrichment tables. Not a
// "use server" file itself; imported by lib/admin/actions/tours.ts and
// lib/admin/actions/journeys.ts, which are. Generic over table name / parent
// FK column since tour_X and journey_X tables are otherwise column-identical.

type SupabaseLike = {
  from: (table: string) => any;
};

export interface PricingTierInput {
  tierName: string;
  tagline: string;
  price: number;
  currency: string;
  accommodationSummary: string;
  features: string[];
  ctaLabel: string;
}

export interface HighlightInput {
  title: string;
  description: string;
}

export interface FaqInput {
  question: string;
  answer: string;
}

export interface AddonInput {
  kind: "addon" | "extension";
  title: string;
  description: string;
  price: number | null;
  currency: string;
  extraDaysMin: number | null;
  extraDaysMax: number | null;
  ctaLabel: string;
}

export interface ProductScalarsInput {
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

export function productScalarsToRow(input: ProductScalarsInput) {
  return {
    product_type: input.productType,
    min_guests: input.minGuests,
    max_guests: input.maxGuests,
    fitness_level: input.fitnessLevel,
    best_for: input.bestFor,
    languages: input.languages,
    transportation: input.transportation,
    guide_info: input.guideInfo,
    food_and_drinks: input.foodAndDrinks,
    important_info: input.importantInfo,
    bring_list: input.bringList,
    cancellation_policy: input.cancellationPolicy,
    availability_note: input.availabilityNote,
    teyezilla_moment: input.teyezillaMoment,
  };
}

export async function syncPricingTiers(
  supabase: SupabaseLike,
  table: "tour_pricing_tiers" | "journey_pricing_tiers",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  tiers: PricingTierInput[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (tiers.length === 0) return;

  const { error } = await supabase.from(table).insert(
    tiers.map((t, i) => ({
      [parentColumn]: parentId,
      tier_name: t.tierName,
      tagline: t.tagline,
      price: t.price,
      currency: t.currency,
      accommodation_summary: t.accommodationSummary,
      features: t.features,
      cta_label: t.ctaLabel,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncHighlights(
  supabase: SupabaseLike,
  table: "tour_highlights" | "journey_highlights",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  highlights: HighlightInput[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (highlights.length === 0) return;

  const { error } = await supabase.from(table).insert(
    highlights.map((h, i) => ({
      [parentColumn]: parentId,
      title: h.title,
      description: h.description,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncFaqs(
  supabase: SupabaseLike,
  table: "tour_faqs" | "journey_faqs",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  faqs: FaqInput[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (faqs.length === 0) return;

  const { error } = await supabase.from(table).insert(
    faqs.map((f, i) => ({
      [parentColumn]: parentId,
      question: f.question,
      answer: f.answer,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncAddons(
  supabase: SupabaseLike,
  table: "tour_addons" | "journey_addons",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  addons: AddonInput[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (addons.length === 0) return;

  const { error } = await supabase.from(table).insert(
    addons.map((a, i) => ({
      [parentColumn]: parentId,
      kind: a.kind,
      title: a.title,
      description: a.description,
      price: a.price,
      currency: a.currency,
      extra_days_min: a.extraDaysMin,
      extra_days_max: a.extraDaysMax,
      cta_label: a.ctaLabel,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncActivities(
  supabase: SupabaseLike,
  table: "tour_activities" | "journey_activities",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  activityIds: string[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (activityIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    activityIds.map((activityId, i) => ({
      [parentColumn]: parentId,
      activity_id: activityId,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncVehicles(
  supabase: SupabaseLike,
  table: "tour_vehicles" | "journey_vehicles",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  vehicleIds: string[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (vehicleIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    vehicleIds.map((vehicleId, i) => ({
      [parentColumn]: parentId,
      vehicle_id: vehicleId,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncAccommodations(
  supabase: SupabaseLike,
  table: "tour_accommodations" | "journey_accommodations",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  accommodationIds: string[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (accommodationIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    accommodationIds.map((accommodationId, i) => ({
      [parentColumn]: parentId,
      accommodation_id: accommodationId,
      display_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

export async function syncExperienceTypes(
  supabase: SupabaseLike,
  table: "tour_experience_types" | "journey_experience_types",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  experienceTypeIds: string[]
) {
  await supabase.from(table).delete().eq(parentColumn, parentId);
  if (experienceTypeIds.length === 0) return;

  const { error } = await supabase.from(table).insert(
    experienceTypeIds.map((experienceTypeId) => ({
      [parentColumn]: parentId,
      experience_type_id: experienceTypeId,
    }))
  );
  if (error) throw new Error(error.message);
}
