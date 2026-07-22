import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  travelerCount: number;
  totalAmount: number;
  depositAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

// Joins customers and tours to get display names, since the `bookings`
// table only stores foreign keys.
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
  if (!supabase) {
    console.warn("[bookings] Supabase not configured, returning no bookings.");
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, customer:customers(full_name), tour:tours(title, slug)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[bookings] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    console.warn("[bookings] Supabase not configured, returning no booking.");
    return undefined;
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, customer:customers(full_name), tour:tours(title, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[bookings] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
