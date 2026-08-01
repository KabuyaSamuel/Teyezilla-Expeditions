"use client";

import { useState } from "react";
import {
  saveTripPlannerItinerary,
  convertTripPlannerToBooking,
} from "@/lib/admin/actions/trip-planner";

export interface TripPlannerParams {
  id: string;
  destination: string;
  budgetUsd: number;
  days: number;
  travelers: number;
  travelStyle: string;
  luxuryLevel: string;
  aiSuggestedItinerary: string;
  status: string;
}

// The structured trip parameters + AI-itinerary editor + Convert to Booking
// action that used to live in the standalone AI Trip Planner module, now
// rendered inline for inquiries with source = 'ai_trip_planner'.
export default function TripPlannerInquiryPanel({
  inquiryId,
  request,
}: {
  inquiryId: string;
  request: TripPlannerParams;
}) {
  const [itinerary, setItinerary] = useState(request.aiSuggestedItinerary);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await saveTripPlannerItinerary(request.id, itinerary);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save itinerary.");
    } finally {
      setBusy(false);
    }
  }

  async function handleConvert() {
    if (!confirm("Convert this trip planner request into a booking enquiry?")) return;
    setBusy(true);
    setError(null);
    try {
      await convertTripPlannerToBooking(request.id, inquiryId);
    } catch (err) {
      // A successful convert redirects away; only real failures land here.
      // (Next.js redirects surface as a thrown NEXT_REDIRECT; rethrow those.)
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
      setError(err instanceof Error ? err.message : "Failed to convert to booking.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
        Trip Planner Request
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-foreground/70 sm:grid-cols-3 lg:grid-cols-6">
        <div><p className="text-foreground/40">Destination</p><p className="font-medium text-foreground">{request.destination || "-"}</p></div>
        <div><p className="text-foreground/40">Budget</p><p className="font-medium text-foreground">{request.budgetUsd ? `$${request.budgetUsd.toLocaleString()}` : "-"}</p></div>
        <div><p className="text-foreground/40">Days</p><p className="font-medium text-foreground">{request.days || "-"}</p></div>
        <div><p className="text-foreground/40">Travelers</p><p className="font-medium text-foreground">{request.travelers || "-"}</p></div>
        <div><p className="text-foreground/40">Style</p><p className="font-medium text-foreground">{request.travelStyle || "-"}</p></div>
        <div><p className="text-foreground/40">Luxury Level</p><p className="font-medium text-foreground">{request.luxuryLevel || "-"}</p></div>
      </div>

      <div className="mt-4">
        <label htmlFor={`itinerary-${request.id}`} className="text-xs font-medium text-foreground/50">
          AI-Suggested Itinerary
        </label>
        <textarea
          id={`itinerary-${request.id}`}
          value={itinerary}
          onChange={(e) => {
            setItinerary(e.target.value);
            setSaved(false);
          }}
          rows={4}
          className="mt-1 w-full rounded-2xl border border-secondary/40 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      {saved && <p className="mt-2 text-sm text-primary">Itinerary saved.</p>}

      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={handleSave} disabled={busy} className="btn-outline px-4 py-2 text-xs disabled:opacity-40">
          {busy ? "Working…" : "Save Edits"}
        </button>
        <button
          type="button"
          onClick={handleConvert}
          disabled={busy || request.status === "converted"}
          className="btn-primary px-4 py-2 text-xs disabled:opacity-40"
        >
          {request.status === "converted" ? "Already Converted" : "Convert to Booking"}
        </button>
      </div>
    </div>
  );
}
