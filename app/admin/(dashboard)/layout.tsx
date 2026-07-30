import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { getUnreadNotificationCount } from "@/lib/admin/data/notifications";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Middleware already redirects unauthenticated requests, but guard here
  // too since layouts can render for statically-optimized paths.
  if (!session) {
    redirect("/admin/login");
  }

  const unreadNotifications = await getUnreadNotificationCount();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar role={session.role} name={session.name} unreadNotifications={unreadNotifications} />
      <div className="flex-1">
        <AdminMobileNav role={session.role} unreadNotifications={unreadNotifications} />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
