import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PaymentStatus = "unpaid" | "deposit_received" | "paid";
export type BookingStatus = "inquiry" | "quoted" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  tourSlug: string;
  tourTitle: string;
  journeySlug: string;
  journeyTitle: string;
  /** The tour or journey the enquiry is about (whichever is linked). */
  productTitle: string;
  travelDate: string | null;
  flexibleDates: boolean;
  travelerCount: number;
  adults: number | null;
  children: number;
  childrenAges: string;
  budgetRange: string;
  specialRequests: string;
  referralSource: string;
  countryOfResidence: string;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

const SELECT = "*, customer:customers(full_name, email), tour:tours(title, slug), journey:journeys(title, slug)";

// Joins customers, tours, and journeys to get display names, since the
// `bookings` table only stores foreign keys.
function mapRow(row: Record<string, any>): Booking {
  const tourTitle = row.tour?.title ?? "";
  const journeyTitle = row.journey?.title ?? "";
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerId: row.customer_id,
    customerName: row.customer?.full_name ?? "Unknown Customer",
    customerEmail: row.customer?.email ?? "",
    tourSlug: row.tour?.slug ?? "",
    tourTitle,
    journeySlug: row.journey?.slug ?? "",
    journeyTitle,
    productTitle: tourTitle || journeyTitle || "Unknown Tour",
    travelDate: row.travel_date ?? null,
    flexibleDates: Boolean(row.flexible_dates),
    travelerCount: Number(row.traveler_count ?? 0),
    adults: row.adults == null ? null : Number(row.adults),
    children: Number(row.children ?? 0),
    childrenAges: row.children_ages ?? "",
    budgetRange: row.budget_range ?? "",
    specialRequests: row.special_requests ?? "",
    referralSource: row.referral_source ?? "",
    countryOfResidence: row.country_of_residence ?? "",
    totalAmount: Number(row.total_amount ?? 0),
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
    .select(SELECT)
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
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[bookings] Supabase query failed:", error.message);
    return undefined;
  }

  return mapRow(data);
}
