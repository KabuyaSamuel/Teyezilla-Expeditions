"use client";

import { useEffect } from "react";
import { ATTRIBUTION_COOKIE, ATTRIBUTION_MAX_AGE_DAYS } from "@/lib/attribution";

// Last-touch link attribution: overwrites the cookie whenever a new
// ?utm_source/utm_medium/utm_campaign link brings a visitor in, so a
// booking/inquiry gets credited to whichever campaign most recently drove
// them back to the site. Silent no-op on any visit without utm params --
// the previous attribution (if any) just persists until overwritten or it
// expires.
export default function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    if (!utmSource && !utmMedium && !utmCampaign) return;

    const value = encodeURIComponent(
      JSON.stringify({ utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign })
    );
    const maxAge = ATTRIBUTION_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${ATTRIBUTION_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, []);

  return null;
}
