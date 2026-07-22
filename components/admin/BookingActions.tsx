"use client";

import { useState } from "react";
import { cancelBooking, processRefund } from "@/lib/admin/actions/bookings";

export default function BookingActions({
  id,
  bookingReference,
  bookingStatus,
  paymentStatus,
  totalAmount,
  currency,
}: {
  id: string;
  bookingReference: string;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!confirm(`Cancel booking ${bookingReference}? This can't be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      await cancelBooking(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefund() {
    if (!confirm(`Record a refund of ${currency} ${totalAmount} for ${bookingReference}?`)) return;
    setBusy(true);
    setError(null);
    try {
      await processRefund(id, bookingReference, totalAmount, currency);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process refund.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={busy || bookingStatus === "cancelled" || bookingStatus === "completed"}
          className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel Booking
        </button>
        <button
          type="button"
          onClick={handleRefund}
          disabled={busy || paymentStatus === "refunded" || paymentStatus === "pending"}
          className="rounded-full border-2 border-accent px-5 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Process Refund
        </button>
      </div>
    </div>
  );
}
