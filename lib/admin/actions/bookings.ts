"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function cancelBooking(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").update({ booking_status: "cancelled" }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
}

// Records the refund as a business fact (payment_status + a payments row).
// No payment gateway is wired up yet (Stripe/M-Pesa/PayPal keys are still
// commented out in .env.local — Phase 4), so this doesn't call out to a
// provider to actually move money; it's the ledger update once that's
// been done manually or once gateway refunds land.
export async function processRefund(id: string, bookingReference: string, amount: number, currency: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ payment_status: "refunded" })
    .eq("id", id);
  if (bookingError) throw new Error(bookingError.message);

  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: id,
    provider: "bank_transfer",
    provider_reference: `manual-refund-${bookingReference}`,
    amount,
    currency,
    status: "refunded",
  });
  if (paymentError) throw new Error(paymentError.message);

  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
}
