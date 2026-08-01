"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface BookingGuestInput {
  fullName: string;
  ageGroup: "adult" | "child";
  dietaryRequirements: string;
  passportNumber: string;
  nationality: string;
}

// Guests are added one at a time by staff once an inquiry is confirmed (not
// part of the public enquiry form), so this is a simple add/remove list
// rather than the delete-then-reinsert array sync used for form-owned
// relations elsewhere -- there's no bulk "form" here to diff against.
export async function addBookingGuest(bookingId: string, input: BookingGuestInput): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { count } = await supabase
    .from("booking_guests")
    .select("id", { count: "exact", head: true })
    .eq("booking_id", bookingId);

  const { error } = await supabase.from("booking_guests").insert({
    booking_id: bookingId,
    full_name: input.fullName,
    age_group: input.ageGroup,
    dietary_requirements: input.dietaryRequirements,
    passport_number: input.passportNumber,
    nationality: input.nationality,
    display_order: count ?? 0,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function removeBookingGuest(bookingId: string, guestId: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("booking_guests").delete().eq("id", guestId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bookings/${bookingId}`);
}
