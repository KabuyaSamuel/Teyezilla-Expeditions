import { Resend } from "resend";
import { env } from "@/lib/env";

// Transactional email via Resend. Both senders fail soft: a missing API key
// or a failed send logs a warning and returns { sent: false }; the inquiry
// landing in the database is the critical path, email is only the
// notification layer on top, so a mail outage must never error a form
// submission. RESEND_API_KEY/ADMIN_NOTIFICATION_EMAIL/EMAIL_FROM are all
// deliberately optional in lib/env.ts's schema -- validating their
// presence would fight this file's own intentional fail-soft design.

export interface EmailResult {
  sent: boolean;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function send({ to, subject, html, text }: SendArgs): Promise<EmailResult> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set, skipping send:", subject);
    return { sent: false };
  }

  const from = env.EMAIL_FROM ?? "Teyezilla Expeditions <noreply@teyezillaexpeditions.com>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text ?? stripHtml(html),
    });
    if (error) {
      console.warn("[email] Resend send failed:", error.message);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.warn("[email] Resend send threw:", err instanceof Error ? err.message : err);
    return { sent: false };
  }
}

// Crude plain-text fallback so every email carries a `text` part even when
// the caller doesn't supply one.
function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendAdminNotification({
  subject,
  html,
  text,
}: {
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailResult> {
  const to = env.ADMIN_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL not set, skipping admin notification:", subject);
    return { sent: false };
  }
  return send({ to, subject, html, text });
}

export async function sendCustomerConfirmation({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailResult> {
  return send({ to, subject, html, text });
}
