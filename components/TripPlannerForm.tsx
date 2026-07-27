"use client";

import { useActionState, useState } from "react";
import { submitTripPlannerRequest } from "@/app/trip-planner/actions";
import { whatsappLink, type EnquiryFormState } from "@/lib/enquiry-shared";

const DESTINATIONS = ["Kenya", "Tanzania", "Zanzibar", "Egypt", "Morocco", "Multi-country"];
const STYLES = ["Relaxed", "Adventure", "Culture-focused", "Luxury"];
const LUXURY_LEVELS = ["Budget-friendly", "Mid-range", "Boutique", "Ultra-luxury"];

const inputClass =
  "w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 px-2 text-xs text-red-600">{message}</p>;
}

export default function TripPlannerForm() {
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    submitTripPlannerRequest,
    {}
  );
  // Keep the trip parameters in state so the success screen can pre-fill the
  // WhatsApp share message with what the visitor asked for.
  const [params, setParams] = useState({
    name: "",
    email: "",
    destination: DESTINATIONS[0],
    budgetUsd: "",
    days: "",
    travelers: "",
    travelStyle: STYLES[0],
    luxuryLevel: "",
  });
  const errors = state.fieldErrors ?? {};

  if (state.success) {
    const shareMessage = `Hi! I just submitted a trip request: ${params.destination}, ${params.days || "?"} days, ${params.travelers || "?"} traveler(s), ${params.travelStyle}${params.luxuryLevel ? ` (${params.luxuryLevel})` : ""}${params.budgetUsd ? `, budget $${params.budgetUsd}` : ""}. Excited to hear your suggestions!`;
    return (
      <div className="mt-8 rounded-2xl bg-primary/5 p-8 text-center">
        <p className="font-heading text-xl font-semibold text-primary">
          Trip request received — thank you!
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          Our travel team will send a suggested itinerary and quote within 24 hours.
        </p>
        <a
          href={whatsappLink(shareMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-4 text-sm"
        >
          Share it on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} onReset={(e) => e.preventDefault()} className="mt-8 space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            value={params.name}
            onChange={(e) => setParams((p) => ({ ...p, name: e.target.value }))}
            className={inputClass}
          />
          <FieldError message={errors.name} />
        </div>
        <div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={params.email}
            onChange={(e) => setParams((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
          />
          <FieldError message={errors.email} />
        </div>
      </div>
      <div>
        <select
          id="destination"
          name="destination"
          value={params.destination}
          onChange={(e) => setParams((p) => ({ ...p, destination: e.target.value }))}
          className={inputClass}
        >
          {DESTINATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <FieldError message={errors.destination} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <input
            id="budgetUsd"
            name="budgetUsd"
            type="number"
            min={0}
            placeholder="Budget (USD, optional)"
            value={params.budgetUsd}
            onChange={(e) => setParams((p) => ({ ...p, budgetUsd: e.target.value }))}
            className={inputClass}
          />
          <FieldError message={errors.budgetUsd} />
        </div>
        <div>
          <input
            id="days"
            name="days"
            type="number"
            min={1}
            placeholder="Number of days"
            value={params.days}
            onChange={(e) => setParams((p) => ({ ...p, days: e.target.value }))}
            className={inputClass}
          />
          <FieldError message={errors.days} />
        </div>
        <div>
          <input
            id="travelers"
            name="travelers"
            type="number"
            min={1}
            placeholder="Number of travelers"
            value={params.travelers}
            onChange={(e) => setParams((p) => ({ ...p, travelers: e.target.value }))}
            className={inputClass}
          />
          <FieldError message={errors.travelers} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <select
            id="travelStyle"
            name="travelStyle"
            value={params.travelStyle}
            onChange={(e) => setParams((p) => ({ ...p, travelStyle: e.target.value }))}
            className={inputClass}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <FieldError message={errors.travelStyle} />
        </div>
        <div>
          <select
            id="luxuryLevel"
            name="luxuryLevel"
            value={params.luxuryLevel}
            onChange={(e) => setParams((p) => ({ ...p, luxuryLevel: e.target.value }))}
            className={inputClass}
          >
            <option value="">Comfort level (optional)…</option>
            {LUXURY_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      {state.formError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.formError}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Sending…" : "Request My Itinerary"}
      </button>
    </form>
  );
}
