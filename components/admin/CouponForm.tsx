"use client";

import { useState } from "react";
import type { Coupon } from "@/lib/admin/data/coupons";
import { createCoupon, updateCoupon, deleteCoupon } from "@/lib/admin/actions/coupons";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function CouponForm({ existingCoupon }: { existingCoupon?: Coupon }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      code: String(formData.get("code") ?? ""),
      discountType: String(formData.get("discountType") ?? "percentage") as "percentage" | "fixed",
      discountValue: Number(formData.get("discountValue") ?? 0),
      isReferral: formData.get("isReferral") === "on",
      usageLimit: Number(formData.get("usageLimit") ?? 0),
      expiresAt: String(formData.get("expiresAt") ?? ""),
    };

    try {
      if (existingCoupon) {
        await updateCoupon(existingCoupon.id, input);
      } else {
        await createCoupon(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save coupon.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingCoupon) return;
    if (!confirm(`Delete coupon "${existingCoupon.code}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteCoupon(existingCoupon.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete coupon.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className="text-xs font-medium text-foreground/60">Code</label>
          <input id="code" name="code" required defaultValue={existingCoupon?.code} placeholder="SAFARI10" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="discountType" className="text-xs font-medium text-foreground/60">Discount Type</label>
          <select id="discountType" name="discountType" defaultValue={existingCoupon?.discountType ?? "percentage"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount (USD)</option>
          </select>
        </div>
        <div>
          <label htmlFor="discountValue" className="text-xs font-medium text-foreground/60">Discount Value</label>
          <input id="discountValue" name="discountValue" type="number" min={0} required defaultValue={existingCoupon?.discountValue} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="usageLimit" className="text-xs font-medium text-foreground/60">Usage Limit</label>
          <input id="usageLimit" name="usageLimit" type="number" min={0} defaultValue={existingCoupon?.usageLimit} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="expiresAt" className="text-xs font-medium text-foreground/60">Expires</label>
          <input id="expiresAt" name="expiresAt" type="date" defaultValue={existingCoupon?.expiresAt?.slice(0, 10)} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <label htmlFor="isReferral" className="flex items-center gap-2 self-end pb-2 text-sm">
          <input id="isReferral" name="isReferral" type="checkbox" defaultChecked={existingCoupon?.isReferral} /> Referral code
        </label>
      </section>

      <div className="flex justify-end gap-3">
        {existingCoupon && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Coupon"}
        </button>
      </div>
    </form>
  );
}
