"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import {
  adminEnquiryEmail,
  customerTripPlannerConfirmationEmail,
  type EmailField,
} from "@/lib/email-templates";
import { tripPlannerSchema, zodFieldErrors, type EnquiryFormState } from "@/lib/enquiry-shared";

export async function submitTripPlannerRequest(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const parsed = tripPlannerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    destination: formData.get("destination"),
    budgetUsd: formData.get("budgetUsd") || undefined,
    days: formData.get("days"),
    travelers: formData.get("travelers"),
    travelStyle: formData.get("travelStyle"),
    luxuryLevel: formData.get("luxuryLevel") ?? "",
    extras: formData.getAll("extras"),
  });
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }
  const input = parsed.data;

  const db = getSupabaseServiceClient() ?? getSupabasePublicClient();
  if (!db) {
    return { formError: "The trip planner is temporarily unavailable. Please reach out on WhatsApp instead." };
  }

  const { error: requestError } = await db.from("trip_planner_requests").insert({
    customer_name: input.name,
    customer_email: input.email,
    destination: input.destination,
    budget_usd: input.budgetUsd ?? null,
    days: input.days,
    travelers: input.travelers,
    travel_style: input.travelStyle,
    luxury_level: input.luxuryLevel || null,
    extras: input.extras.length > 0 ? input.extras : null,
    status: "new",
  });
  if (requestError) {
    console.warn("[trip-planner] request insert failed:", requestError.message);
    return { formError: "Something went wrong submitting your trip request. Please try again or contact us on WhatsApp." };
  }

  const summary = [
    `Trip planner request: ${input.destination}, ${input.days} day(s), ${input.travelers} traveler(s)`,
    input.budgetUsd ? `Budget: $${input.budgetUsd} USD` : "",
    `Style: ${input.travelStyle}${input.luxuryLevel ? ` · ${input.luxuryLevel}` : ""}`,
    input.extras.length > 0 ? `Extras requested: ${input.extras.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const { error: inquiryError } = await db.from("inquiries").insert({
    source: "ai_trip_planner",
    customer_name: input.name,
    customer_email: input.email,
    message: summary,
    status: "new",
  });
  if (inquiryError) console.warn("[trip-planner] inquiry insert failed:", inquiryError.message);

  const fields: EmailField[] = [
    { label: "Name", value: input.name },
    { label: "Email", value: input.email },
    { label: "Destination", value: input.destination },
    { label: "Budget (USD)", value: input.budgetUsd ? `$${input.budgetUsd}` : "" },
    { label: "Days", value: String(input.days) },
    { label: "Travelers", value: String(input.travelers) },
    { label: "Travel style", value: input.travelStyle },
    { label: "Luxury level", value: input.luxuryLevel },
    { label: "Extras requested", value: input.extras.join(", ") },
  ];

  await sendAdminNotification({
    subject: `New trip planner request from ${input.name} — ${input.destination}`,
    html: adminEnquiryEmail({ heading: `New trip planner request from ${input.name}`, fields }),
  });

  await sendCustomerConfirmation({
    to: input.email,
    subject: "We've received your trip request — Teyezilla Expeditions",
    html: customerTripPlannerConfirmationEmail({ customerName: input.name, fields: fields.slice(2) }),
  });

  return { success: true };
}
