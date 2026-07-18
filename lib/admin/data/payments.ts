import { getSupabaseServerClient } from "@/lib/supabase/server";
import { seedPayments, type Payment, type PaymentProvider } from "./payments.seed";

export type { Payment, PaymentProvider };

function mapRow(row: Record<string, any>): Payment {
  return {
    id: row.id,
    bookingReference: row.booking?.booking_reference ?? row.booking_id,
    provider: row.provider,
    providerReference: row.provider_reference ?? "",
    amount: Number(row.amount ?? 0),
    currency: row.currency ?? "USD",
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getPayments(): Promise<Payment[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return seedPayments;

  const { data, error } = await supabase
    .from("payments")
    .select("*, booking:bookings(booking_reference)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[payments] Supabase query failed, using seed data:", error?.message);
    return seedPayments;
  }

  return data.map(mapRow);
}
