import { z } from "zod";

// Shared between the public enquiry forms (client components) and their
// server actions: zod schemas, select options, and small helpers. Keep this
// module framework-free so it can be imported from both sides.

export const SITE_URL = "https://www.teyezillaexpeditions.com";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254726584159";

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

// Full list of UN-recognized country / territory names, for the "Country of
// residence" select — kept here so both the form and the zod schema can
// validate against the same source of truth.
export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Republic of the)", "Congo (DR)", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba",
  "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other",
] as const;

export const bookingEnquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(200),
    email: z.string().trim().email("Please enter a valid email address.").max(320),
    phone: z.string().trim().min(7, "Please enter a phone or WhatsApp number.").max(30),
    country: z.string().trim().min(2, "Please enter your country of residence.").max(100),
    travelDate: z.string().trim().max(20).optional().default(""),
    flexibleDates: z.boolean().default(false),
    adults: z.coerce
      .number()
      .int("Adults must be a whole number.")
      .min(1, "At least 1 adult is required.")
      .max(50),
    children: z.coerce.number().int().min(0).max(20).default(0),
    childrenAges: z.string().trim().max(200).optional().default(""),
    budgetRange: z.string().trim().max(50).optional().default(""),
    specialRequests: z.string().trim().max(4000).optional().default(""),
    referralSource: z.string().trim().max(50).optional().default(""),
    tourSlug: z.string().trim().max(200).optional().default(""),
    journeySlug: z.string().trim().max(200).optional().default(""),
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
  name: z.string().trim().min(2, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  message: z.string().trim().min(5, "Please write a short message.").max(4000),
});

export const tripPlannerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(200),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  destination: z.string().trim().min(2, "Please choose a destination.").max(200),
  budgetUsd: z.coerce.number().positive("Budget must be a positive number.").max(10_000_000).optional(),
  days: z.coerce.number().int().min(1, "Trip length must be at least 1 day.").max(365),
  travelers: z.coerce.number().int().min(1, "At least 1 traveler is required.").max(50),
  travelStyle: z.string().trim().min(1, "Please choose a travel style.").max(100),
  luxuryLevel: z.string().trim().max(100).optional().default(""),
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
