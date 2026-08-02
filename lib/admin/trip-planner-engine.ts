import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface TripPlannerDraftInput {
  destination: string;
  days: number;
  travelers: number;
  travelStyle: string;
  luxuryLevel: string;
  budgetUsd: number;
}

// Free-text luxury_level values seen from the public form ("Mid-range",
// "Boutique", ...) don't line up 1:1 with the accommodations.tier enum
// ('Budget' | 'Mid-Range' | 'Luxury') -- this maps the common ones so the
// engine can still prefer a matching tier. Anything unrecognized just
// skips the tier filter rather than guessing wrong.
const LUXURY_TIER_MAP: Record<string, "Budget" | "Mid-Range" | "Luxury"> = {
  budget: "Budget",
  "mid-range": "Mid-Range",
  midrange: "Mid-Range",
  boutique: "Mid-Range",
  luxury: "Luxury",
  premium: "Luxury",
};

function normalizeTier(luxuryLevel: string): "Budget" | "Mid-Range" | "Luxury" | null {
  return LUXURY_TIER_MAP[luxuryLevel.trim().toLowerCase()] ?? null;
}

// The public trip planner form takes destination as free text, so
// multi-country requests ("Kenya + Zanzibar", "Morocco and Egypt") need
// splitting into individual country names before they can be matched
// against the destinations table.
function splitDestinationTokens(destination: string): string[] {
  return destination
    .split(/[,+&/]| and | with /i)
    .map((token) => token.trim())
    .filter(Boolean);
}

interface MatchedDestination {
  id: string;
  countryName: string;
}

// Builds a day-by-day draft itinerary from real catalog data (published
// tours + accommodations for each matched destination) rather than
// calling an AI provider -- see README "Roadmap" for why: no paid LLM
// budget, and this fills the same gap (a real starting draft instead of a
// blank page) at zero ongoing cost. The seam is deliberately narrow --
// swapping this out for a real LLM call later only means changing this
// one function, not any of its callers.
export async function generateSuggestedItinerary(input: TripPlannerDraftInput): Promise<string> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return "Draft generation needs a connected database -- write the itinerary manually for now.";
  }

  const { data: allDestinations, error: destinationsError } = await supabase
    .from("destinations")
    .select("id, country_name");
  if (destinationsError || !allDestinations) {
    return "Couldn't load destinations to build a draft -- write the itinerary manually for now.";
  }

  const tokens = input.destination ? splitDestinationTokens(input.destination) : [];
  const matched: MatchedDestination[] = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    const found = allDestinations.find(
      (d) => d.country_name.toLowerCase().includes(lower) || lower.includes(d.country_name.toLowerCase())
    );
    if (found && !matched.some((m) => m.id === found.id)) {
      matched.push({ id: found.id, countryName: found.country_name });
    }
  }

  if (matched.length === 0) {
    return `Couldn't match "${input.destination || "the requested destination"}" to a destination in the catalog -- write this one manually.`;
  }

  const totalDays = input.days > 0 ? input.days : 7;
  const daysPerDestination = Math.max(2, Math.floor(totalDays / matched.length));
  const tier = normalizeTier(input.luxuryLevel);

  const sections: string[] = [];
  let dayCounter = 1;

  for (const [index, destination] of matched.entries()) {
    const isLast = index === matched.length - 1;
    const daysHere = isLast ? totalDays - dayCounter + 1 : daysPerDestination;
    if (daysHere < 1) break;

    const { data: tours } = await supabase
      .from("tours")
      .select("title, short_description, duration_days")
      .eq("destination_id", destination.id)
      .eq("status", "published")
      .order("duration_days", { ascending: false });

    const bestFit = (tours ?? []).find((t) => (t.duration_days ?? 0) > 0 && (t.duration_days ?? 0) <= daysHere);
    const tour = bestFit ?? (tours ?? [])[0];

    let accommodationQuery = supabase
      .from("accommodations")
      .select("name")
      .eq("destination_id", destination.id)
      .eq("status", "published");
    if (tier) accommodationQuery = accommodationQuery.eq("tier", tier);
    const { data: accommodations } = await accommodationQuery.limit(1);
    const accommodation = (accommodations ?? [])[0];

    const dayRange = daysHere === 1 ? `Day ${dayCounter}` : `Day ${dayCounter}-${dayCounter + daysHere - 1}`;
    const activity = tour
      ? `${tour.title}${tour.short_description ? ` -- ${tour.short_description}` : ""}`
      : `Explore ${destination.countryName}`;
    const stay = accommodation ? `, staying at ${accommodation.name}` : "";

    sections.push(`${dayRange}: ${activity} in ${destination.countryName}${stay}.`);
    dayCounter += daysHere;
  }

  if (sections.length === 0) {
    return `No published tours found for ${matched.map((m) => m.countryName).join(", ")} yet -- write this one manually.`;
  }

  const styleNote = input.travelStyle ? ` (${input.travelStyle.toLowerCase()} style)` : "";
  const header = `${totalDays}-day trip across ${matched.map((m) => m.countryName).join(", ")}${styleNote} for ${input.travelers || 1} traveler(s):`;
  const budgetNote = input.budgetUsd > 0 ? ` Stated budget: $${input.budgetUsd.toLocaleString()}.` : "";
  const disclaimer = " Draft generated from current catalog data -- review and adjust before sending to the customer.";

  return `${header} ${sections.join(" ")}${budgetNote}${disclaimer}`;
}
