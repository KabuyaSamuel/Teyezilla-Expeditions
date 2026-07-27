import PageHeader from "@/components/admin/PageHeader";
import StatusOptionsManager from "@/components/admin/StatusOptionsManager";
import { getStatusOptions } from "@/lib/admin/data/status-options";

export default async function AdminStatusesPage() {
  const [bookingStatusOptions, paymentStatusOptions] = await Promise.all([
    getStatusOptions("booking_status"),
    getStatusOptions("payment_status"),
  ]);

  return (
    <div>
      <PageHeader
        title="Status Options"
        description="Manage the choices staff can pick from on every booking's status dropdowns. Reorder, rename, recolor, add, or remove — changes apply everywhere immediately."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusOptionsManager
          category="booking_status"
          title="Booking Status"
          description="Shown on every booking's Booking Status dropdown."
          options={bookingStatusOptions}
        />
        <StatusOptionsManager
          category="payment_status"
          title="Payment Status"
          description="Shown on every booking's Payment (manual record) dropdown."
          options={paymentStatusOptions}
        />
      </div>
    </div>
  );
}
