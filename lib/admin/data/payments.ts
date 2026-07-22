import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PaymentProvider = "stripe" | "mpesa" | "paypal" | "bank_transfer";

export interface Payment {
  id: string;
  bookingReference: string;
  provider: PaymentProvider;
  providerReference: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
}

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
  if (!supabase) {
    console.warn("[payments] Supabase not configured, returning no payments.");
    return [];
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*, booking:bookings(booking_reference)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[payments] Supabase query failed:", error?.message);
    return [];
  }

  return data.map(mapRow);
}
