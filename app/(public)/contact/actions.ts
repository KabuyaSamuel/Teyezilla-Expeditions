"use server";

import { cookies } from "next/headers";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/admin/actions/notifications";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import { adminEnquiryEmail, customerContactConfirmationEmail } from "@/lib/email-templates";
import { contactSchema, zodFieldErrors, type EnquiryFormState } from "@/lib/enquiry-shared";
import { captureServerActionError } from "@/lib/monitoring";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ATTRIBUTION_COOKIE, parseAttributionCookie } from "@/lib/attribution";

export async function submitContactMessage(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { fieldErrors: zodFieldErrors(parsed.error) };
  }
  const input = parsed.data;

  const { allowed } = await checkRateLimit("contact", await getClientIp());
  if (!allowed) {
    return { formError: "You've sent a few messages recently -- please wait a bit before sending another, or reach out on WhatsApp for anything urgent." };
  }

  const db = getSupabaseServiceClient() ?? getSupabasePublicClient();
  if (!db) {
    captureServerActionError("contact", "Supabase not configured -- both service and public clients unavailable.");
    return { formError: "Our contact form is temporarily unavailable. Please email us or reach out on WhatsApp." };
  }

  const cookieStore = await cookies();
  const attribution = parseAttributionCookie(cookieStore.get(ATTRIBUTION_COOKIE)?.value);

  const { data: inquiry, error } = await db
    .from("inquiries")
    .insert({
      source: "contact_form",
      customer_name: input.name,
      customer_email: input.email,
      message: input.message,
      status: "new",
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
    })
    .select("id")
    .single();
  if (error) {
    captureServerActionError("contact", `inquiry insert failed: ${error.message}`, { email: input.email });
    return { formError: "Something went wrong sending your message. Please try again or contact us on WhatsApp." };
  }

  await createNotification({
    type: "follow_up",
    message: `New contact form message from ${input.name}.`,
    relatedType: "inquiry",
    relatedId: inquiry.id,
  });

  await sendAdminNotification({
    subject: `New contact form message from ${input.name}`,
    html: adminEnquiryEmail({
      heading: `New contact form message from ${input.name}`,
      fields: [
        { label: "Name", value: input.name },
        { label: "Email", value: input.email },
        { label: "Message", value: input.message },
      ],
    }),
  });

  await sendCustomerConfirmation({
    to: input.email,
    subject: "We've received your message: Teyezilla Expeditions",
    html: customerContactConfirmationEmail({ customerName: input.name }),
  });

  return { success: true };
}
