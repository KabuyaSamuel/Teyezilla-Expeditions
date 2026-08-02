"use server";

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/admin/actions/notifications";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import {
  adminEnquiryEmail,
  customerTripPlannerConfirmationEmail,
  type EmailField,
} from "@/lib/email-templates";
import { tripPlannerSchema, zodFieldErrors, type EnquiryFormState } from "@/lib/enquiry-shared";
import { captureServerActionError } from "@/lib/monitoring";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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

  const { allowed } = await checkRateLimit("trip-planner", await getClientIp());
  if (!allowed) {
    return { formError: "You've submitted a few trip requests recently -- please wait a bit before sending another, or reach out on WhatsApp for anything urgent." };
  }

  const db = getSupabaseServiceClient() ?? getSupabasePublicClient();
  if (!db) {
    captureServerActionError("trip-planner", "Supabase not configured -- both service and public clients unavailable.");
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
    captureServerActionError("trip-planner", `request insert failed: ${requestError.message}`, { email: input.email });
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
  if (inquiryError) captureServerActionError("trip-planner", `inquiry insert failed: ${inquiryError.message}`, { email: input.email });

  await createNotification({
    type: "follow_up",
    message: `New trip planner request from ${input.name} for ${input.destination}.`,
  });

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
    subject: `New trip planner request from ${input.name}: ${input.destination}`,
    html: adminEnquiryEmail({ heading: `New trip planner request from ${input.name}`, fields }),
  });

  await sendCustomerConfirmation({
    to: input.email,
    subject: "We've received your trip request: Teyezilla Expeditions",
    html: customerTripPlannerConfirmationEmail({ customerName: input.name, fields: fields.slice(2) }),
  });

  return { success: true };
}
