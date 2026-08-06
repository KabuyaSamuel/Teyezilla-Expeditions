import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

// supabase-js can't tell customer_id/tour_id/journey_id are to-one FKs
// without a Database-parameterized client (deliberately not used here,
// see lib/supabase/server.ts) -- cast to the real single-object runtime
// shape for those three. journey_destinations is a genuine to-many join
// (one journey, many legs), so it stays an array as inferred.
type BookingRow = Tables<"bookings"> & {
  customer: Pick<Tables<"customers">, "full_name" | "email"> | null;
  tour:
    | (Pick<Tables<"tours">, "title" | "slug"> & {
        destinations: Pick<Tables<"destinations">, "country_name"> | null;
      })
    | null;
  journey:
    | (Pick<Tables<"journeys">, "title" | "slug"> & {
        journey_destinations: Array<
          Pick<Tables<"journey_destinations">, "is_primary" | "display_order"> & {
            destinations: Pick<Tables<"destinations">, "country_name"> | null;
          }
        >;
      })
    | null;
  booking_addons: Pick<Tables<"booking_addons">, "title" | "price" | "currency">[];
};

export type PaymentStatus = "unpaid" | "deposit_received" | "paid";
export type BookingStatus = "inquiry" | "quoted" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  tourId: string | null;
  tourSlug: string;
  tourTitle: string;
  journeyId: string | null;
  journeySlug: string;
  journeyTitle: string;
  /** The tour or journey the enquiry is about (whichever is linked). */
  productTitle: string;
  productType: "tour" | "journey" | "";
  /**
   * The destination this booking's revenue is attributed to for reporting.
   * Tours: their own destination. Journeys: the primary (first) leg's
   * destination — see the comment on the reports revenue split for why.
   */
  destinationName: string;
  travelDate: string | null;
  flexibleDates: boolean;
  travelerCount: number;
  adults: number | null;
  children: number;
  childrenAges: string;
  budgetRange: string;
  specialRequests: string;
  referralSource: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  countryOfResidence: string;
  totalAmount: number;
  basePrice: number;
  addonsTotal: number;
  addons: { title: string; price: number; currency: string }[];
  currency: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

const SELECT =
  "*, customer:customers(full_name, email), " +
  "tour:tours(title, slug, destinations(country_name)), " +
  "journey:journeys(title, slug, journey_destinations(is_primary, display_order, destinations(country_name))), " +
  "booking_addons(title, price, currency)";

// Joins customers, tours, and journeys to get display names, since the
// `bookings` table only stores foreign keys.
function mapRow(row: BookingRow): Booking {
  const tourTitle = row.tour?.title ?? "";
  const journeyTitle = row.journey?.title ?? "";
  const productType: Booking["productType"] = row.tour_id ? "tour" : row.journey_id ? "journey" : "";

  let destinationName = "";
  if (productType === "tour") {
    destinationName = row.tour?.destinations?.country_name ?? "";
  } else if (productType === "journey") {
    const legs = row.journey?.journey_destinations ?? [];
    // Attribution rule: full revenue to the primary (first) leg of a
    // multi-country journey, not split across every country it visits.
    // Splitting evenly would understate each destination's real commercial
    // pull on the sales chart; crediting the full amount to every leg would
    // duplicate it and inflate total revenue shown per destination beyond
    // what the journey actually earned. Crediting the primary destination
    // keeps the chart's total consistent with actual revenue while still
    // giving each journey's headline country credit for the sale.
    const primary =
      legs.find((l) => l.is_primary) ??
      [...legs].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0];
    destinationName = primary?.destinations?.country_name ?? "";
  }

  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerId: row.customer_id ?? "",
    customerName: row.customer?.full_name ?? "Unknown Customer",
    customerEmail: row.customer?.email ?? "",
    tourId: row.tour_id ?? null,
    tourSlug: row.tour?.slug ?? "",
    tourTitle,
    journeyId: row.journey_id ?? null,
    journeySlug: row.journey?.slug ?? "",
    journeyTitle,
    productTitle: tourTitle || journeyTitle || "Unknown Tour",
    productType,
    destinationName,
    travelDate: row.travel_date ?? null,
    flexibleDates: Boolean(row.flexible_dates),
    travelerCount: Number(row.traveler_count ?? 0),
    adults: row.adults == null ? null : Number(row.adults),
    children: Number(row.children ?? 0),
    childrenAges: row.children_ages ?? "",
    budgetRange: row.budget_range ?? "",
    specialRequests: row.special_requests ?? "",
    referralSource: row.referral_source ?? "",
    utmSource: row.utm_source ?? "",
    utmMedium: row.utm_medium ?? "",
    utmCampaign: row.utm_campaign ?? "",
    countryOfResidence: row.country_of_residence ?? "",
    totalAmount: Number(row.total_amount ?? 0),
    basePrice: Number(row.base_price ?? 0),
    addonsTotal: Number(row.addons_total ?? 0),
    addons: (row.booking_addons ?? []).map((a) => ({
      title: a.title,
      price: Number(a.price),
      currency: a.currency ?? "USD",
    })),
    currency: row.currency ?? "USD",
    paymentStatus: (row.payment_status ?? "unpaid") as PaymentStatus,
    bookingStatus: (row.booking_status ?? "inquiry") as BookingStatus,
    createdAt: row.created_at ?? "",
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

  // SELECT is a variable, not a literal, so supabase-js can't statically
  // parse it into a typed result -- cast to the real shape explicitly.
  return (data as unknown as BookingRow[]).map(mapRow);
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

  return mapRow(data as unknown as BookingRow);
}
