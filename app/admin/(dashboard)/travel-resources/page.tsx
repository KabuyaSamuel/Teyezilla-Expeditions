import PageHeader from "@/components/admin/PageHeader";
import { getDestinations } from "@/lib/destinations";

export default async function AdminTravelResourcesPage() {
  const destinations = await getDestinations();
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
                <label htmlFor={`visa-${d.id}`} className="text-xs font-medium text-foreground/60">Visa Requirements</label>
                <textarea id={`visa-${d.id}`} name="visaInfo" defaultValue={d.visaInfo} rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor={`health-${d.id}`} className="text-xs font-medium text-foreground/60">Health & Vaccination Guidance</label>
                <textarea id={`health-${d.id}`} name="healthGuidance" placeholder="Yellow fever certificate, routine vaccinations..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor={`packing-${d.id}`} className="text-xs font-medium text-foreground/60">Packing List</label>
                <textarea id={`packing-${d.id}`} name="packingList" placeholder="Neutral-colored clothing, binoculars..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor={`insurance-${d.id}`} className="text-xs font-medium text-foreground/60">Travel Insurance Info</label>
                <textarea id={`insurance-${d.id}`} name="insuranceInfo" placeholder="Recommended providers, minimum coverage..." rows={2} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
