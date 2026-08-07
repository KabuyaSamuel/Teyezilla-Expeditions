// Shared between the client-side capture (components/UtmCapture.tsx) and
// every server action that reads the cookie back at the point a
// booking/inquiry is created.

export const ATTRIBUTION_COOKIE = "teyezilla_attribution";
export const ATTRIBUTION_MAX_AGE_DAYS = 90;

export interface Attribution {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

const EMPTY_ATTRIBUTION: Attribution = { utmSource: null, utmMedium: null, utmCampaign: null };

export function parseAttributionCookie(value: string | undefined): Attribution {
  if (!value) return EMPTY_ATTRIBUTION;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return {
      utmSource: typeof parsed.utm_source === "string" ? parsed.utm_source : null,
      utmMedium: typeof parsed.utm_medium === "string" ? parsed.utm_medium : null,
      utmCampaign: typeof parsed.utm_campaign === "string" ? parsed.utm_campaign : null,
    };
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}
