import PageHeader from "@/components/admin/PageHeader";
import { getSiteSetting } from "@/lib/settings";
import { updateSiteSetting } from "@/lib/admin/actions/settings";

export default async function AdminSettingsPage() {
  const happyTravelersCount = (await getSiteSetting("happy_travelers_count")) ?? "";

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

      <form className="space-y-6">
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Company Information</h2>
          <div>
            <label htmlFor="companyName" className="text-xs font-medium text-foreground/60">Company Name</label>
            <input id="companyName" name="companyName" defaultValue="Teyezilla Expeditions" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="tagline" className="text-xs font-medium text-foreground/60">Tagline</label>
            <input id="tagline" name="tagline" defaultValue="Extraordinary Journeys Across Africa" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="contactEmail" className="text-xs font-medium text-foreground/60">Contact Email</label>
            <input id="contactEmail" name="contactEmail" defaultValue="hello@teyezillaexpeditions.com" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="whatsappNumber" className="text-xs font-medium text-foreground/60">WhatsApp Number</label>
            <input id="whatsappNumber" name="whatsappNumber" defaultValue="254700000000" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Social Links</h2>
          <input id="instagramUrl" name="instagramUrl" placeholder="Instagram URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="facebookUrl" name="facebookUrl" placeholder="Facebook URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="tiktokUrl" name="tiktokUrl" placeholder="TikTok URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input id="youtubeUrl" name="youtubeUrl" placeholder="YouTube URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Currency & Language</h2>
          <div>
            <label htmlFor="defaultCurrency" className="text-xs font-medium text-foreground/60">Default Currency</label>
            <select id="defaultCurrency" name="defaultCurrency" defaultValue="USD" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD</option><option>EUR</option><option>KES</option>
            </select>
          </div>
          <div>
            <label htmlFor="defaultLanguage" className="text-xs font-medium text-foreground/60">Default Language</label>
            <select id="defaultLanguage" name="defaultLanguage" defaultValue="EN" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>EN</option><option>FR</option><option>SW</option>
            </select>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">SEO Defaults</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="defaultMetaTitle" className="text-xs font-medium text-foreground/60">Default Meta Title</label>
              <input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue="Teyezilla Expeditions | Extraordinary Journeys Across Africa" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="defaultMetaDescription" className="text-xs font-medium text-foreground/60">Default Meta Description</label>
              <textarea id="defaultMetaDescription" name="defaultMetaDescription" rows={2} defaultValue="Discover Africa with Teyezilla Expeditions." className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Email Templates</h2>
          <p className="mt-1 text-xs text-foreground/50">
            Booking confirmation, payment receipt, and follow-up templates connect here
            once Brevo/Mailchimp is wired up in Phase 4.
          </p>
        </section>

        <button type="submit" className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
