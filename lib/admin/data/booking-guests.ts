import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface BookingGuest {
  id: string;
  fullName: string;
  ageGroup: "adult" | "child";
  dietaryRequirements: string;
  passportNumber: string;
  nationality: string;
}

function mapRow(row: Record<string, any>): BookingGuest {
  return {
    id: row.id,
    fullName: row.full_name ?? "",
    ageGroup: row.age_group ?? "adult",
    dietaryRequirements: row.dietary_requirements ?? "",
    passportNumber: row.passport_number ?? "",
    nationality: row.nationality ?? "",
  };
}

export async function getBookingGuests(bookingId: string): Promise<BookingGuest[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("booking_guests")
    .select("*")
    .eq("booking_id", bookingId)
    .order("display_order");

  if (error || !data) {
    console.warn("[admin/booking-guests] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}
