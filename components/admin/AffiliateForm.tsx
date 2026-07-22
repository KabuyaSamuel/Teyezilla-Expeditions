"use client";

import { useState } from "react";
import type { AffiliatePartner } from "@/lib/admin/data/affiliates";
import { createAffiliatePartner, updateAffiliatePartner, deleteAffiliatePartner } from "@/lib/admin/actions/affiliates";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function AffiliateForm({ existingPartner }: { existingPartner?: AffiliatePartner }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const rateRaw = String(formData.get("commissionRate") ?? "").trim();
    const input = {
      name: String(formData.get("name") ?? ""),
      status: String(formData.get("status") ?? "not_connected") as "not_connected" | "connected" | "pending",
      commissionRate: rateRaw ? Number(rateRaw) : null,
      notes: String(formData.get("notes") ?? ""),
    };

    try {
      if (existingPartner) {
        await updateAffiliatePartner(existingPartner.id, input);
      } else {
        await createAffiliatePartner(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to save partner.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingPartner) return;
    if (!confirm(`Remove "${existingPartner.name}"?`)) return;
    setSaving(true);
    try {
      await deleteAffiliatePartner(existingPartner.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError(err instanceof Error ? err.message : "Failed to delete partner.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-foreground/60">Partner Name</label>
          <input id="name" name="name" required defaultValue={existingPartner?.name} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="status" className="text-xs font-medium text-foreground/60">Status</label>
          <select id="status" name="status" defaultValue={existingPartner?.status ?? "not_connected"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="not_connected">Not Connected</option>
            <option value="pending">Pending</option>
            <option value="connected">Connected</option>
          </select>
        </div>
        <div>
          <label htmlFor="commissionRate" className="text-xs font-medium text-foreground/60">Commission Rate (%)</label>
          <input id="commissionRate" name="commissionRate" type="number" min={0} max={100} step="0.01" defaultValue={existingPartner?.commissionRate ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="text-xs font-medium text-foreground/60">Notes</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={existingPartner?.notes} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        {existingPartner && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Partner"}
        </button>
      </div>
    </form>
  );
}
