// African countries with ISO 3166-1 alpha-2 codes, used for both the
// destination flag selector and booking-reference country prefixes.
// Zanzibar isn't a sovereign country (it's part of Tanzania) but this app
// models it as its own destination, so it gets a distinct internal code
// rather than colliding with Tanzania's real ISO code.

export interface CountryOption {
  name: string;
  code: string;
}

export const AFRICAN_COUNTRIES: CountryOption[] = [
  { name: "Algeria", code: "DZ" },
  { name: "Angola", code: "AO" },
  { name: "Benin", code: "BJ" },
  { name: "Botswana", code: "BW" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cabo Verde", code: "CV" },
  { name: "Cameroon", code: "CM" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Comoros", code: "KM" },
  { name: "Congo (Republic)", code: "CG" },
  { name: "Congo (DRC)", code: "CD" },
  { name: "Djibouti", code: "DJ" },
  { name: "Egypt", code: "EG" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Eswatini", code: "SZ" },
  { name: "Ethiopia", code: "ET" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Ghana", code: "GH" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Kenya", code: "KE" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libya", code: "LY" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Mali", code: "ML" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Namibia", code: "NA" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Rwanda", code: "RW" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Senegal", code: "SN" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Sudan", code: "SS" },
  { name: "Sudan", code: "SD" },
  { name: "Tanzania", code: "TZ" },
  { name: "Togo", code: "TG" },
  { name: "Tunisia", code: "TN" },
  { name: "Uganda", code: "UG" },
  { name: "Zambia", code: "ZM" },
  { name: "Zanzibar", code: "ZZ" },
  { name: "Zimbabwe", code: "ZW" },
];

// Converts a 2-letter ISO code into its Unicode regional-indicator flag
// emoji (e.g. "KE" -> 🇰🇪). Zanzibar's "ZZ" isn't a real ISO code, so this
// mechanically produces a placeholder flag rather than a real one -- Africa
// map component below overrides it with Tanzania's actual flag.
export function flagEmojiForCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function flagEmojiForCountry(countryName: string): string {
  if (countryName === "Zanzibar") return flagEmojiForCode("TZ");
  const match = AFRICAN_COUNTRIES.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
  return match ? flagEmojiForCode(match.code) : "";
}

// Used for booking-reference prefixes (e.g. "KE-48213"). Falls back to "XX"
// for a product whose destination isn't in the African country list.
export function countryCodeForName(countryName: string | null | undefined): string {
  if (!countryName) return "XX";
  const match = AFRICAN_COUNTRIES.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
  return match?.code ?? "XX";
}

// Shared by every booking-creation path (public enquiry form, trip-planner
// conversion) so references consistently start with the destination
// country's code, e.g. "KE-48213" for a Kenya tour/journey, or "XX-" when
// no product/country is referenced (a bespoke trip-planner booking).
export function generateBookingReference(countryCode: string): string {
  return `${countryCode}-${Math.floor(10000 + Math.random() * 90000)}`;
}
