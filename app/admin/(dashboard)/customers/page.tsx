import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import { getCustomers } from "@/lib/admin/data/customers";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const { archived } = await searchParams;
  const showArchived = archived === "1";
  const customers = await getCustomers(showArchived ? { includeArchived: true } : {});
  const visibleCustomers = showArchived ? customers.filter((c) => c.archivedAt) : customers;

  return (
    <div>
      <PageHeader
        title={showArchived ? "Archived Customers" : "Customer Management (CRM)"}
        description={showArchived ? "Customers hidden from the active list. Their history is kept." : "Profiles, booking history, and loyalty."}
        action={
          <div className="flex items-center gap-3">
            <Link href={showArchived ? "/admin/customers" : "/admin/customers?archived=1"} className="text-sm text-primary hover:underline">
              {showArchived ? "Back to active customers" : "View archived"}
            </Link>
            {!showArchived && (
              <Link href="/admin/customers/new" className="btn-primary text-sm">
                + Add Customer
              </Link>
            )}
          </div>
        }
      />
      <ResponsiveTable
        rows={visibleCustomers}
        keyField={(c) => c.id}
        emptyMessage={showArchived ? "No archived customers." : "No customers yet."}
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
