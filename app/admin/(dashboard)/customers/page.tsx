import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getCustomers } from "@/lib/admin/data/customers";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  return (
    <div>
      <PageHeader
        title="Customer Management (CRM)"
        description="Profiles, booking history, and loyalty."
        action={
          <Link href="/admin/customers/new" className="btn-primary text-sm">
            + Add Customer
          </Link>
        }
      />
      <ResponsiveTable
        rows={customers}
        keyField={(c) => c.id}
        emptyMessage="No customers yet."
        columns={[
          { header: "Name", cell: (c) => c.fullName, className: "font-medium text-foreground" },
          { header: "Email", cell: (c) => c.email },
          { header: "Nationality", cell: (c) => c.nationality },
          { header: "Loyalty Points", cell: (c) => c.loyaltyPoints },
          { header: "", cell: (c) => <Link href={`/admin/customers/${c.id}`} className="text-primary hover:underline">View Profile</Link> },
        ]}
        renderMobileCard={(c) => (
          <>
            <MobileCardHeader
              title={c.fullName}
              subtitle={c.email}
              action={<Link href={`/admin/customers/${c.id}`} className="hover:underline">View Profile</Link>}
            />
            <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
              <MobileCardField label="Nationality" value={c.nationality || "-"} />
              <MobileCardField label="Loyalty Points" value={c.loyaltyPoints} />
            </div>
          </>
        )}
      />
    </div>
  );
}
