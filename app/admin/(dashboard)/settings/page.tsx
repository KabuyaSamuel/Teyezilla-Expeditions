import PageHeader from "@/components/admin/PageHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="Website Settings" description="Company info, contact details, currency, and SEO defaults." />
      <form className="space-y-6">
        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Company Information</h2>
          <div>
            <label className="text-xs font-medium text-foreground/60">Company Name</label>
            <input defaultValue="Teyezilla Expeditions" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Tagline</label>
            <input defaultValue="Extraordinary Journeys Across Africa" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Contact Email</label>
            <input defaultValue="hello@teyezillaexpeditions.com" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">WhatsApp Number</label>
            <input defaultValue="254700000000" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Social Links</h2>
          <input placeholder="Instagram URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input placeholder="Facebook URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input placeholder="TikTok URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input placeholder="YouTube URL" className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </section>

        <section className="card grid gap-4 p-6 sm:grid-cols-2">
          <h2 className="font-heading text-lg font-semibold text-foreground sm:col-span-2">Currency & Language</h2>
          <div>
            <label className="text-xs font-medium text-foreground/60">Default Currency</label>
            <select defaultValue="USD" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD</option><option>EUR</option><option>KES</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Default Language</label>
            <select defaultValue="EN" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option>EN</option><option>FR</option><option>SW</option>
            </select>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">SEO Defaults</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground/60">Default Meta Title</label>
              <input defaultValue="Teyezilla Expeditions | Extraordinary Journeys Across Africa" className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/60">Default Meta Description</label>
              <textarea rows={2} defaultValue="Discover Africa with Teyezilla Expeditions." className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
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
