import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AvailabilityDate {
  id: string;
  date: string;
  capacity: number;
  bookedCount: number;
}

function mapRow(row: Record<string, any>): AvailabilityDate {
  return {
    id: row.id,
    date: row.date,
    capacity: Number(row.capacity ?? 0),
    bookedCount: Number(row.booked_count ?? 0),
  };
}

async function getAvailability(
  table: "tour_availability" | "journey_availability",
  parentColumn: "tour_id" | "journey_id",
  parentId: string
): Promise<AvailabilityDate[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(parentColumn, parentId)
    .order("date");

  if (error || !data) {
    console.warn(`[admin/availability] ${table} query failed:`, error?.message);
    return [];
  }

  return data.map(mapRow);
}

export function getTourAvailability(tourId: string) {
  return getAvailability("tour_availability", "tour_id", tourId);
}

export function getJourneyAvailability(journeyId: string) {
  return getAvailability("journey_availability", "journey_id", journeyId);
}
