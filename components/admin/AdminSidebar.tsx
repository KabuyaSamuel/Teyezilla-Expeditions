"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getModulesForRole, ROLE_LABELS, type StaffRole } from "@/lib/admin/permissions";

export default function AdminSidebar({
  role,
  name,
}: {
  role: StaffRole;
  name: string;
}) {
  const pathname = usePathname();
  const modules = getModulesForRole(role);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-secondary/20 bg-white lg:flex">
      <div className="border-b border-secondary/20 px-5 py-5">
        <p className="font-heading text-lg font-bold text-primary">
          Teyezilla <span className="text-accent">Admin</span>
        </p>
        <p className="mt-1 text-xs text-foreground/60">
          {name} · {ROLE_LABELS[role]}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {modules.map((mod) => {
          const active = pathname === mod.href;
          return (
            <Link
              key={mod.key}
              href={mod.href}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-foreground/80 hover:bg-secondary/15"
              }`}
            >
              <span>{mod.icon}</span>
              {mod.label}
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
