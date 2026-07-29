import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getAffiliatePartners } from "@/lib/admin/data/affiliates";

export default async function AdminAffiliatesPage() {
  const affiliatePartners = await getAffiliatePartners();
  return (
    <div>
      <PageHeader
        title="Affiliate Management"
        description="Viator, GetYourGuide, Booking.com, Expedia, Klook, and other partners."
        action={
          <Link href="/admin/affiliates/new" className="btn-primary text-sm">
            + Add Partner
          </Link>
        }
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Partner</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Commission Rate</th>
              <th className="px-5 py-3">Notes</th>
              <th className="px-5 py-3"></th>
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
                <td className="px-5 py-3 text-foreground/70">{a.commissionRate ? `${a.commissionRate}%` : "-"}</td>
                <td className="px-5 py-3 text-foreground/70">{a.notes}</td>
                <td className="px-5 py-3">
                  <Link href={`/admin/affiliates/${a.id}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-xs text-foreground/60">
        Live booking sync and commission tracking with these partners is future work once deals are signed;
        this manages the partner records themselves.
      </div>
    </div>
  );
}
