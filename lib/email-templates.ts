// Template-literal HTML email builders. Shared layout: Forest Emerald Green
// header band, Warm Ivory background, gold accents — matching the site brand.
// All visitor-entered values must pass through escapeHtml before rendering.

const EMERALD = "#0F5D46";
const IVORY = "#F8F6F1";
const GOLD = "#C9A227";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailField {
  label: string;
  value: string;
}

function layout(title: string, bodyHtml: string): string {
  return `
<div style="background-color:${IVORY};padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2b2b2b;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e0d5;">
    <div style="background-color:${EMERALD};padding:24px 32px;">
      <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">Teyezilla Expeditions</p>
      <p style="margin:6px 0 0;color:${GOLD};font-size:13px;letter-spacing:1px;text-transform:uppercase;">${title}</p>
    </div>
    <div style="padding:28px 32px;font-size:15px;line-height:1.6;">
      ${bodyHtml}
    </div>
    <div style="background-color:${IVORY};padding:16px 32px;border-top:2px solid ${GOLD};">
      <p style="margin:0;font-size:12px;color:#6b6b6b;">Teyezilla Expeditions · Crafted African journeys · teyezillaexpeditions.com</p>
    </div>
  </div>
</div>`.trim();
}

function fieldsTable(fields: EmailField[]): string {
  const rows = fields
    .filter((f) => f.value)
    .map(
      (f) => `
      <tr>
        <td style="padding:6px 12px 6px 0;font-size:13px;color:#6b6b6b;white-space:nowrap;vertical-align:top;">${escapeHtml(f.label)}</td>
        <td style="padding:6px 0;font-size:14px;color:#2b2b2b;">${escapeHtml(f.value)}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0;">${rows}</table>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:20px 0 8px;"><a href="${href}" style="display:inline-block;background-color:${EMERALD};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;">${escapeHtml(label)}</a></p>`;
}

// ---------- Admin notifications ----------

export function adminEnquiryEmail({
  heading,
  fields,
  adminUrl,
}: {
  heading: string;
  fields: EmailField[];
  adminUrl?: string;
}): string {
  return layout(
    "New Enquiry",
    `
    <p style="margin:0 0 8px;font-size:16px;font-weight:bold;">${escapeHtml(heading)}</p>
    ${fieldsTable(fields)}
    ${adminUrl ? button(adminUrl, "Open in Admin") : ""}
    `
  );
}

// ---------- Customer confirmations ----------

export function customerEnquiryConfirmationEmail({
  customerName,
  bookingReference,
  enquiryTitle,
  fields,
  whatsappUrl,
}: {
  customerName: string;
  bookingReference?: string;
  enquiryTitle: string;
  fields: EmailField[];
  whatsappUrl?: string;
}): string {
  return layout(
    "Enquiry Received",
    `
    <p style="margin:0 0 12px;">Dear ${escapeHtml(customerName)},</p>
    <p style="margin:0 0 12px;">
      Thank you for enquiring about <strong>${escapeHtml(enquiryTitle)}</strong>.
      Our travel team has received your enquiry and will get back to you within 24 hours
      with a personal quote and suggestions.
    </p>
    ${
      bookingReference
        ? `<p style="margin:0 0 12px;">Your enquiry reference is
             <strong style="color:${EMERALD};">${escapeHtml(bookingReference)}</strong> —
             quote it in any follow-up so we can find your details instantly.</p>`
        : ""
    }
    ${fieldsTable(fields)}
    <p style="margin:16px 0 4px;font-weight:bold;color:${EMERALD};">What happens next</p>
    <ol style="margin:4px 0 12px;padding-left:20px;font-size:14px;">
      <li>A travel consultant reviews your enquiry and travel dates.</li>
      <li>We reply by email or WhatsApp with a tailored quote — usually within 24 hours.</li>
      <li>Once you're happy, we confirm your journey and arrange payment offline (bank transfer or invoice).</li>
    </ol>
    ${whatsappUrl ? button(whatsappUrl, "Chat with us on WhatsApp") : ""}
    <p style="margin:16px 0 0;">Warm regards,<br/>The Teyezilla Expeditions Team</p>
    `
  );
}

export function customerContactConfirmationEmail({ customerName }: { customerName: string }): string {
  return layout(
    "Message Received",
    `
    <p style="margin:0 0 12px;">Dear ${escapeHtml(customerName)},</p>
    <p style="margin:0 0 12px;">
      Thank you for reaching out to Teyezilla Expeditions. We've received your message
      and a member of our team will reply within 24 hours.
    </p>
    <p style="margin:16px 0 0;">Warm regards,<br/>The Teyezilla Expeditions Team</p>
    `
  );
}

export function customerTripPlannerConfirmationEmail({
  customerName,
  fields,
  whatsappUrl,
}: {
  customerName: string;
  fields: EmailField[];
  whatsappUrl?: string;
}): string {
  return layout(
    "Trip Request Received",
    `
    <p style="margin:0 0 12px;">Dear ${escapeHtml(customerName)},</p>
    <p style="margin:0 0 12px;">
      Thank you for sharing your dream trip with us. Our travel team will review your
      preferences and send you a suggested itinerary and quote within 24 hours.
    </p>
    ${fieldsTable(fields)}
    ${whatsappUrl ? button(whatsappUrl, "Chat with us on WhatsApp") : ""}
    <p style="margin:16px 0 0;">Warm regards,<br/>The Teyezilla Expeditions Team</p>
    `
  );
}

// ---------- Staff-triggered quote ----------

export function customerQuoteEmail({
  customerName,
  bookingReference,
  enquiryTitle,
  quotedAmount,
  currency,
  message,
}: {
  customerName: string;
  bookingReference: string;
  enquiryTitle: string;
  quotedAmount: number;
  currency: string;
  message: string;
}): string {
  return layout(
    "Your Quote",
    `
    <p style="margin:0 0 12px;">Dear ${escapeHtml(customerName)},</p>
    <p style="margin:0 0 12px;">
      Here is your quote for <strong>${escapeHtml(enquiryTitle)}</strong>
      (reference <strong style="color:${EMERALD};">${escapeHtml(bookingReference)}</strong>):
    </p>
    <p style="margin:16px 0;padding:16px 20px;background-color:${IVORY};border-left:4px solid ${GOLD};font-size:22px;font-weight:bold;color:${EMERALD};">
      ${escapeHtml(currency)} ${quotedAmount.toLocaleString()}
    </p>
    ${message ? `<p style="margin:0 0 12px;white-space:pre-line;">${escapeHtml(message)}</p>` : ""}
    <p style="margin:0 0 12px;">
      Reply to this email or message us on WhatsApp to confirm, adjust, or ask anything.
      Payment is arranged offline — bank transfer, invoice, or in person — once you're happy.
    </p>
    <p style="margin:16px 0 0;">Warm regards,<br/>The Teyezilla Expeditions Team</p>
    `
  );
}
