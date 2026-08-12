"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBookingById } from "@/lib/admin/data/bookings";
import { getStatusOptions } from "@/lib/admin/data/status-options";
import { createNotification } from "@/lib/admin/actions/notifications";
import { accrueLoyaltyForBooking, redeemLoyaltyPoints } from "@/lib/admin/actions/loyalty";
import { getCustomerById } from "@/lib/admin/data/customers";
import { sendCustomerConfirmation } from "@/lib/email";
import { customerQuoteEmail } from "@/lib/email-templates";
import { redirectWithSaved } from "./saved-redirect";

function revalidateBooking(id: string) {
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
}

// booking_status / payment_status no longer have a DB check constraint;
// the status_options table (CMS-managed) is the source of truth now, so we
// validate against it here instead.
async function assertValidStatus(category: "booking_status" | "payment_status", status: string) {
  const options = await getStatusOptions(category);
  if (!options.some((o) => o.key === status)) {
    throw new Error(`"${status}" isn't a recognized status. It may have been removed. Refresh and try again.`);
  }
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  await assertValidStatus("booking_status", status);

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").update({ booking_status: status }).eq("id", id);
  if (error) throw new Error(error.message);

  if (status === "confirmed" || status === "cancelled") {
    const booking = await getBookingById(id);
    if (booking) {
      await createNotification({
        type: "admin_alert",
        message: `Booking ${booking.bookingReference} for ${booking.productTitle} is now ${status}.`,
        relatedType: "booking",
        relatedId: id,
      });
    }
  }

  revalidateBooking(id);
}

// payment_status is a manual record-keeping field; payment itself happens
// offline (bank transfer, invoice, in person). There is no gateway behind this.
export async function updatePaymentStatus(id: string, status: string): Promise<void> {
  await assertValidStatus("payment_status", status);

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").update({ payment_status: status }).eq("id", id);
  if (error) throw new Error(error.message);

  if (status === "paid") {
    const booking = await getBookingById(id);
    if (booking) {
      // Fail-soft: a loyalty accrual hiccup must never make the payment
      // status update itself appear to fail.
      try {
        await accrueLoyaltyForBooking(id);
      } catch (err) {
        console.warn("[bookings] loyalty accrual failed:", err instanceof Error ? err.message : err);
      }
      await createNotification({
        type: "payment_confirmed",
        message: `Payment confirmed for booking ${booking.bookingReference} (${booking.productTitle}).`,
        relatedType: "booking",
        relatedId: id,
      });
    }
  }

  revalidateBooking(id);
}

export async function cancelBooking(id: string): Promise<void> {
  return updateBookingStatus(id, "cancelled");
}

// payments / booking_guests reference booking_id on delete cascade, so
// those go with it. inquiries.booking_id is on delete set null instead --
// a booking-derived inquiry stays visible in Inquiry Management, just
// unlinked from the (now-gone) booking it was mirrored from.
export async function deleteBooking(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/customers");
  redirectWithSaved("/admin/bookings", "Booking deleted.");
}

// Saves the quoted amount to total_amount, moves the booking to "quoted", and
// emails the customer (fail-soft; the status change lands even if the email
// doesn't). If redeemPoints is set, applies it as a discount off quotedAmount
// first -- the ledger transaction is written before the discounted total is
// saved, so a failed redemption never silently produces a discounted quote
// with no record of why.
export async function sendQuote(
  id: string,
  quotedAmount: number,
  message: string,
  redeemPoints?: number
): Promise<{ emailSent: boolean; emailFailureReason?: string }> {
  if (!Number.isFinite(quotedAmount) || quotedAmount <= 0) {
    throw new Error("Enter a quoted amount greater than zero.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const booking = await getBookingById(id);
  if (!booking) throw new Error("Booking not found.");

  let discountAmount = 0;
  if (redeemPoints && redeemPoints > 0) {
    if (!booking.customerId) throw new Error("This booking has no linked customer to redeem points for.");
    const customer = await getCustomerById(booking.customerId);
    if (!customer) throw new Error("Customer record not found.");
    const result = await redeemLoyaltyPoints({
      customerId: booking.customerId,
      bookingId: id,
      bookingReference: booking.bookingReference,
      points: redeemPoints,
      currentBalance: customer.loyaltyPoints,
    });
    discountAmount = result.discountAmount;
  }

  const finalAmount = Math.max(0, quotedAmount - discountAmount);

  const { error } = await supabase
    .from("bookings")
    .update({ total_amount: finalAmount, booking_status: "quoted" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  let emailSent = false;
  let emailFailureReason: string | undefined;
  if (booking.customerEmail) {
    const result = await sendCustomerConfirmation({
      to: booking.customerEmail,
      subject: `Your quote for ${booking.productTitle}: ${booking.bookingReference}`,
      html: customerQuoteEmail({
        customerName: booking.customerName,
        bookingReference: booking.bookingReference,
        enquiryTitle: booking.productTitle,
        quotedAmount: finalAmount,
        currency: booking.currency,
        message,
        loyaltyRedemption:
          discountAmount > 0
            ? { points: redeemPoints as number, discountAmount, currency: booking.currency }
            : undefined,
      }),
    });
    emailSent = result.sent;
    emailFailureReason = result.reason;
  }

  revalidateBooking(id);
  return { emailSent, emailFailureReason };
}
