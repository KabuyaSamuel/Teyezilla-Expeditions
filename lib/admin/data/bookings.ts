import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedBookings, type Booking, type PaymentStatus, type BookingStatus } from "./bookings.seed";

export type { Booking, PaymentStatus, BookingStatus };

// Real bookings data layer. Joins customers and tours to get display names,
// since the `bookings` table only stores foreign keys. Falls back to seed
// data when Supabase isn't configured — see lib/destinations.ts for the
// reasoning behind this pattern, used consistently across the admin data layer.

function mapRow(row: Record<string, any>): Booking {
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerId: row.customer_id,
    customerName: row.customer?.full_name ?? "Unknown Customer",
    tourSlug: row.tour?.slug ?? "",
    tourTitle: row.tour?.title ?? "Unknown Tour",
    travelDate: row.travel_date,
    travelerCount: row.traveler_count,
    totalAmount: Number(row.total_amount ?? 0),
    depositAmount: Number(row.deposit_amount ?? 0),
    currency: row.currency ?? "USD",
    paymentStatus: row.payment_status,
    bookingStatus: row.booking_status,
    createdAt: row.created_at,
  };
}

export async function getBookings(): Promise<Booking[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedBookings;

  const { data, error } = await supabase
    .from("bookings")
    .select("*, customer:customers(full_name), tour:tours(title, slug)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[bookings] Supabase query failed, using seed data:", error?.message);
    return seedBookings;
  }

  return data.map(mapRow);
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedBookings.find((b) => b.id === id);

  const { data, error } = await supabase
    .from("bookings")
    .select("*, customer:customers(full_name), tour:tours(title, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[bookings] Supabase query failed, using seed data:", error.message);
    return seedBookings.find((b) => b.id === id);
  }

  return mapRow(data);
}
