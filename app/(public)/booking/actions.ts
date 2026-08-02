"use server";

import { redirect } from "next/navigation";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/admin/actions/notifications";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import {
  adminEnquiryEmail,
  customerEnquiryConfirmationEmail,
  type EmailField,
} from "@/lib/email-templates";
import {
  bookingEnquirySchema,
  zodFieldErrors,
  whatsappLink,
  SITE_URL,
  type EnquiryFormState,
} from "@/lib/enquiry-shared";
import { countryCodeForName, generateBookingReference } from "@/lib/country-codes";
import { captureServerActionError } from "@/lib/monitoring";

interface ProductRef {
  id: string;
  title: string;
  kind: "tour" | "journey";
  countryName: string | null;
}

async function lookupProduct(tourSlug: string, journeySlug: string): Promise<ProductRef | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  if (tourSlug) {
    const { data } = await supabase
      .from("tours")
      .select("id, title, destinations(country_name)")
      .eq("slug", tourSlug)
      .maybeSingle();
    if (data) {
      const destination = data.destinations as unknown as { country_name: string } | null;
      return { id: data.id, title: data.title, kind: "tour", countryName: destination?.country_name ?? null };
    }
  }
  if (journeySlug) {
    const { data } = await supabase
      .from("journeys")
      .select("id, title, journey_destinations(is_primary, display_order, destinations(country_name))")
      .eq("slug", journeySlug)
      .maybeSingle();
    if (data) {
      const legs = (data.journey_destinations ?? []) as unknown as Array<{
        is_primary: boolean;
        display_order: number | null;
        destinations: { country_name: string } | null;
      }>;
      const primary =
        legs.find((l) => l.is_primary) ??
        [...legs].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0];
      return { id: data.id, title: data.title, kind: "journey", countryName: primary?.destinations?.country_name ?? null };
    }
  }
  return null;
}

export async function submitBookingEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const parsed = bookingEnquirySchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    travelDate: formData.get("travelDate") ?? "",
    flexibleDates: formData.get("flexibleDates") === "on",
    adults: formData.get("adults"),
    children: formData.get("children") || 0,
    childrenAges: formData.get("childrenAges") ?? "",
    budgetRange: formData.get("budgetRange") ?? "",
    specialRequests: formData.get("specialRequests") ?? "",
    referralSource: formData.get("referralSource") ?? "",
    tourSlug: formData.get("tourSlug") ?? "",
    journeySlug: formData.get("journeySlug") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }
  const input = parsed.data;

  // Writes go through the service-role client when configured (lets us upsert
  // the customer by email); otherwise fall back to the anon client, which the
  // RLS policies allow to INSERT enquiries but never read/update.
  const service = getSupabaseServiceClient();
  const db = service ?? getSupabasePublicClient();
  if (!db) {
    captureServerActionError("booking", "Supabase not configured -- both service and public clients unavailable.");
    return { formError: "Our enquiry system is temporarily unavailable. Please email us or reach out on WhatsApp." };
  }

  const product = await lookupProduct(input.tourSlug, input.journeySlug);
  if (!product) {
    return { fieldErrors: { tourSlug: "We couldn't find that tour or journey. Please pick one from the list." } };
  }

  // 1. Upsert customer by email (create if new; refresh name/phone if existing).
  let customerId: string | null = null;
  if (service) {
    const { data, error } = await db
      .from("customers")
      .upsert(
        { email: input.email, full_name: input.fullName, phone: input.phone },
        { onConflict: "email" }
      )
      .select("id")
      .single();
    if (error) {
      captureServerActionError("booking", `customer upsert failed: ${error.message}`, { email: input.email });
    } else {
      customerId = data?.id ?? null;
    }
  } else {
    // Anon path: insert-only. If the email already exists we can't read the
    // row back, so the booking simply isn't linked to a customer record.
    const { data, error } = await db
      .from("customers")
      .insert({ email: input.email, full_name: input.fullName, phone: input.phone })
      .select("id")
      .maybeSingle();
    if (!error && data) customerId = data.id;
  }

  // 2. Insert the booking enquiry (retry once on a reference collision).
  const bookingRow = {
    customer_id: customerId,
    tour_id: product.kind === "tour" ? product.id : null,
    journey_id: product.kind === "journey" ? product.id : null,
    travel_date: input.travelDate || null,
    flexible_dates: input.flexibleDates,
    traveler_count: input.adults + input.children,
    adults: input.adults,
    children: input.children,
    children_ages: input.children > 0 ? input.childrenAges || null : null,
    budget_range: input.budgetRange || null,
    special_requests: input.specialRequests || null,
    referral_source: input.referralSource || null,
    country_of_residence: input.country,
    booking_status: "inquiry",
    payment_status: "unpaid",
  };

  const countryCode = countryCodeForName(product.countryName);

  let bookingId: string | null = null;
  let bookingReference = "";
  let bookingInserted = false;
  for (let attempt = 0; attempt < 2 && !bookingInserted; attempt++) {
    bookingReference = generateBookingReference(countryCode);
    const insertQuery = db.from("bookings").insert({ ...bookingRow, booking_reference: bookingReference });
    // The anon client's RLS on `bookings` is insert-only (no select policy),
    // so chaining .select() to read the id back turns this into a single
    // `INSERT ... RETURNING` statement that fails the RLS check entirely --
    // even though a plain insert without RETURNING succeeds. Only ask for
    // the row back when writing through the service-role client, which
    // bypasses RLS; the anon path just doesn't get a bookingId (already
    // handled as optional everywhere it's used below).
    const { data, error } = service ? await insertQuery.select("id").maybeSingle() : await insertQuery;
    if (error) {
      if (attempt === 1) {
        captureServerActionError("booking", `booking insert failed: ${error.message}`, { email: input.email });
        return { formError: "Something went wrong saving your enquiry. Please try again or contact us on WhatsApp." };
      }
    } else {
      bookingInserted = true;
      bookingId = (data as { id: string } | null)?.id ?? null;
    }
  }

  // 3. Mirror the enquiry into the inquiries inbox.
  const summaryLines = [
    `Enquiry for ${product.kind}: ${product.title}`,
    `Reference: ${bookingReference}`,
    `Travel date: ${input.travelDate || "Flexible"}${input.flexibleDates ? " (dates flexible)" : ""}`,
    `Travelers: ${input.adults} adult(s)${input.children > 0 ? `, ${input.children} child(ren), ages: ${input.childrenAges || "not given"}` : ""}`,
    `Country of residence: ${input.country}`,
    input.budgetRange ? `Budget per person: ${input.budgetRange}` : "",
    input.referralSource ? `Heard about us via: ${input.referralSource}` : "",
    input.specialRequests ? `Special requests: ${input.specialRequests}` : "",
  ].filter(Boolean);

  const { error: inquiryError } = await db.from("inquiries").insert({
    source: "website",
    customer_name: input.fullName,
    customer_email: input.email,
    customer_phone: input.phone,
    tour_id: product.kind === "tour" ? product.id : null,
    journey_id: product.kind === "journey" ? product.id : null,
    message: summaryLines.join("\n"),
    status: "new",
    // Links this mirror row back to the booking so admin "new enquiry"
    // counts only count the lead once instead of once per table.
    booking_id: bookingId,
  });
  if (inquiryError) captureServerActionError("booking", `inquiry insert failed: ${inquiryError.message}`, { email: input.email });

  // 4. Admin notification (fail-soft, never block the submission).
  await createNotification({
    type: "new_booking",
    message: `New enquiry for ${product.title} (${bookingReference}) from ${input.fullName}.`,
  });

  // 5. Emails (fail-soft, never block the submission).
  const emailFields: EmailField[] = [
    { label: "Reference", value: bookingReference },
    { label: `${product.kind === "tour" ? "Tour" : "Journey"}`, value: product.title },
    { label: "Name", value: input.fullName },
    { label: "Email", value: input.email },
    { label: "Phone / WhatsApp", value: input.phone },
    { label: "Country", value: input.country },
    { label: "Travel date", value: input.travelDate || "Flexible" },
    { label: "Flexible dates", value: input.flexibleDates ? "Yes" : "No" },
    { label: "Adults", value: String(input.adults) },
    { label: "Children", value: input.children > 0 ? `${input.children} (ages: ${input.childrenAges || "not given"})` : "0" },
    { label: "Budget per person", value: input.budgetRange },
    { label: "Heard about us via", value: input.referralSource },
    { label: "Special requests", value: input.specialRequests },
  ];

  await sendAdminNotification({
    subject: `New booking enquiry ${bookingReference}: ${product.title}`,
    html: adminEnquiryEmail({
      heading: `New booking enquiry from ${input.fullName}`,
      fields: emailFields,
      adminUrl: bookingId ? `${SITE_URL}/admin/bookings/${bookingId}` : undefined,
    }),
  });

  await sendCustomerConfirmation({
    to: input.email,
    subject: `We've received your enquiry: ${bookingReference}`,
    html: customerEnquiryConfirmationEmail({
      customerName: input.fullName,
      bookingReference,
      enquiryTitle: product.title,
      fields: emailFields.slice(0, 10),
      whatsappUrl: whatsappLink(`Hi! I just sent enquiry ${bookingReference} about "${product.title}".`),
    }),
  });

  redirect(`/booking/confirmation/${bookingReference}`);
}
