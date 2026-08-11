"use client";

import { useState } from "react";
import type { AdminVehicle } from "@/lib/admin/data/vehicles";
import { createVehicle, updateVehicle, deleteVehicle } from "@/lib/admin/actions/vehicles";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function VehicleForm({ existingVehicle }: { existingVehicle?: AdminVehicle }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const splitCommas = (v: FormDataEntryValue | null) =>
      String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    const seatsRaw = String(formData.get("seats") ?? "");
    const input = {
      name: String(formData.get("name") ?? ""),
      slug: existingVehicle?.slug ?? "",
      vehicleType: String(formData.get("vehicleType") ?? ""),
      seats: seatsRaw ? Number(seatsRaw) : null,
      description: String(formData.get("description") ?? ""),
      features: splitCommas(formData.get("features")),
      image: String(formData.get("image") ?? ""),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
    };

    try {
      if (existingVehicle) {
        await updateVehicle(existingVehicle.id, input);
      } else {
        await createVehicle(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save vehicle.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingVehicle) return;
    if (!confirm(`Delete "${existingVehicle.name}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteVehicle(existingVehicle.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete vehicle.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Vehicle Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-foreground/60">Name <span className="text-error">*</span></label>
            <input id="name" name="name" required defaultValue={existingVehicle?.name} placeholder="4x4 Safari Land Cruiser" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="vehicleType" className="text-xs font-medium text-foreground/60">Vehicle Type</label>
            <input id="vehicleType" name="vehicleType" defaultValue={existingVehicle?.vehicleType} placeholder="4x4 Safari Vehicle" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="seats" className="text-xs font-medium text-foreground/60">Seats</label>
            <input id="seats" name="seats" type="number" min={1} defaultValue={existingVehicle?.seats ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="image" className="text-xs font-medium text-foreground/60">Image URL</label>
            <input id="image" name="image" defaultValue={existingVehicle?.image} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="text-xs font-medium text-foreground/60">Display Order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={existingVehicle?.displayOrder ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-xs font-medium text-foreground/60">Description</label>
          <textarea id="description" name="description" defaultValue={existingVehicle?.description} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="mt-4">
          <label htmlFor="features" className="text-xs font-medium text-foreground/60">Features (comma-separated)</label>
          <input id="features" name="features" defaultValue={existingVehicle?.features?.join(", ")} placeholder="Guaranteed window seat, Roof viewing hatch, Charging ports" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-end gap-3 p-6">
        {existingVehicle && (
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save Vehicle"}
        </button>
      </section>
    </form>
  );
}
