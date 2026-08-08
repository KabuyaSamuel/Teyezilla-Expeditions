"use client";

import { useState } from "react";
import { adjustLoyaltyPoints } from "@/lib/admin/actions/loyalty";
import type { LoyaltyTransaction } from "@/lib/admin/data/loyalty";
import { useToast } from "./Toast";

export default function LoyaltyPanel({
  customerId,
  balance,
  transactions,
  canAdjust,
}: {
  customerId: string;
  balance: number;
  transactions: LoyaltyTransaction[];
  /** Manual adjustment is a direct balance write, scoped to admin/manager only (see permissions.ts). */
  canAdjust: boolean;
}) {
  const { toast } = useToast();
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adjustLoyaltyPoints(customerId, Number(delta), reason);
      toast.success("Points adjusted.");
      setDelta("");
      setReason("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to adjust points.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Loyalty Points</h2>
      <p className="mt-2 font-heading text-3xl font-bold text-accent">{balance.toLocaleString()}</p>
      <p className="text-xs text-foreground/50">current balance</p>

      {canAdjust && (
        <form onSubmit={handleAdjust} className="mt-4 space-y-2 rounded-xl bg-secondary/10 p-3">
          <p className="text-xs font-medium text-foreground/70">Adjust points</p>
          {error && <p className="text-xs text-error">{error}</p>}
          <div className="flex flex-col gap-2 xs:flex-row">
            <input
              type="number"
              placeholder="+/- amount"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary xs:w-28"
            />
            <input
              type="text"
              placeholder="Reason (required)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="flex-1 rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" disabled={saving || !delta || !reason.trim()} className="btn-primary w-full py-1.5 text-xs disabled:opacity-50">
            {saving ? "Saving…" : "Apply Adjustment"}
          </button>
        </form>
      )}

      <h3 className="mt-6 text-xs font-medium uppercase tracking-wide text-foreground/50">History</h3>
      <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
        {transactions.map((t) => (
          <div key={t.id} className="rounded-lg bg-secondary/5 px-3 py-2 text-xs">
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${t.pointsDelta > 0 ? "text-success" : "text-error"}`}>
                {t.pointsDelta > 0 ? "+" : ""}
                {t.pointsDelta.toLocaleString()}
              </span>
              <span className="text-foreground/40">{new Date(t.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-0.5 text-foreground/70">{t.reason}</p>
            {(t.bookingReference || t.createdByName) && (
              <p className="mt-0.5 text-foreground/40">
                {t.bookingReference && `Booking ${t.bookingReference}`}
                {t.bookingReference && t.createdByName && " · "}
                {t.createdByName && `by ${t.createdByName}`}
              </p>
            )}
          </div>
        ))}
        {transactions.length === 0 && <p className="text-xs text-foreground/50">No point activity yet.</p>}
      </div>
    </div>
  );
}
