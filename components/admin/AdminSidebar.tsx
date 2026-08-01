"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getModulesForRole, ROLE_LABELS, type StaffRole } from "@/lib/admin/permissions";

export default function AdminSidebar({
  role,
  name,
  unreadNotifications = 0,
}: {
  role: StaffRole;
  name: string;
  unreadNotifications?: number;
}) {
  const pathname = usePathname();
  const modules = getModulesForRole(role);

  return (
    // md: (768px), not lg: -- tablets get the persistent sidebar instead of
    // the mobile hamburger, since there's real room for it (md:w-52 leaves
    // ~560px of content at exactly 768px). Widens to the full w-64 from lg:
    // where there's no need to economize.
    <aside className="hidden w-52 shrink-0 flex-col border-r border-secondary/20 bg-white md:flex lg:w-64">
      <div className="border-b border-secondary/20 px-4 py-5 lg:px-5">
        <p className="font-heading text-lg font-bold text-primary">
          Teyezilla <span className="text-accent">Admin</span>
        </p>
        <p className="mt-1 text-xs text-foreground/60">
          {name} · {ROLE_LABELS[role]}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-3">
        {modules.map((mod) => {
          const active = pathname === mod.href;
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className={`mb-1 flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors lg:gap-3 lg:px-3 ${
                active
                  ? "bg-primary text-white"
                  : "text-foreground/80 hover:bg-secondary/15"
              }`}
            >
              <span>{mod.icon}</span>
              <span className="flex-1">{mod.label}</span>
              {mod.key === "notifications" && unreadNotifications > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <form action="/admin/logout" method="POST" className="border-t border-secondary/20 p-4">
        <button type="submit" className="w-full rounded-full border-2 border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">
          Log Out
        </button>
      </form>
    </aside>
  );
}
