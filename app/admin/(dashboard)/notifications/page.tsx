import PageHeader from "@/components/admin/PageHeader";
import { getNotifications } from "@/lib/admin/data/notifications";

const TYPE_ICONS: Record<string, string> = {
  new_booking: "🧳",
  payment_confirmed: "💳",
  tour_reminder: "📅",
  follow_up: "💬",
  admin_alert: "⚠️",
};

export default async function AdminNotificationsPage() {
  const notifications = await getNotifications();
  return (
    <div>
      <PageHeader title="Notifications" description="Booking alerts, payment confirmations, and follow-up reminders." />
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`card flex items-start gap-3 p-4 ${!n.isRead ? "border-l-4 border-primary" : ""}`}
          >
            <span className="text-xl">{TYPE_ICONS[n.type]}</span>
            <div className="flex-1">
              <p className="text-sm text-foreground">{n.message}</p>
              <p className="mt-1 text-xs text-foreground/50">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.isRead && <span className="h-2 w-2 rounded-full bg-accent" />}
          </div>
        ))}
      </div>
    </div>
  );
}
