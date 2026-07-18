import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import { getCoupons } from "@/lib/admin/data/coupons";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return (
    <div>
      <PageHeader
        title="Coupons & Promotions"
        description="Discount codes, referral codes, and seasonal offers."
        action={<button className="btn-primary text-sm">+ New Coupon</button>}
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Discount</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Usage</th>
              <th className="px-5 py-3">Expires</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{c.code}</td>
                <td className="px-5 py-3 text-foreground/70">
                  {c.discountType === "percentage" ? `${c.discountValue}%` : `$${c.discountValue}`}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={c.isReferral ? "info" : "neutral"}>{c.isReferral ? "Referral" : "Standard"}</Badge>
                </td>
                <td className="px-5 py-3 text-foreground/70">{c.usedCount} / {c.usageLimit}</td>
                <td className="px-5 py-3 text-foreground/70">{c.expiresAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
