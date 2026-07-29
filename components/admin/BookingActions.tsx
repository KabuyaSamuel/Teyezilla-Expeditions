"use client";

import { useState } from "react";
import {
  cancelBooking,
  sendQuote,
  updateBookingStatus,
  updatePaymentStatus,
} from "@/lib/admin/actions/bookings";
import type { StatusOption } from "@/lib/admin/data/status-options";

export default function BookingActions({
  id,
  bookingReference,
  bookingStatus,
  paymentStatus,
  currency,
  bookingStatusOptions,
  paymentStatusOptions,
}: {
  id: string;
  bookingReference: string;
  bookingStatus: string;
  paymentStatus: string;
  currency: string;
  bookingStatusOptions: StatusOption[];
  paymentStatusOptions: StatusOption[];
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSendQuote() {
    const amount = Number(quoteAmount);
    await run(async () => {
      const { emailSent } = await sendQuote(id, amount, quoteMessage.trim());
      setQuoteOpen(false);
      setQuoteAmount("");
      setQuoteMessage("");
      setNotice(
        emailSent
          ? "Quote saved and emailed to the customer."
          : "Quote saved. The email could not be sent. Follow up by email or WhatsApp."
      );
    });
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}
      {notice && <p className="mb-3 text-sm text-primary">{notice}</p>}

      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium text-foreground/60">Booking status</span>
          <select
            value={bookingStatus}
            disabled={busy}
            onChange={(e) => run(() => updateBookingStatus(id, e.target.value))}
            className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {!bookingStatusOptions.some((o) => o.key === bookingStatus) && (
              <option value={bookingStatus}>{bookingStatus} (removed option)</option>
            )}
            {bookingStatusOptions.map((o) => (
              <option key={o.id} value={o.key}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium text-foreground/60">Payment (manual record)</span>
          <select
            value={paymentStatus}
            disabled={busy}
            onChange={(e) => run(() => updatePaymentStatus(id, e.target.value))}
            className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {!paymentStatusOptions.some((o) => o.key === paymentStatus) && (
              <option value={paymentStatus}>{paymentStatus} (removed option)</option>
            )}
            {paymentStatusOptions.map((o) => (
              <option key={o.id} value={o.key}>{o.label}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setQuoteOpen((v) => !v)}
          disabled={busy || bookingStatus === "cancelled" || bookingStatus === "completed"}
          className="btn-primary px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send Quote
        </button>

        <button
          type="button"
          onClick={() => {
            if (!confirm(`Cancel booking ${bookingReference}? This can't be undone.`)) return;
            run(() => cancelBooking(id));
          }}
          disabled={busy || bookingStatus === "cancelled" || bookingStatus === "completed"}
          className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel Booking
        </button>
      </div>

      {quoteOpen && (
        <div className="mt-4 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
          <p className="text-sm font-medium text-foreground">Send a quote</p>
          <p className="mt-1 text-xs text-foreground/60">
            Saves the amount to this booking, sets the status to Quoted, and emails the customer.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <input
              type="number"
              min={1}
              placeholder={`Amount (${currency})`}
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              className="w-44 rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <textarea
            rows={3}
            placeholder="Message to the customer (what's included, options, next steps)…"
            value={quoteMessage}
            onChange={(e) => setQuoteMessage(e.target.value)}
            className="mt-3 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleSendQuote}
              disabled={busy || !quoteAmount}
              className="btn-primary px-5 py-2 text-sm disabled:opacity-40"
            >
              {busy ? "Sending…" : "Save & Email Quote"}
            </button>
            <button
              type="button"
              onClick={() => setQuoteOpen(false)}
              disabled={busy}
              className="btn-outline px-5 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
