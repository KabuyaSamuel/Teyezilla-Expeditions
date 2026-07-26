"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function saveTripPlannerItinerary(requestId: string, itinerary: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase
    .from("trip_planner_requests")
    .update({ ai_suggested_itinerary: itinerary })
    .eq("id", requestId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}

// Creates a booking enquiry from a trip planner request: upserts the customer
// by email, opens a booking in 'inquiry' status (no tour/journey attached —
// the trip is bespoke), and marks the request + inquiry as converted.
export async function convertTripPlannerToBooking(requestId: string, inquiryId: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: request, error: requestError } = await supabase
    .from("trip_planner_requests")
    .select("*")
    .eq("id", requestId)
    .maybeSingle();
  if (requestError || !request) throw new Error(requestError?.message ?? "Trip planner request not found.");

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      { email: request.customer_email, full_name: request.customer_name },
      { onConflict: "email" }
    )
    .select("id")
    .single();
  if (customerError) throw new Error(customerError.message);

  const bookingReference = `TZ-${Math.floor(10000 + Math.random() * 90000)}`;
  const specialRequests = [
    `Converted from trip planner request: ${request.destination ?? "custom trip"}, ${request.days ?? "?"} day(s), style: ${request.travel_style ?? "—"}${request.luxury_level ? ` (${request.luxury_level})` : ""}.`,
    request.budget_usd ? `Stated budget: $${request.budget_usd} USD.` : "",
    request.ai_suggested_itinerary ? `Suggested itinerary:\n${request.ai_suggested_itinerary}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      booking_reference: bookingReference,
      customer_id: customer.id,
      travel_date: null,
      flexible_dates: true,
      traveler_count: request.travelers ?? 1,
      adults: request.travelers ?? 1,
      booking_status: "inquiry",
      payment_status: "unpaid",
      special_requests: specialRequests,
    })
    .select("id")
    .single();
  if (bookingError) throw new Error(bookingError.message);

  await supabase.from("trip_planner_requests").update({ status: "converted" }).eq("id", requestId);
  if (inquiryId) {
    await supabase.from("inquiries").update({ status: "converted" }).eq("id", inquiryId);
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/bookings");
  redirect(`/admin/bookings/${booking.id}`);
}
