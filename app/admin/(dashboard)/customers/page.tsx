import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { customers } from "@/lib/admin/data/customers";

export default function AdminCustomersPage() {
  return (
    <div>
      <PageHeader title="Customer Management (CRM)" description="Profiles, booking history, and loyalty." />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Nationality</th>
              <th className="px-5 py-3">Loyalty Points</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-secondary/10 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{c.fullName}</td>
                <td className="px-5 py-3 text-foreground/70">{c.email}</td>
                <td className="px-5 py-3 text-foreground/70">{c.nationality}</td>
                <td className="px-5 py-3 text-foreground/70">{c.loyaltyPoints}</td>
                <td className="px-5 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="text-primary hover:underline">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
