"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getGroupedModulesForRole, type StaffRole } from "@/lib/admin/permissions";

export default function AdminMobileNav({
  role,
  unreadNotifications = 0,
}: {
  role: StaffRole;
  unreadNotifications?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { pinned, groups } = getGroupedModulesForRole(role);

  return (
    <div className="border-b border-secondary/20 bg-white px-4 py-3 md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-primary"
      >
        <span>{open ? "✕" : "☰"}</span> Menu
        {unreadNotifications > 0 && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
            {unreadNotifications}
          </span>
        )}
      </button>
      {open && (
        <nav className="mt-3 space-y-3">
          {pinned.length > 0 && (
            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
              {pinned.map((mod) => (
                <Link
                  key={mod.key}
                  href={mod.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium ${
                    pathname === mod.href ? "bg-primary text-white" : "bg-secondary/15 text-foreground/80"
                  }`}
                >
                  {mod.icon} {mod.label}
                </Link>
              ))}
            </div>
          )}
          {groups.map((group) => (
            <div key={group.key}>
              <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">
                {group.label}
              </p>
              <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
                {group.modules.map((mod) => (
                  <Link
                    key={mod.key}
                    href={mod.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 text-xs font-medium ${
                      pathname === mod.href ? "bg-primary text-white" : "bg-secondary/15 text-foreground/80"
                    }`}
                  >
                    {mod.icon} {mod.label}
                    {mod.key === "notifications" && unreadNotifications > 0 && (
                      <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
