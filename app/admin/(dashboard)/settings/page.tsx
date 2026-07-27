import PageHeader from "@/components/admin/PageHeader";
import { getSiteSetting } from "@/lib/settings";
import { updateSiteSetting, updateSiteSettings } from "@/lib/admin/actions/settings";

const SETTINGS_KEYS = [
  "companyName",
  "tagline",
  "contactEmail",
  "whatsappNumber",
  "instagramUrl",
  "facebookUrl",
  "tiktokUrl",
  "youtubeUrl",
  "defaultCurrency",
  "defaultLanguage",
  "defaultMetaTitle",
  "defaultMetaDescription",
] as const;

const DEFAULTS: Record<(typeof SETTINGS_KEYS)[number], string> = {
  companyName: "Teyezilla Expeditions",
  tagline: "Extraordinary Journeys Across Africa",
  contactEmail: "hello@teyezillaexpeditions.com",
  whatsappNumber: "254700000000",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  defaultCurrency: "USD",
  defaultLanguage: "EN",
  defaultMetaTitle: "Teyezilla Expeditions | Extraordinary Journeys Across Africa",
  defaultMetaDescription: "Discover Africa with Teyezilla Expeditions.",
};

export default async function AdminSettingsPage() {
  const happyTravelersCount = (await getSiteSetting("happy_travelers_count")) ?? "";

  const settingsValues = await Promise.all(SETTINGS_KEYS.map((key) => getSiteSetting(key)));
  const settings = Object.fromEntries(
    SETTINGS_KEYS.map((key, i) => [key, settingsValues[i] ?? DEFAULTS[key]])
  ) as Record<(typeof SETTINGS_KEYS)[number], string>;

  return (
    <div className="space-y-6">
      <PageHeader title="Website Settings" description="Company info, contact details, currency, and SEO defaults." />

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Homepage Content</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Shown in the &ldquo;Why Choose Teyezilla&rdquo; and stats sections on the homepage.
        </p>
        <form action={updateSiteSetting} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="key" value="happy_travelers_count" />
          <div>
            <label htmlFor="happyTravelersCount" className="text-xs font-medium text-foreground/60">
              Happy Travelers Count
            </label>
            <input
              id="happyTravelersCount"
              name="value"
              defaultValue={happyTravelersCount}
              className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">Save</button>
        </form>
      </section>

      <form action={updateSiteSettings} className="space-y-6">
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Company Information</h2>
          <div>
            <label htmlFor="companyName" className="text-xs font-medium text-foreground/60">Company Name</label>
            <input id="companyName" name="companyName" defaultValue={settings.companyName} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="tagline" className="text-xs font-medium text-foreground/60">Tagline</label>
            <input id="tagline" name="tagline" defaultValue={settings.tagline} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="text-xs font-medium text-foreground/60">Contact Email</label>
            <input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="text-xs font-medium text-foreground/60">WhatsApp Number</label>
            <input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsappNumber} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Social Links</h2>
          <input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl} placeholder="Instagram URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="facebookUrl" name="facebookUrl" defaultValue={settings.facebookUrl} placeholder="Facebook URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="tiktokUrl" name="tiktokUrl" defaultValue={settings.tiktokUrl} placeholder="TikTok URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="youtubeUrl" name="youtubeUrl" defaultValue={settings.youtubeUrl} placeholder="YouTube URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Currency & Language</h2>
          <div>
            <label htmlFor="defaultCurrency" className="text-xs font-medium text-foreground/60">Default Currency</label>
            <select id="defaultCurrency" name="defaultCurrency" defaultValue={settings.defaultCurrency} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD</option><option>EUR</option><option>KES</option>
            </select>
          </div>
          <div>
            <label htmlFor="defaultLanguage" className="text-xs font-medium text-foreground/60">Default Language</label>
            <select id="defaultLanguage" name="defaultLanguage" defaultValue={settings.defaultLanguage} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>EN</option><option>FR</option><option>SW</option>
            </select>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">SEO Defaults</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="defaultMetaTitle" className="text-xs font-medium text-foreground/60">Default Meta Title</label>
              <input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={settings.defaultMetaTitle} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="defaultMetaDescription" className="text-xs font-medium text-foreground/60">Default Meta Description</label>
              <textarea id="defaultMetaDescription" name="defaultMetaDescription" rows={2} defaultValue={settings.defaultMetaDescription} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Email Templates</h2>
          <p className="mt-1 text-xs text-foreground/50">
            Enquiry confirmations, quotes, and admin notifications are sent via Resend —
            templates live in <code>lib/email-templates.ts</code>.
          </p>
        </section>

        <button type="submit" className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
