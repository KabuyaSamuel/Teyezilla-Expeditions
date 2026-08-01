import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  pointsDelta: number;
  reason: string;
  bookingId?: string;
  bookingReference?: string;
  createdByName?: string;
  createdAt: string;
}

function mapRow(row: Record<string, any>): LoyaltyTransaction {
  return {
    id: row.id,
    customerId: row.customer_id,
    pointsDelta: Number(row.points_delta ?? 0),
    reason: row.reason,
    bookingId: row.booking_id ?? undefined,
    bookingReference: row.booking?.booking_reference ?? undefined,
    createdByName: row.staff?.full_name ?? undefined,
    createdAt: row.created_at,
  };
}

const SELECT = "*, booking:bookings(booking_reference), staff:staff(full_name)";

export async function getLoyaltyTransactions(customerId: string): Promise<LoyaltyTransaction[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("loyalty_transactions")
    .select(SELECT)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[loyalty] transactions query failed:", error?.message);
    return [];
  }
  return data.map(mapRow);
}

// Guards against double-awarding accrual points if a booking is toggled
// paid -> unpaid -> paid: accrual transactions are always a positive delta
// tied to a specific booking_id, so a prior positive-delta row for the same
// booking means it was already credited.
export async function hasAccruedForBooking(bookingId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("loyalty_transactions")
    .select("id")
    .eq("booking_id", bookingId)
    .gt("points_delta", 0)
    .limit(1);

  if (error) {
    console.warn("[loyalty] accrual check failed:", error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

export interface LoyaltySummary {
  totalOutstanding: number;
  earnedLast30Days: number;
  redeemedLast30Days: number;
  topCustomers: { id: string; name: string; balance: number }[];
}

export async function getLoyaltySummary(): Promise<LoyaltySummary> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { totalOutstanding: 0, earnedLast30Days: 0, redeemedLast30Days: 0, topCustomers: [] };
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [customersRes, recentRes] = await Promise.all([
    supabase.from("customers").select("id, full_name, loyalty_points").order("loyalty_points", { ascending: false }).limit(10),
    supabase.from("loyalty_transactions").select("points_delta").gte("created_at", thirtyDaysAgo),
  ]);

  const { data: allCustomers } = await supabase.from("customers").select("loyalty_points");
  const totalOutstanding = (allCustomers ?? []).reduce((s: number, c: any) => s + Number(c.loyalty_points ?? 0), 0);

  const recentDeltas = (recentRes.data ?? []) as { points_delta: number }[];
  const earnedLast30Days = recentDeltas.filter((t) => t.points_delta > 0).reduce((s, t) => s + t.points_delta, 0);
  const redeemedLast30Days = recentDeltas.filter((t) => t.points_delta < 0).reduce((s, t) => s + Math.abs(t.points_delta), 0);

  const topCustomers = ((customersRes.data ?? []) as any[])
    .filter((c) => c.loyalty_points > 0)
    .map((c) => ({ id: c.id, name: c.full_name, balance: Number(c.loyalty_points) }));

  return { totalOutstanding, earnedLast30Days, redeemedLast30Days, topCustomers };
}
