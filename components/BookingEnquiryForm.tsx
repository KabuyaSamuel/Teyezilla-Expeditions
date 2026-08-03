"use client";

import { useActionState, useMemo, useState } from "react";
import { submitBookingEnquiry } from "@/app/(public)/booking/actions";
import { BUDGET_RANGES, COUNTRIES, REFERRAL_SOURCES, type EnquiryFormState } from "@/lib/enquiry-shared";

export interface BookableAddonOption {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
}

export interface ProductOption {
  slug: string;
  title: string;
  kind: "tour" | "journey";
  priceFrom: number;
  currency: string;
  addons: BookableAddonOption[];
  /** Set when arriving via a specific pricing tier's "Enquire" link. */
  tierId?: string;
}

const inputClass =
  "w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const areaClass =
  "w-full rounded-2xl border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 px-2 text-xs text-red-600">{message}</p>;
}

export default function BookingEnquiryForm({
  preselected,
  options,
}: {
  // When arriving via ?tour= / ?journey= the product is fixed; otherwise the
  // visitor picks from the published tours + journeys list.
  preselected?: ProductOption;
  options: ProductOption[];
}) {
  const [state, formAction, pending] = useActionState<EnquiryFormState, FormData>(
    submitBookingEnquiry,
    {}
  );
  const [children, setChildren] = useState(0);
  const [flexible, setFlexible] = useState(false);
  const [selection, setSelection] = useState(
    preselected ? `${preselected.kind}:${preselected.slug}` : ""
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    travelDate: "",
    adults: 2,
    childrenAges: "",
    budgetRange: "",
    referralSource: "",
    specialRequests: "",
  });

  function setField<K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  const errors = state.fieldErrors ?? {};
  const [selKind, selSlug] = selection.split(":");

  const allOptions = preselected ? [preselected, ...options] : options;
  const selectedProduct = useMemo(
    () => allOptions.find((o) => o.kind === selKind && o.slug === selSlug),
    [allOptions, selKind, selSlug]
  );
  const availableAddons = selectedProduct?.addons ?? [];

  function toggleAddon(id: string) {
    setSelectedAddonIds((ids) => (ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]));
  }

  function handleSelectionChange(value: string) {
    setSelection(value);
    setSelectedAddonIds([]);
  }

  const addonsTotal = availableAddons
    .filter((a) => selectedAddonIds.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const estimatedTotal = (selectedProduct?.priceFrom ?? 0) + addonsTotal;

  return (
    <form action={formAction} onReset={(e) => e.preventDefault()} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="tourSlug" value={selKind === "tour" ? selSlug : ""} />
      <input type="hidden" name="journeySlug" value={selKind === "journey" ? selSlug : ""} />
      <input type="hidden" name="addonIds" value={selectedAddonIds.join(",")} />
      <input type="hidden" name="tierId" value={preselected?.tierId ?? ""} />

      {!preselected && (
        <div>
          <label htmlFor="product" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Which tour or journey are you interested in? <span className="text-red-600">*</span>
          </label>
          <select
            id="product"
            value={selection}
            onChange={(e) => handleSelectionChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Choose a tour or journey…</option>
            <optgroup label="Tours">
              {options.filter((o) => o.kind === "tour").map((o) => (
                <option key={`tour:${o.slug}`} value={`tour:${o.slug}`}>{o.title}</option>
              ))}
            </optgroup>
            <optgroup label="Journeys">
              {options.filter((o) => o.kind === "journey").map((o) => (
                <option key={`journey:${o.slug}`} value={`journey:${o.slug}`}>{o.title}</option>
              ))}
            </optgroup>
          </select>
          <FieldError message={errors.tourSlug} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fields.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            className={inputClass}
          />
          <FieldError message={errors.fullName} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(e) => setField("email", e.target.value)}
            className={inputClass}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Phone (WhatsApp preferred) <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254 …"
            value={fields.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={inputClass}
          />
          <FieldError message={errors.phone} />
        </div>
        <div>
          <label htmlFor="country" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Country of residence <span className="text-red-600">*</span>
          </label>
          <select
            id="country"
            name="country"
            autoComplete="country-name"
            value={fields.country}
            onChange={(e) => setField("country", e.target.value)}
            className={inputClass}
          >
            <option value="">Select your country…</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError message={errors.country} />
        </div>
      </div>

      <div>
        <label htmlFor="travelDate" className="mb-1 block px-2 text-sm font-medium text-foreground">
          Preferred travel date
        </label>
        <input
          id="travelDate"
          name="travelDate"
          type="date"
          disabled={flexible}
          value={fields.travelDate}
          onChange={(e) => setField("travelDate", e.target.value)}
          className={`${inputClass} disabled:opacity-50`}
        />
        <label className="mt-2 flex items-center gap-2 px-2 text-sm text-foreground/80">
          <input
            type="checkbox"
            name="flexibleDates"
            checked={flexible}
            onChange={(e) => setFlexible(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          My dates are flexible
        </label>
        <FieldError message={errors.travelDate} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="adults" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Adults <span className="text-red-600">*</span>
          </label>
          <input
            id="adults"
            name="adults"
            type="number"
            min={1}
            value={fields.adults}
            onChange={(e) => setField("adults", Math.max(1, Number(e.target.value) || 1))}
            className={inputClass}
          />
          <FieldError message={errors.adults} />
        </div>
        <div>
          <label htmlFor="children" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Children
          </label>
          <input
            id="children"
            name="children"
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
            className={inputClass}
          />
        </div>
      </div>

      {children > 0 && (
        <div>
          <label htmlFor="childrenAges" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Children&apos;s ages
          </label>
          <input
            id="childrenAges"
            name="childrenAges"
            type="text"
            placeholder="e.g. 5 and 9 (ages matter for safari lodges and pricing)"
            value={fields.childrenAges}
            onChange={(e) => setField("childrenAges", e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budgetRange" className="mb-1 block px-2 text-sm font-medium text-foreground">
            Budget per person (optional)
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            className={inputClass}
            value={fields.budgetRange}
            onChange={(e) => setField("budgetRange", e.target.value)}
          >
            <option value="">Select a range…</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="referralSource" className="mb-1 block px-2 text-sm font-medium text-foreground">
            How did you hear about us? (optional)
          </label>
          <select
            id="referralSource"
            name="referralSource"
            className={inputClass}
            value={fields.referralSource}
            onChange={(e) => setField("referralSource", e.target.value)}
          >
            <option value="">Select…</option>
            {REFERRAL_SOURCES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="specialRequests" className="mb-1 block px-2 text-sm font-medium text-foreground">
          Special requests / anything else
        </label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          rows={4}
          placeholder="Honeymoon, dietary needs, mobility, a celebration: anything that helps us tailor your trip."
          value={fields.specialRequests}
          onChange={(e) => setField("specialRequests", e.target.value)}
          className={areaClass}
        />
      </div>

      {availableAddons.length > 0 && (
        <div>
          <p className="mb-1 block px-2 text-sm font-medium text-foreground">
            Make it your own (optional)
          </p>
          <p className="mb-2 px-2 text-xs text-foreground/50">
            Add any extras you&apos;d like included in your quote. Pick as many as you want.
          </p>
          <div className="space-y-2">
            {availableAddons.map((addon) => (
              <label
                key={addon.id}
                className="flex items-start gap-3 rounded-2xl border border-secondary/40 px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  checked={selectedAddonIds.includes(addon.id)}
                  onChange={() => toggleAddon(addon.id)}
                />
                <span className="flex-1">
                  <span className="font-medium text-foreground">{addon.title}</span>
                  {addon.description && <span className="mt-0.5 block text-foreground/60">{addon.description}</span>}
                </span>
                <span className="whitespace-nowrap font-semibold text-primary">
                  {addon.currency} {addon.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="rounded-2xl bg-secondary/10 px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">
              {selectedProduct.title} ({selectedProduct.tierId ? "per person" : "from, per person"}){addonsTotal > 0 ? " + add-ons" : ""}
            </span>
            <span className="font-heading text-lg font-bold text-accent">
              {selectedProduct.currency} {estimatedTotal.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-foreground/50">
            Estimated starting total, per person -- our team confirms your final quote based on dates, group size, and availability.
          </p>
        </div>
      )}

      {state.formError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.formError}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? "Sending your enquiry…" : "Send Enquiry"}
      </button>
      <p className="text-center text-xs text-foreground/50">
        No payment is taken online. Our travel team replies with a personal quote within 24 hours.
      </p>
    </form>
  );
}
