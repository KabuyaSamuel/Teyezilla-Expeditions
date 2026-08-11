"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Individual add/remove actions rather than the delete-then-reinsert array
// sync used for pricing tiers/highlights/etc elsewhere in this codebase --
// availability rows carry booked_count, which reflects real confirmed
// bookings and must never be silently wiped by an unrelated form save.

async function addDate(
  table: "tour_availability" | "journey_availability",
  parentColumn: "tour_id" | "journey_id",
  parentId: string,
  date: string,
  capacity: number,
  revalidatePathTarget: string
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from(table).insert({ [parentColumn]: parentId, date, capacity });
  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

async function removeDate(
  table: "tour_availability" | "journey_availability",
  revalidatePathTarget: string,
  id: string
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { data: row } = await supabase.from(table).select("booked_count").eq("id", id).maybeSingle();
  if (row && Number(row.booked_count ?? 0) > 0) {
    throw new Error(
      `Can't remove this date -- it has ${row.booked_count} confirmed booking${row.booked_count === 1 ? "" : "s"} attached.`
    );
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function addTourAvailabilityDate(tourId: string, tourSlug: string, date: string, capacity: number) {
  await addDate("tour_availability", "tour_id", tourId, date, capacity, `/admin/tours/${tourSlug}`);
}

// tourSlug is bound (fixed) by the caller via .bind(), leaving only `id` as
// the free argument the AvailabilityCalendar client component supplies.
export async function removeTourAvailabilityDate(tourSlug: string, id: string) {
  await removeDate("tour_availability", `/admin/tours/${tourSlug}`, id);
}

export async function addJourneyAvailabilityDate(journeyId: string, journeySlug: string, date: string, capacity: number) {
  await addDate("journey_availability", "journey_id", journeyId, date, capacity, `/admin/journeys/${journeySlug}`);
}

export async function removeJourneyAvailabilityDate(journeySlug: string, id: string) {
  await removeDate("journey_availability", `/admin/journeys/${journeySlug}`, id);
}
