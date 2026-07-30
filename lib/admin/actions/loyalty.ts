"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/session";
import { getBookingById } from "@/lib/admin/data/bookings";
import { hasAccruedForBooking } from "@/lib/admin/data/loyalty";
import { getSiteSetting } from "@/lib/settings";
import {
  LOYALTY_ACCRUAL_SETTING_KEY,
  parseLoyaltyAccrualRate,
  pointsForAmount,
  dollarValueOfPoints,
} from "@/lib/loyalty-shared";

export async function getLoyaltyAccrualRate(): Promise<number> {
  const raw = await getSiteSetting(LOYALTY_ACCRUAL_SETTING_KEY);
  return parseLoyaltyAccrualRate(raw);
}

async function applyTransaction(input: {
  customerId: string;
  pointsDelta: number;
  reason: string;
  bookingId?: string;
}): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const session = await getAdminSession();

  const { error } = await supabase.rpc("apply_loyalty_transaction", {
    p_customer_id: input.customerId,
    p_points_delta: input.pointsDelta,
    p_reason: input.reason,
    p_booking_id: input.bookingId ?? null,
    p_created_by: session?.id ?? null,
  });
  if (error) throw new Error(error.message);
}

// Manual adjustment from the customer detail page. A signed amount plus a
// required reason -- balances only ever change through a logged transaction,
// never a direct overwrite.
export async function adjustLoyaltyPoints(customerId: string, delta: number, reason: string): Promise<void> {
  if (!Number.isFinite(delta) || delta === 0) {
    throw new Error("Enter a non-zero point amount.");
  }
  if (!reason.trim()) {
    throw new Error("A reason is required for every point adjustment.");
  }

  await applyTransaction({ customerId, pointsDelta: Math.round(delta), reason: reason.trim() });

  revalidatePath(`/admin/customers/${customerId}`);
}

// Called when a booking's payment_status is set to "paid". Guards against
// double-awarding if a booking is toggled paid -> unpaid -> paid by checking
// for an existing accrual transaction on this booking first.
export async function accrueLoyaltyForBooking(bookingId: string): Promise<void> {
  const booking = await getBookingById(bookingId);
  if (!booking || !booking.customerId || booking.totalAmount <= 0) return;

  const alreadyAccrued = await hasAccruedForBooking(bookingId);
  if (alreadyAccrued) return;

  const rate = await getLoyaltyAccrualRate();
  const points = pointsForAmount(booking.totalAmount, rate);
  if (points <= 0) return;

  await applyTransaction({
    customerId: booking.customerId,
    pointsDelta: points,
    reason: `Earned from booking ${booking.bookingReference}`,
    bookingId,
  });

  revalidatePath(`/admin/customers/${booking.customerId}`);
}

// Called from the Send Quote flow when staff choose to apply some or all of
// a customer's balance as a discount. Returns the dollar value redeemed so
// the caller can subtract it from the quoted total and mention it in the email.
export async function redeemLoyaltyPoints(input: {
  customerId: string;
  bookingId: string;
  bookingReference: string;
  points: number;
  currentBalance: number;
}): Promise<{ discountAmount: number }> {
  if (!Number.isFinite(input.points) || input.points <= 0) {
    throw new Error("Enter a positive number of points to redeem.");
  }
  if (input.points > input.currentBalance) {
    throw new Error("Cannot redeem more points than the customer's current balance.");
  }

  const rate = await getLoyaltyAccrualRate();
  const discountAmount = dollarValueOfPoints(input.points, rate);

  await applyTransaction({
    customerId: input.customerId,
    pointsDelta: -Math.round(input.points),
    reason: `Redeemed against booking ${input.bookingReference}`,
    bookingId: input.bookingId,
  });

  revalidatePath(`/admin/customers/${input.customerId}`);
  return { discountAmount };
}
