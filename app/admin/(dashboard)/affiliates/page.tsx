import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAffiliatePartners } from "@/lib/admin/data/affiliates";

export default async function AdminAffiliatesPage() {
  const affiliatePartners = await getAffiliatePartners();
  return (
    <div>
      <PageHeader
        title="Affiliate Management"
        description="Future integration with Viator, GetYourGuide, Booking.com, Expedia, and Klook for commission-based bookings."
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Partner</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Commission Rate</th>
              <th className="px-5 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {affiliatePartners.map((a) => (
              <tr key={a.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{a.name}</td>
                <td className="px-5 py-3">
                  <Badge tone={a.status === "connected" ? "success" : "neutral"}>
                    {a.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-foreground/70">{a.commissionRate ? `${a.commissionRate}%` : "—"}</td>
                <td className="px-5 py-3 text-foreground/70">{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Per the Phase 3 spec, this module scaffolds the schema and a readonly view now;
        the full connect/commission-tracking UI is future work once affiliate deals are signed.
      </div>
    </div>
  );
}
