"use client";

import { useMemo, useState } from "react";
import { SITE_URL } from "@/lib/site";

const PRESETS = [
  { label: "Google Ads", source: "google", medium: "cpc" },
  { label: "Meta Ads (Facebook/Instagram)", source: "meta", medium: "cpc" },
  { label: "Instagram Bio", source: "instagram", medium: "social" },
  { label: "TikTok Bio", source: "tiktok", medium: "social" },
  { label: "Facebook Page", source: "facebook", medium: "social" },
  { label: "Email Newsletter", source: "email", medium: "email" },
  { label: "WhatsApp", source: "whatsapp", medium: "social" },
];

export default function LinkGenerator() {
  const [path, setPath] = useState("/");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    if (!source.trim()) return "";
    const params = new URLSearchParams();
    params.set("utm_source", source.trim());
    if (medium.trim()) params.set("utm_medium", medium.trim());
    if (campaign.trim()) params.set("utm_campaign", campaign.trim());
    const normalizedPath = path.trim() ? (path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`) : "/";
    return `${SITE_URL}${normalizedPath}?${params.toString()}`;
  }, [path, source, medium, campaign]);

  async function handleCopy() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Quick presets</h2>
        <p className="mt-1 text-xs text-foreground/50">Fills in source and medium for a common channel -- campaign name is still yours to fill in.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setSource(p.source);
                setMedium(p.medium);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                source === p.source && medium === p.medium
                  ? "bg-primary text-white"
                  : "bg-secondary/15 text-foreground/70 hover:bg-secondary/25"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="path" className="text-xs font-medium text-foreground/60">Page to link to</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">e.g. / for the homepage, /destinations/kenya, /tours/serengeti-safari</p>
          <input id="path" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="source" className="text-xs font-medium text-foreground/60">Source *</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">Where the click comes from, e.g. google, tiktok, instagram</p>
          <input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="tiktok" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="medium" className="text-xs font-medium text-foreground/60">Medium</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">The channel type, e.g. cpc, social, email</p>
          <input id="medium" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="social" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="campaign" className="text-xs font-medium text-foreground/60">Campaign name</label>
          <p className="mt-0.5 text-[11px] text-foreground/40">e.g. august-safari-promo -- whatever helps you tell campaigns apart later</p>
          <input id="campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="august-safari-promo" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Your link</h2>
        {generatedUrl ? (
          <>
            <p className="mt-3 break-all rounded-xl bg-secondary/10 p-4 text-sm text-foreground">{generatedUrl}</p>
            <button type="button" onClick={handleCopy} className="btn-primary mt-4 text-sm">
              {copied ? "Copied ✓" : "Copy Link"}
            </button>
          </>
        ) : (
          <p className="mt-3 text-sm text-foreground/50">Fill in at least a source above to generate a link.</p>
        )}
      </section>
    </div>
  );
}
