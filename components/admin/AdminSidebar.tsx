"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { getGroupedModulesForRole, ROLE_LABELS, type StaffRole } from "@/lib/admin/permissions";

const STORAGE_KEY = "teyezilla-admin-collapsed-groups";

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
  const { pinned, groups } = getGroupedModulesForRole(role);
  // Lazy initializer (not an effect) reads the staff member's saved collapse
  // preference synchronously on first client render, same pattern as
  // HeroCarousel's prefers-reduced-motion check -- window/localStorage are
  // unavailable during SSR, so this only ever runs client-side anyway.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
  }, [collapsed]);

  // Whichever page is currently open should never be hidden inside a
  // collapsed group. Computed at render time rather than forced into state,
  // so it only affects what's displayed while that page is active -- it
  // doesn't overwrite the staff member's actual saved preference for the
  // group once they navigate elsewhere.
  const activeGroupKey = groups.find((g) => g.modules.some((m) => m.href === pathname))?.key;

  function toggleGroup(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function collapseAll() {
    setCollapsed(new Set(groups.map((g) => g.key)));
  }

  function viewAll() {
    setCollapsed(new Set());
  }

  const linkClass = (active: boolean) =>
    `mb-1 flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors lg:gap-3 lg:px-3 ${
      active ? "bg-primary text-white" : "text-foreground/80 hover:bg-secondary/15"
    }`;

  return (
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
        {pinned.map((mod) => (
          <Link key={mod.key} href={mod.href} className={linkClass(pathname === mod.href)}>
            <span>{mod.icon}</span>
            <span className="flex-1">{mod.label}</span>
          </Link>
        ))}

        <div className="mb-2 mt-3 flex items-center justify-between px-2.5 lg:px-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">Menu</span>
          <div className="flex gap-2 text-[11px] font-medium text-primary">
            <button type="button" onClick={collapseAll} className="hover:underline">Collapse All</button>
            <span className="text-foreground/30">·</span>
            <button type="button" onClick={viewAll} className="hover:underline">View All</button>
          </div>
        </div>

        {groups.map((group) => {
          const isCollapsed = collapsed.has(group.key) && group.key !== activeGroupKey;
          const groupHasUnread = group.modules.some((m) => m.key === "notifications") && unreadNotifications > 0;

          return (
            <div key={group.key} className="mb-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.key)}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground/50 transition-colors hover:bg-secondary/10 lg:px-3"
              >
                <span className="flex items-center gap-1.5">
                  {group.label}
                  {groupHasUnread && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
              </button>

              {!isCollapsed && (
                <div className="mt-0.5">
                  {group.modules.map((mod) => {
                    const active = pathname === mod.href;
                    return (
                      <Link key={mod.key} href={mod.href} className={linkClass(active)}>
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
                </div>
              )}
            </div>
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
