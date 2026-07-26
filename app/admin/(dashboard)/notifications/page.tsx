import PageHeader from "@/components/admin/PageHeader";
import { getNotifications } from "@/lib/admin/data/notifications";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/admin/actions/notifications";

const TYPE_ICONS: Record<string, string> = {
  new_booking: "🧳",
  payment_confirmed: "💳",
  tour_reminder: "📅",
  follow_up: "💬",
  admin_alert: "⚠️",
};

export default async function AdminNotificationsPage() {
  const notifications = await getNotifications();
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Booking alerts and follow-up reminders."
        action={
          hasUnread ? (
            <form action={markAllNotificationsRead}>
              <button type="submit" className="btn-outline text-sm">Mark all read</button>
            </form>
          ) : undefined
        }
      />
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
            <form action={markNotificationRead.bind(null, n.id, !n.isRead)}>
              <button type="submit" className="text-xs font-medium text-primary hover:underline">
                {n.isRead ? "Mark unread" : "Mark read"}
              </button>
            </form>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-sm text-foreground/50">No notifications.</p>
        )}
      </div>
    </div>
  );
}
