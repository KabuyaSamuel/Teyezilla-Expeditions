import type { Tables } from "@/types/database";

export interface TripPlannerRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  budgetUsd: number;
  days: number;
  travelers: number;
  travelStyle: string;
  luxuryLevel: string;
  aiSuggestedItinerary: string;
  status: "new" | "reviewed" | "quoted" | "converted";
  createdAt: string;
}

export function mapTripPlannerRequestRow(row: Tables<"trip_planner_requests">): TripPlannerRequest {
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
    status: row.status as TripPlannerRequest["status"],
    createdAt: row.created_at ?? "",
  };
}
