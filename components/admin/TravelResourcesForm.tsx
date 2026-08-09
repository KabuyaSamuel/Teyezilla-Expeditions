"use client";

import { useState } from "react";
import { saveTravelResources, type TravelResourcesInput } from "@/lib/admin/actions/travel-resources";
import { useToast } from "./Toast";

export default function TravelResourcesForm({
  destinationId,
  initial,
}: {
  destinationId: string;
  initial: TravelResourcesInput;
}) {
  const { toast } = useToast();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof TravelResourcesInput>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveTravelResources(destinationId, values);
      setSaved(true);
      toast.success("Travel resources saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`visa-${destinationId}`} className="text-xs font-medium text-foreground/60">Visa Requirements</label>
          <textarea
            id={`visa-${destinationId}`}
            rows={2}
            value={values.visaInfo}
            onChange={(e) => set("visaInfo", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor={`health-${destinationId}`} className="text-xs font-medium text-foreground/60">Health & Vaccination Guidance</label>
          <textarea
            id={`health-${destinationId}`}
            rows={2}
            placeholder="Yellow fever certificate, routine vaccinations..."
            value={values.healthGuidance}
            onChange={(e) => set("healthGuidance", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor={`packing-${destinationId}`} className="text-xs font-medium text-foreground/60">Packing List</label>
          <textarea
            id={`packing-${destinationId}`}
            rows={2}
            placeholder="Neutral-colored clothing, binoculars..."
            value={values.packingList}
            onChange={(e) => set("packingList", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor={`insurance-${destinationId}`} className="text-xs font-medium text-foreground/60">Travel Insurance Info</label>
          <textarea
            id={`insurance-${destinationId}`}
            rows={2}
            placeholder="Recommended providers, minimum coverage..."
            value={values.insuranceInfo}
            onChange={(e) => set("insuranceInfo", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-xs font-medium text-success">Saved.</span>}
        {error && <span className="text-xs font-medium text-error">{error}</span>}
      </div>
    </form>
  );
}
