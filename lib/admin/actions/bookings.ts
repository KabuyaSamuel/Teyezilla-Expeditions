"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBookingById } from "@/lib/admin/data/bookings";
import { sendCustomerConfirmation } from "@/lib/email";
import { customerQuoteEmail } from "@/lib/email-templates";

function revalidateBooking(id: string) {
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").update({ booking_status: status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateBooking(id);
}

// payment_status is a manual record-keeping field — payment itself happens
// offline (bank transfer, invoice, in person). There is no gateway behind this.
export async function updatePaymentStatus(id: string, status: string): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const { error } = await supabase.from("bookings").update({ payment_status: status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateBooking(id);
}

export async function cancelBooking(id: string): Promise<void> {
  return updateBookingStatus(id, "cancelled");
}

// Saves the quoted amount to total_amount, moves the booking to "quoted", and
// emails the customer (fail-soft — the status change lands even if the email
// doesn't).
export async function sendQuote(id: string, quotedAmount: number, message: string): Promise<{ emailSent: boolean }> {
  if (!Number.isFinite(quotedAmount) || quotedAmount <= 0) {
    throw new Error("Enter a quoted amount greater than zero.");
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured.");

  const booking = await getBookingById(id);
  if (!booking) throw new Error("Booking not found.");

  const { error } = await supabase
    .from("bookings")
    .update({ total_amount: quotedAmount, booking_status: "quoted" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  let emailSent = false;
  if (booking.customerEmail) {
    const result = await sendCustomerConfirmation({
      to: booking.customerEmail,
      subject: `Your quote for ${booking.productTitle} — ${booking.bookingReference}`,
      html: customerQuoteEmail({
        customerName: booking.customerName,
        bookingReference: booking.bookingReference,
        enquiryTitle: booking.productTitle,
        quotedAmount,
        currency: booking.currency,
        message,
      }),
    });
    emailSent = result.sent;
  }

  revalidateBooking(id);
  return { emailSent };
}
