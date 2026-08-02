"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { countryCodeForName, generateBookingReference } from "@/lib/country-codes";
import { generateSuggestedItinerary } from "@/lib/admin/trip-planner-engine";

// Returns a draft only -- doesn't persist it. Staff review/edit the result
// in the textarea and hit "Save Edits" (saveTripPlannerItinerary below) to
// actually write it, same as if they'd typed it by hand.
export async function generateTripPlannerDraft(requestId: string): Promise<string> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: request, error } = await supabase
    .from("trip_planner_requests")
    .select("destination, days, travelers, travel_style, luxury_level, budget_usd")
    .eq("id", requestId)
    .maybeSingle();
  if (error || !request) throw new Error(error?.message ?? "Trip planner request not found.");

  return generateSuggestedItinerary({
    destination: request.destination ?? "",
    days: Number(request.days ?? 0),
    travelers: Number(request.travelers ?? 0),
    travelStyle: request.travel_style ?? "",
    luxuryLevel: request.luxury_level ?? "",
    budgetUsd: Number(request.budget_usd ?? 0),
  });
}

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
// by email, opens a booking in 'inquiry' status (no tour/journey attached,
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

  // No specific tour/journey is referenced (the trip is bespoke), but the
  // request's free-text destination often names a real country -- use its
  // code when it matches, otherwise fall back to the generic "XX-" prefix.
  const bookingReference = generateBookingReference(countryCodeForName(request.destination));
  const specialRequests = [
    `Converted from trip planner request: ${request.destination ?? "custom trip"}, ${request.days ?? "?"} day(s), style: ${request.travel_style ?? "-"}${request.luxury_level ? ` (${request.luxury_level})` : ""}.`,
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
