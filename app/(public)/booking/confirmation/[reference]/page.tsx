import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { whatsappLink } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Enquiry Received",
  description: "Your enquiry has been received. Our travel team will reply within 24 hours.",
};

interface EnquirySummary {
  travelDate: string | null;
  flexibleDates: boolean;
  adults: number | null;
  children: number | null;
  budgetRange: string | null;
  productTitle: string;
  totalAmount: number;
  currency: string;
  addons: { title: string; price: number }[];
}

// Anonymous visitors can't read the bookings table (insert-only RLS), so the
// summary is looked up with the service-role client. Without it we still show
// the reference and next steps; the enquiry itself has already landed.
async function getEnquiry(reference: string): Promise<EnquirySummary | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, travel_date, flexible_dates, adults, children, budget_range, total_amount, currency, tour:tours(title), journey:journeys(title), booking_addons(title, price)"
    )
    .eq("booking_reference", reference)
    .maybeSingle();

  if (error || !data) return null;
  // Without generated DB types, supabase-js can't know tour_id/journey_id
  // are to-one relationships, so it infers embedded selects as arrays
  // regardless -- cast at the point of use, matching how every other
  // mapRow-style function in this codebase handles the same shape.
  const tour = data.tour as unknown as { title: string } | null;
  const journey = data.journey as unknown as { title: string } | null;
  return {
    travelDate: data.travel_date,
    flexibleDates: Boolean(data.flexible_dates),
    adults: data.adults,
    children: data.children,
    budgetRange: data.budget_range,
    productTitle: tour?.title ?? journey?.title ?? "your chosen journey",
    totalAmount: Number(data.total_amount ?? 0),
    currency: data.currency ?? "USD",
    addons: (data.booking_addons ?? []).map((a: { title: string; price: number }) => ({
      title: a.title,
      price: Number(a.price),
    })),
  };
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const enquiry = await getEnquiry(reference);

  return (
    <div className="section max-w-2xl text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 h1-page">
        Thank you, your enquiry is in!
      </h1>
      <p className="mt-3 text-foreground/70">
        Our travel team will get back to you within 24 hours with a personal quote.
      </p>

      <div className="card mx-auto mt-8 max-w-md p-6 text-left">
        <p className="text-xs uppercase tracking-wide text-foreground/50">Your enquiry reference</p>
        <p className="mt-1 font-heading text-2xl font-bold text-primary">{reference}</p>
        {enquiry && (
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/50">Enquiring about</dt>
              <dd className="text-right font-medium text-foreground">{enquiry.productTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/50">Travel date</dt>
              <dd className="font-medium text-foreground">
                {enquiry.flexibleDates || !enquiry.travelDate ? "Flexible" : enquiry.travelDate}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/50">Travelers</dt>
              <dd className="font-medium text-foreground">
                {enquiry.adults ?? "-"} adult(s){enquiry.children ? `, ${enquiry.children} child(ren)` : ""}
              </dd>
            </div>
            {enquiry.budgetRange && (
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/50">Budget per person</dt>
                <dd className="font-medium text-foreground">{enquiry.budgetRange}</dd>
              </div>
            )}
            {enquiry.addons.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/50">Add-ons requested</dt>
                <dd className="text-right font-medium text-foreground">
                  {enquiry.addons.map((a) => a.title).join(", ")}
                </dd>
              </div>
            )}
            {enquiry.totalAmount > 0 && (
              <div className="flex justify-between gap-4 border-t border-secondary/10 pt-2">
                <dt className="text-foreground/50">Estimated total (starting)</dt>
                <dd className="font-heading font-bold text-accent">
                  {enquiry.currency} {enquiry.totalAmount.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-secondary/10 p-6 text-left">
        <h2 className="font-heading text-lg font-semibold text-foreground">What happens next</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground/70">
          <li>A travel consultant reviews your enquiry and preferred dates.</li>
          <li>We reply by email or WhatsApp with a tailored quote, usually within 24 hours.</li>
          <li>Once you&apos;re happy, we confirm your journey and arrange payment offline.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={whatsappLink(
            enquiry && enquiry.totalAmount > 0
              ? `Hi! I just sent enquiry ${reference}${
                  enquiry.addons.length > 0 ? ` with add-ons: ${enquiry.addons.map((a) => a.title).join(", ")}` : ""
                }. Estimated total: ${enquiry.currency} ${enquiry.totalAmount.toLocaleString()}. I'd love to chat about it.`
              : `Hi! I just sent enquiry ${reference}. I'd love to chat about it.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Chat on WhatsApp
        </a>
        <Link href="/" className="btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
