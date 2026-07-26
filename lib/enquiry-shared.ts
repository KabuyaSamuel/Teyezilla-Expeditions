import { z } from "zod";

// Shared between the public enquiry forms (client components) and their
// server actions: zod schemas, select options, and small helpers. Keep this
// module framework-free so it can be imported from both sides.

export const SITE_URL = "https://www.teyezillaexpeditions.com";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254700000000";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "$5,000+",
  "Not sure yet",
] as const;

export const REFERRAL_SOURCES = [
  "Google",
  "Instagram",
  "TikTok",
  "Referral",
  "TripAdvisor",
  "Other",
] as const;

export const bookingEnquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z.string().trim().min(7, "Please enter a phone or WhatsApp number."),
    country: z.string().trim().min(2, "Please enter your country of residence."),
    travelDate: z.string().trim().optional().default(""),
    flexibleDates: z.boolean().default(false),
    adults: z.coerce.number().int("Adults must be a whole number.").min(1, "At least 1 adult is required."),
    children: z.coerce.number().int().min(0).default(0),
    childrenAges: z.string().trim().optional().default(""),
    budgetRange: z.string().trim().optional().default(""),
    specialRequests: z.string().trim().max(4000).optional().default(""),
    referralSource: z.string().trim().optional().default(""),
    tourSlug: z.string().trim().optional().default(""),
    journeySlug: z.string().trim().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (!data.travelDate && !data.flexibleDates) {
      ctx.addIssue({
        code: "custom",
        path: ["travelDate"],
        message: "Pick a preferred date or tick “My dates are flexible”.",
      });
    }
    if (!data.tourSlug && !data.journeySlug) {
      ctx.addIssue({
        code: "custom",
        path: ["tourSlug"],
        message: "Please choose the tour or journey you're enquiring about.",
      });
    }
  });

export type BookingEnquiryInput = z.infer<typeof bookingEnquirySchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(5, "Please write a short message.").max(4000),
});

export const tripPlannerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  destination: z.string().trim().min(2, "Please choose a destination."),
  budgetUsd: z.coerce.number().positive("Budget must be a positive number.").optional(),
  days: z.coerce.number().int().min(1, "Trip length must be at least 1 day."),
  travelers: z.coerce.number().int().min(1, "At least 1 traveler is required."),
  travelStyle: z.string().trim().min(1, "Please choose a travel style."),
  luxuryLevel: z.string().trim().optional().default(""),
});

// Field-level errors keyed by input name, plus an optional form-level error.
export interface EnquiryFormState {
  fieldErrors?: Record<string, string>;
  formError?: string;
  success?: boolean;
}

export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
