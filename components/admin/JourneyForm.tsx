"use client";

import { useState } from "react";
import type { Destination, Tour } from "@/types";
import type { JourneyType } from "@/lib/journeys";
import type { ExperienceType } from "@/lib/experienceTypes";
import type { SafariTheme } from "@/lib/safari";
import type { Activity } from "@/lib/activities";
import type { AdminVehicle } from "@/lib/admin/data/vehicles";
import type { AdminAccommodation } from "@/lib/admin/data/accommodations";
import type { AdminJourneyDetail, ItineraryDay } from "@/lib/admin/data/journeys";
import type { PricingTierInput, HighlightInput, FaqInput, AddonInput } from "@/lib/admin/actions/productShared";
import type { MediaItem } from "@/lib/admin/data/media";
import { createJourney, updateJourney, deleteJourney } from "@/lib/admin/actions/journeys";
import ItineraryEditor from "./ItineraryEditor";
import PricingTiersEditor from "./PricingTiersEditor";
import HighlightsEditor from "./HighlightsEditor";
import FaqsEditor from "./FaqsEditor";
import AddonsEditor from "./AddonsEditor";
import ActivitiesPicker from "./ActivitiesPicker";
import VehiclesPicker from "./VehiclesPicker";
import AccommodationsPicker from "./AccommodationsPicker";
import TourPicker from "./TourPicker";
import MediaPickerField from "./MediaPickerField";
import RelatedContentEditor from "./RelatedContentEditor";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function JourneyForm({
  existingJourney,
  destinations,
  journeyTypes,
  experienceTypes,
  safariThemes,
  activities,
  vehicles,
  accommodations,
  tours,
  mediaItems,
  otherJourneys,
  blogPosts,
}: {
  existingJourney?: AdminJourneyDetail;
  destinations: Destination[];
  journeyTypes: JourneyType[];
  experienceTypes: ExperienceType[];
  safariThemes: SafariTheme[];
  activities: Activity[];
  vehicles: AdminVehicle[];
  accommodations: AdminAccommodation[];
  tours: Tour[];
  mediaItems: MediaItem[];
  otherJourneys: { id: string; title: string }[];
  blogPosts: { id: string; title: string }[];
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState(existingJourney?.heroImage ?? "");
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    existingJourney?.itinerary?.length ? existingJourney.itinerary : [{ day: 1, title: "", description: "" }]
  );
  const [destinationIds, setDestinationIds] = useState<string[]>(existingJourney?.destinationIds ?? []);
  const [primaryDestinationId, setPrimaryDestinationId] = useState(existingJourney?.primaryDestinationId ?? "");
  const [journeyTypeIds, setJourneyTypeIds] = useState<string[]>(existingJourney?.journeyTypeIds ?? []);
  const [experienceTypeIds, setExperienceTypeIds] = useState<string[]>(existingJourney?.experienceTypeIds ?? []);
  const [safariThemeIds, setSafariThemeIds] = useState<string[]>(existingJourney?.safariThemeIds ?? []);
  const [pricingTiers, setPricingTiers] = useState<PricingTierInput[]>(
    existingJourney?.pricingTiers.map((t) => ({ ...t })) ?? []
  );
  const [highlights, setHighlights] = useState<HighlightInput[]>(
    existingJourney?.highlights.map((h) => ({ ...h })) ?? []
  );
  const [faqs, setFaqs] = useState<FaqInput[]>(existingJourney?.faqs.map((f) => ({ ...f })) ?? []);
  const [addons, setAddons] = useState<AddonInput[]>(existingJourney?.addons.map((a) => ({ ...a })) ?? []);
  const [activityIds, setActivityIds] = useState<string[]>(existingJourney?.activityIds ?? []);
  const [vehicleIds, setVehicleIds] = useState<string[]>(existingJourney?.vehicleIds ?? []);
  const [accommodationIds, setAccommodationIds] = useState<string[]>(existingJourney?.accommodationIds ?? []);
  const [tourIds, setTourIds] = useState<string[]>(existingJourney?.tourIds ?? []);
  const [relatedJourneyIds, setRelatedJourneyIds] = useState<string[]>(existingJourney?.relatedJourneyIds ?? []);
  const [relatedTourIds, setRelatedTourIds] = useState<string[]>(existingJourney?.relatedTourIds ?? []);
  const [relatedBlogPostIds, setRelatedBlogPostIds] = useState<string[]>(existingJourney?.relatedBlogPostIds ?? []);

  function toggleId(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  }

  function toggleDestination(id: string) {
    const next = destinationIds.includes(id) ? destinationIds.filter((v) => v !== id) : [...destinationIds, id];
    setDestinationIds(next);
    if (!next.includes(primaryDestinationId)) {
      setPrimaryDestinationId(next[0] ?? "");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const splitLines = (v: FormDataEntryValue | null) =>
      String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    const splitCommas = (v: FormDataEntryValue | null) =>
      String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    const input = {
      title: String(formData.get("title") ?? ""),
      slug: existingJourney?.slug ?? "",
      heroImage,
      tagline: String(formData.get("tagline") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      overview: String(formData.get("overview") ?? ""),
      productType: String(formData.get("productType") ?? "signature_journey"),
      durationDays: Number(formData.get("durationDays") ?? 0),
      priceFrom: Number(formData.get("priceFrom") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      difficulty: String(formData.get("difficulty") ?? ""),
      inclusions: splitLines(formData.get("inclusions")),
      exclusions: splitLines(formData.get("exclusions")),
      itinerary,
      meetingPoint: String(formData.get("meetingPoint") ?? ""),
      pickupLocations: splitCommas(formData.get("pickupLocations")),
      minGuests: formData.get("minGuests") ? Number(formData.get("minGuests")) : null,
      maxGuests: formData.get("maxGuests") ? Number(formData.get("maxGuests")) : null,
      fitnessLevel: String(formData.get("fitnessLevel") ?? ""),
      bestFor: splitCommas(formData.get("bestFor")),
      languages: splitCommas(formData.get("languages")),
      transportation: String(formData.get("transportation") ?? ""),
      guideInfo: String(formData.get("guideInfo") ?? ""),
      foodAndDrinks: String(formData.get("foodAndDrinks") ?? ""),
      importantInfo: splitLines(formData.get("importantInfo")),
      bringList: splitCommas(formData.get("bringList")),
      cancellationPolicy: splitLines(formData.get("cancellationPolicy")),
      availabilityNote: String(formData.get("availabilityNote") ?? ""),
      teyezillaMoment: String(formData.get("teyezillaMoment") ?? ""),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      ogImage: String(formData.get("ogImage") ?? ""),
      destinationIds,
      primaryDestinationId,
      journeyTypeIds,
      experienceTypeIds,
      safariThemeIds,
      pricingTiers,
      highlights,
      faqs,
      addons,
      activityIds,
      vehicleIds,
      accommodationIds,
      tourIds,
      relatedJourneyIds,
      relatedTourIds,
      relatedBlogPostIds,
      featured: formData.get("featured") === "on",
      status: String(formData.get("status") ?? "draft"),
    };

    try {
      if (existingJourney) {
        await updateJourney(existingJourney.id, input);
      } else {
        await createJourney(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save journey.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingJourney) return;
    if (!confirm(`Delete "${existingJourney.title}"? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteJourney(existingJourney.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete journey.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Basic Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="text-xs font-medium text-foreground/60">Journey Title</label>
            <input id="title" name="title" required defaultValue={existingJourney?.title} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <MediaPickerField id="heroImage" name="heroImage" label="Hero Image URL" value={heroImage} onChange={setHeroImage} mediaItems={mediaItems} />
          </div>
          {/* Hidden from the UI per product decision; kept in the payload so existing values survive a save. */}
          <input type="hidden" name="productType" value={existingJourney?.productType ?? "signature_journey"} />
          <div>
            <label htmlFor="difficulty" className="text-xs font-medium text-foreground/60">Difficulty (optional)</label>
            <select id="difficulty" name="difficulty" defaultValue={existingJourney?.difficulty ?? ""} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Not set</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>
          <div>
            <label htmlFor="durationDays" className="text-xs font-medium text-foreground/60">Duration (days)</label>
            <input id="durationDays" name="durationDays" type="number" min={1} defaultValue={existingJourney?.durationDays} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="priceFrom" className="text-xs font-medium text-foreground/60">Price From</label>
            <input id="priceFrom" name="priceFrom" type="number" min={0} defaultValue={existingJourney?.priceFrom} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="currency" className="text-xs font-medium text-foreground/60">Currency</label>
            <select id="currency" name="currency" defaultValue={existingJourney?.currency ?? "USD"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD</option>
              <option>EUR</option>
              <option>KES</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="tagline" className="text-xs font-medium text-foreground/60">Tagline</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Short and punchy -- this is what shows on the card, not the Overview below.</p>
          <input id="tagline" name="tagline" maxLength={80} defaultValue={existingJourney?.tagline} placeholder="e.g. A multi-country expedition across East Africa" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="mt-4">
          <label htmlFor="shortDescription" className="text-xs font-medium text-foreground/60">Overview</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Shown on the detail page, not the card -- 250 characters max.</p>
          <textarea id="shortDescription" name="shortDescription" maxLength={250} defaultValue={existingJourney?.shortDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="mt-4">
          <label htmlFor="overview" className="text-xs font-medium text-foreground/60">Journey Story (Full Description)</label>
          <textarea id="overview" name="overview" defaultValue={existingJourney?.overview} rows={4} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Destinations</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Select every country this journey visits, then choose which one is primary.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {destinations.map((d) => (
            <label key={d.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={destinationIds.includes(d.id)} onChange={() => toggleDestination(d.id)} />
              {d.countryName}
            </label>
          ))}
        </div>
        {destinationIds.length > 0 && (
          <div className="mt-4">
            <label htmlFor="primaryDestinationId" className="text-xs font-medium text-foreground/60">Primary Destination</label>
            <select
              id="primaryDestinationId"
              value={primaryDestinationId}
              onChange={(e) => setPrimaryDestinationId(e.target.value)}
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-64"
            >
              {destinationIds.map((id) => {
                const d = destinations.find((dest) => dest.id === id);
                return <option key={id} value={id}>{d?.countryName ?? id}</option>;
              })}
            </select>
          </div>
        )}
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Journey Type, Experiences & Safari Themes</h2>
        <p className="mt-1 text-xs text-foreground/50">
          These control site navigation and rarely change -- to add a new one, ask your developer, or edit
          it directly in Supabase &rarr; Table Editor.
        </p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-foreground/60">Journey Types</p>
            <div className="mt-2 space-y-1.5">
              {journeyTypes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={journeyTypeIds.includes(t.id)} onChange={() => toggleId(journeyTypeIds, setJourneyTypeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/60">Experience Types</p>
            <div className="mt-2 space-y-1.5">
              {experienceTypes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={experienceTypeIds.includes(t.id)} onChange={() => toggleId(experienceTypeIds, setExperienceTypeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground/60">Safari Themes</p>
            <div className="mt-2 space-y-1.5">
              {safariThemes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={safariThemeIds.includes(t.id)} onChange={() => toggleId(safariThemeIds, setSafariThemeIds, t.id)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HighlightsEditor highlights={highlights} onChange={setHighlights} />

      <FaqsEditor faqs={faqs} onChange={setFaqs} />

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Inclusions & Exclusions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inclusions" className="text-xs font-medium text-foreground/60">Inclusions (one per line)</label>
            <textarea id="inclusions" name="inclusions" rows={4} defaultValue={existingJourney?.inclusions?.join("\n")} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="exclusions" className="text-xs font-medium text-foreground/60">Exclusions (one per line)</label>
            <textarea id="exclusions" name="exclusions" rows={4} defaultValue={existingJourney?.exclusions?.join("\n")} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <ItineraryEditor itinerary={itinerary} onChange={setItinerary} />

      <PricingTiersEditor tiers={pricingTiers} onChange={setPricingTiers} />
      <AddonsEditor addons={addons} onChange={setAddons} />
      <ActivitiesPicker activities={activities} selectedIds={activityIds} onChange={setActivityIds} />
      <VehiclesPicker vehicles={vehicles} selectedIds={vehicleIds} onChange={setVehicleIds} />
      <AccommodationsPicker accommodations={accommodations} selectedIds={accommodationIds} onChange={setAccommodationIds} />
      <TourPicker tours={tours} selectedIds={tourIds} onChange={setTourIds} />

      <RelatedContentEditor
        journeys={otherJourneys.map((j) => ({ id: j.id, label: j.title }))}
        tours={tours.map((t) => ({ id: t.id, label: t.title }))}
        blogPosts={blogPosts.map((p) => ({ id: p.id, label: p.title }))}
        relatedJourneyIds={relatedJourneyIds}
        onChangeRelatedJourneyIds={setRelatedJourneyIds}
        relatedTourIds={relatedTourIds}
        onChangeRelatedTourIds={setRelatedTourIds}
        relatedBlogPostIds={relatedBlogPostIds}
        onChangeRelatedBlogPostIds={setRelatedBlogPostIds}
      />

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Logistics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="meetingPoint" className="text-xs font-medium text-foreground/60">Meeting Point</label>
            <input id="meetingPoint" name="meetingPoint" defaultValue={existingJourney?.meetingPoint} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="pickupLocations" className="text-xs font-medium text-foreground/60">Pickup Locations (comma-separated)</label>
            <input id="pickupLocations" name="pickupLocations" defaultValue={existingJourney?.pickupLocations?.join(", ")} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="minGuests" className="text-xs font-medium text-foreground/60">Min Guests</label>
            <input id="minGuests" name="minGuests" type="number" min={1} defaultValue={existingJourney?.minGuests ?? undefined} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="maxGuests" className="text-xs font-medium text-foreground/60">Max Guests</label>
            <input id="maxGuests" name="maxGuests" type="number" min={1} defaultValue={existingJourney?.maxGuests ?? undefined} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="fitnessLevel" className="text-xs font-medium text-foreground/60">Fitness Level</label>
            <input id="fitnessLevel" name="fitnessLevel" defaultValue={existingJourney?.fitnessLevel} placeholder="Easy to Moderate" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="bestFor" className="text-xs font-medium text-foreground/60">Best For (comma-separated)</label>
            <input id="bestFor" name="bestFor" defaultValue={existingJourney?.bestFor?.join(", ")} placeholder="Couples, Families, Photographers" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="languages" className="text-xs font-medium text-foreground/60">Languages (comma-separated)</label>
            <input id="languages" name="languages" defaultValue={existingJourney?.languages?.join(", ")} placeholder="English" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="transportation" className="text-xs font-medium text-foreground/60">Transportation</label>
            <input id="transportation" name="transportation" defaultValue={existingJourney?.transportation} placeholder="Private 4x4 Safari Vehicle" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="guideInfo" className="text-xs font-medium text-foreground/60">Guide Information</label>
            <input id="guideInfo" name="guideInfo" defaultValue={existingJourney?.guideInfo} placeholder="Dedicated Professional Safari Guide" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="foodAndDrinks" className="text-xs font-medium text-foreground/60">Food & Drinks</label>
            <input id="foodAndDrinks" name="foodAndDrinks" defaultValue={existingJourney?.foodAndDrinks} placeholder="Full Board" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="availabilityNote" className="text-xs font-medium text-foreground/60">Availability</label>
            <input id="availabilityNote" name="availabilityNote" defaultValue={existingJourney?.availabilityNote} placeholder="Migration Season" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="bringList" className="text-xs font-medium text-foreground/60">What to Bring (comma-separated)</label>
            <input id="bringList" name="bringList" defaultValue={existingJourney?.bringList?.join(", ")} placeholder="Neutral-coloured clothing, Binoculars, Camera" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="importantInfo" className="text-xs font-medium text-foreground/60">Important Information / Good to Know (one per line)</label>
          <textarea
            id="importantInfo"
            name="importantInfo"
            defaultValue={existingJourney?.importantInfo?.join("\n")}
            rows={6}
            placeholder={"Hotel pickup available from selected Nairobi locations.\nStandard pickup time is approximately 6:30 AM.\nNot recommended for guests with serious back or heart conditions."}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="cancellationPolicy" className="text-xs font-medium text-foreground/60">Cancellation & Refund Policy (one per line)</label>
          <textarea
            id="cancellationPolicy"
            name="cancellationPolicy"
            defaultValue={existingJourney?.cancellationPolicy?.join("\n")}
            rows={4}
            placeholder={"Free cancellation up to 14 days before departure.\n50% refund for cancellations within 7-14 days.\nNo refund within 7 days of departure."}
            className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="teyezillaMoment" className="text-xs font-medium text-foreground/60">Your Teyezilla Moment (standalone highlighted callout)</label>
          <textarea id="teyezillaMoment" name="teyezillaMoment" defaultValue={existingJourney?.teyezillaMoment} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">SEO</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="metaTitle" className="text-xs font-medium text-foreground/60">Meta Title</label>
            <input id="metaTitle" name="metaTitle" defaultValue={existingJourney?.metaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="metaDescription" className="text-xs font-medium text-foreground/60">Meta Description</label>
            <textarea id="metaDescription" name="metaDescription" defaultValue={existingJourney?.metaDescription} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="ogImage" className="text-xs font-medium text-foreground/60">Social Share Image URL</label>
            <input id="ogImage" name="ogImage" defaultValue={existingJourney?.ogImage} placeholder="https://..." className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <label htmlFor="featured" className="flex items-center gap-2 text-sm">
            <input id="featured" name="featured" type="checkbox" defaultChecked={existingJourney?.featured} /> Featured journey
          </label>
          <select id="status" name="status" defaultValue={existingJourney?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          {existingJourney && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save Journey"}
          </button>
        </div>
      </section>
    </form>
  );
}
