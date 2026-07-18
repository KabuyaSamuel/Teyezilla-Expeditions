import PageHeader from "@/components/admin/PageHeader";
import { destinations } from "@/lib/destinations";

export default function AdminTravelResourcesPage() {
  return (
    <div>
      <PageHeader
        title="Travel Resources"
        description="Visa requirements, packing lists, insurance, and health guidance per destination."
      />
      <div className="space-y-4">
        {destinations.filter((d) => d.isLaunchDestination).map((d) => (
          <div key={d.id} className="card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {d.flagEmoji} {d.countryName}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground/60">Visa Requirements</label>
                <textarea defaultValue={d.visaInfo} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60">Health & Vaccination Guidance</label>
                <textarea placeholder="Yellow fever certificate, routine vaccinations..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60">Packing List</label>
                <textarea placeholder="Neutral-colored clothing, binoculars..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground/60">Travel Insurance Info</label>
                <textarea placeholder="Recommended providers, minimum coverage..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
