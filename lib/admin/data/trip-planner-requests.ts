import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedTripPlannerRequests, type TripPlannerRequest } from "./trip-planner-requests.seed";

export type { TripPlannerRequest };

function mapRow(row: Record<string, any>): TripPlannerRequest {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    destination: row.destination ?? "",
    budgetUsd: Number(row.budget_usd ?? 0),
    days: Number(row.days ?? 0),
    travelers: Number(row.travelers ?? 0),
    travelStyle: row.travel_style ?? "",
    luxuryLevel: row.luxury_level ?? "",
    aiSuggestedItinerary: row.ai_suggested_itinerary ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getTripPlannerRequests(): Promise<TripPlannerRequest[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedTripPlannerRequests;

  const { data, error } = await supabase
    .from("trip_planner_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[trip-planner] Supabase query failed, using seed data:", error?.message);
    return seedTripPlannerRequests;
  }

  return data.map(mapRow);
}
