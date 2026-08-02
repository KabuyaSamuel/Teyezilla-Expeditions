import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

type DepartureRow = Pick<
  Tables<"bookings">,
  "id" | "booking_reference" | "travel_date" | "adults" | "children" | "booking_status" |
  "assigned_guide_id" | "assigned_driver_id" | "assigned_vehicle_id"
> & {
  tour: Pick<Tables<"tours">, "title"> | null;
  journey: Pick<Tables<"journeys">, "title"> | null;
};

export interface Departure {
  id: string;
  bookingReference: string;
  productTitle: string;
  travelDate: string | null;
  travelerCount: number;
  bookingStatus: string;
  assignedGuideId: string | null;
  assignedDriverId: string | null;
  assignedVehicleId: string | null;
}

const SELECT =
  "id, booking_reference, travel_date, adults, children, booking_status, " +
  "assigned_guide_id, assigned_driver_id, assigned_vehicle_id, " +
  "tour:tours(title), journey:journeys(title)";

function mapRow(row: DepartureRow): Departure {
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    productTitle: row.tour?.title ?? row.journey?.title ?? "Unknown Product",
    travelDate: row.travel_date ?? null,
    travelerCount: Number(row.adults ?? 0) + Number(row.children ?? 0),
    bookingStatus: row.booking_status ?? "",
    assignedGuideId: row.assigned_guide_id ?? null,
    assignedDriverId: row.assigned_driver_id ?? null,
    assignedVehicleId: row.assigned_vehicle_id ?? null,
  };
}

// Operations only cares about departures that are actually happening --
// confirmed (or completed, for record-keeping) bookings with a real travel
// date, not every inquiry in the funnel.
export async function getUpcomingDepartures(): Promise<Departure[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[admin/operations] Supabase not configured, returning no departures.");
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(SELECT)
    .in("booking_status", ["confirmed", "completed"])
    .not("travel_date", "is", null)
    .order("travel_date", { ascending: true });

  if (error || !data) {
    console.warn("[admin/operations] Supabase query failed:", error?.message);
    return [];
  }

  // Same array-vs-single-object inference gap as elsewhere -- see
  // lib/admin/data/inquiries.ts's comment on InquiryRow.
  return (data as unknown as DepartureRow[]).map(mapRow);
}
