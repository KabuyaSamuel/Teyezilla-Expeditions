import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import LoyaltyPanel from "@/components/admin/LoyaltyPanel";
import { getCustomerById } from "@/lib/admin/data/customers";
import { getBookings } from "@/lib/admin/data/bookings";
import { getInquiries } from "@/lib/admin/data/inquiries";
import { getLoyaltyTransactions } from "@/lib/admin/data/loyalty";
import { getAdminSession } from "@/lib/admin/session";
import { bookingStatusTone, inquiryStatusTone } from "@/lib/admin/status-tone";
import { formatDateTime } from "@/lib/formatDate";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer, bookings, inquiries, loyaltyTransactions, session] = await Promise.all([
    getCustomerById(id),
    getBookings(),
    getInquiries(),
    getLoyaltyTransactions(id),
    getAdminSession(),
  ]);
  if (!customer) notFound();
  const customerBookings = bookings.filter((b) => b.customerId === id);
  // Inquiries have no customer_id FK (they can arrive before an account
  // exists) -- email is the only reliable link back to this customer.
  const customerInquiries = inquiries.filter((i) => i.customerEmail === customer.email);
  // Manual point adjustment is a direct balance write, scoped to admin/manager
  // only -- a driver or guide has no reason to adjust point balances.
  const canAdjustLoyalty = session?.role === "admin" || session?.role === "manager";

  return (
    <div>
      <PageHeader
        title={customer.fullName}
        description={customer.email}
        action={
          <Link href={`/admin/customers/${customer.id}/edit`} className="btn-primary text-sm">
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Booking History</h2>
          <div className="mt-4 space-y-3">
            {customerBookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-secondary/10 px-4 py-3 text-sm transition-colors hover:bg-secondary/20"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{b.productTitle}</p>
                  <p className="text-xs text-foreground/60">{b.bookingReference} · {b.travelDate ?? "Flexible"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={bookingStatusTone(b.bookingStatus)}>{b.bookingStatus}</Badge>
                  <span className="text-primary">View →</span>
                </div>
              </Link>
            ))}
            {customerBookings.length === 0 && (
              <p className="text-sm text-foreground/50">No bookings yet.</p>
            )}
          </div>

          <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Enquiries</h2>
          <div className="mt-4 space-y-3">
            {customerInquiries.map((i) => (
              <Link
                key={i.id}
                href={`/admin/inquiries/${i.id}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-secondary/10 px-4 py-3 text-sm transition-colors hover:bg-secondary/20"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{i.tourTitle || i.journeyTitle || "General enquiry"}</p>
                  <p className="text-xs text-foreground/60">{formatDateTime(i.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={inquiryStatusTone(i.status)}>{i.status.replace("_", " ")}</Badge>
                  <span className="text-primary">View →</span>
                </div>
              </Link>
            ))}
            {customerInquiries.length === 0 && (
              <p className="text-sm text-foreground/50">No enquiries yet.</p>
            )}
          </div>

          <h2 className="mt-8 font-heading text-lg font-semibold text-foreground">Notes</h2>
          <p className="mt-2 rounded-xl bg-secondary/10 p-4 text-sm text-foreground/70">
            {customer.notes || "No notes on file."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="card h-fit p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-foreground/50">Phone</dt><dd className="font-medium text-foreground">{customer.phone}</dd></div>
              <div><dt className="text-foreground/50">Nationality</dt><dd className="font-medium text-foreground">{customer.nationality}</dd></div>
              <div><dt className="text-foreground/50">Emergency Contact</dt><dd className="font-medium text-foreground">{customer.emergencyContact}</dd></div>
              <div><dt className="text-foreground/50">Customer Since</dt><dd className="font-medium text-foreground">{formatDateTime(customer.createdAt)}</dd></div>
            </dl>
          </div>

          <LoyaltyPanel
            customerId={customer.id}
            balance={customer.loyaltyPoints}
            transactions={loyaltyTransactions}
            canAdjust={canAdjustLoyalty}
          />
        </div>
      </div>
    </div>
  );
}
