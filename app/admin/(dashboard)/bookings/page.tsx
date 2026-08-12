import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import Badge from "@/components/admin/Badge";
import ResponsiveTable, { MobileCardField, MobileCardHeader } from "@/components/admin/ResponsiveTable";
import Pagination from "@/components/admin/Pagination";
import { getBookingsPaginated, type Booking } from "@/lib/admin/data/bookings";
import { getStatusOptions } from "@/lib/admin/data/status-options";
import { bookingStatusTone, paymentStatusTone } from "@/lib/admin/status-tone";
import { ADMIN_LIST_PAGE_SIZE, parsePage } from "@/lib/admin/list-query";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePage(params);

  const [{ items: bookings, total }, bookingStatusOptions, paymentStatusOptions] = await Promise.all([
    getBookingsPaginated({ page, pageSize: ADMIN_LIST_PAGE_SIZE }),
    getStatusOptions("booking_status"),
    getStatusOptions("payment_status"),
  ]);

  const toneFor = (b: Booking) => ({
    booking: bookingStatusOptions.find((o) => o.key === b.bookingStatus)?.tone ?? bookingStatusTone(b.bookingStatus),
    payment: paymentStatusOptions.find((o) => o.key === b.paymentStatus)?.tone ?? paymentStatusTone(b.paymentStatus),
  });

  return (
    <div>
      <PageHeader
        title="Booking Management"
        description="Enquiries through to completed journeys. Statuses are set manually as staff quote and confirm."
      />
      <ResponsiveTable
        rows={bookings}
        keyField={(b) => b.id}
        emptyMessage="No bookings yet."
        columns={[
          { header: "Reference", cell: (b) => b.bookingReference, className: "font-medium text-foreground" },
          { header: "Customer", cell: (b) => b.customerName },
          { header: "Tour / Journey", cell: (b) => b.productTitle },
          { header: "Travel Date", cell: (b) => b.travelDate ?? "Flexible" },
          { header: "Travelers", cell: (b) => b.travelerCount },
          { header: "Payment", cell: (b) => <Badge tone={toneFor(b).payment}>{b.paymentStatus.replace("_", " ")}</Badge> },
          { header: "Status", cell: (b) => <Badge tone={toneFor(b).booking}>{b.bookingStatus}</Badge> },
          { header: "", cell: (b) => <Link href={`/admin/bookings/${b.id}`} className="text-primary hover:underline">View</Link> },
        ]}
        renderMobileCard={(b) => {
          const tone = toneFor(b);
          return (
            <>
              <MobileCardHeader
                title={b.bookingReference}
                subtitle={b.customerName}
                action={<Link href={`/admin/bookings/${b.id}`} className="hover:underline">View</Link>}
              />
              <div className="mt-3 space-y-1 border-t border-secondary/10 pt-3">
                <MobileCardField label="Tour / Journey" value={b.productTitle} />
                <MobileCardField label="Travel Date" value={b.travelDate ?? "Flexible"} />
                <MobileCardField label="Travelers" value={b.travelerCount} />
                <MobileCardField label="Payment" value={<Badge tone={tone.payment}>{b.paymentStatus.replace("_", " ")}</Badge>} />
                <MobileCardField label="Status" value={<Badge tone={tone.booking}>{b.bookingStatus}</Badge>} />
              </div>
            </>
          );
        }}
      />
      <Pagination
        basePath="/admin/bookings"
        currentParams={{}}
        page={page}
        pageSize={ADMIN_LIST_PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
