import { Award, ShieldCheck, Gem, Leaf } from "lucide-react";
import { getSiteSetting, resolveSiteText } from "@/lib/settings";
import { TRUST_INDICATORS_DEFAULTS, type TrustIndicatorKey } from "@/lib/homepageContent";

// Icons are fixed per position (structural, not editable) -- only the
// title/description text is admin-editable, via site_settings.
const ICONS = [Award, ShieldCheck, Gem, Leaf];

export default async function TrustIndicators() {
  const keys = Object.keys(TRUST_INDICATORS_DEFAULTS) as TrustIndicatorKey[];
  const values = await Promise.all(keys.map((key) => getSiteSetting(key)));
  const text = resolveSiteText(TRUST_INDICATORS_DEFAULTS, keys, values);

  const indicators = [
    { icon: ICONS[0], title: text.trustIndicator1Title, desc: text.trustIndicator1Desc },
    { icon: ICONS[1], title: text.trustIndicator2Title, desc: text.trustIndicator2Desc },
    { icon: ICONS[2], title: text.trustIndicator3Title, desc: text.trustIndicator3Desc },
    { icon: ICONS[3], title: text.trustIndicator4Title, desc: text.trustIndicator4Desc },
  ];

  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
      <div className="grid gap-6 rounded-2xl bg-primary px-8 py-10 shadow-cardHover sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
            <Icon className="h-6 w-6 shrink-0 text-accent sm:mt-0.5" />
            <div>
              <p className="font-heading text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs text-white/70">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
