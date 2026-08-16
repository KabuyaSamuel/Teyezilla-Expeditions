"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { getGroupedModulesForRole, ROLE_LABELS, type StaffRole } from "@/lib/admin/permissions";

const STORAGE_KEY = "teyezilla-admin-collapsed-groups";
const RAIL_STORAGE_KEY = "teyezilla-admin-sidebar-rail-collapsed";

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
  // Both start at their SSR-safe default (nothing collapsed) rather than a
  // lazy initializer reading localStorage -- that runs during SSR too
  // (falling back to the default there), and would diverge from a
  // returning staff member's real client hydration pass whenever they
  // actually have a saved preference, the same hydration-mismatch failure
  // mode confirmed directly in HeroCarousel/TestimonialsCarousel. Synced
  // from localStorage once on mount in the effect below instead.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  // Whole-sidebar icon rail, separate from per-group collapsing above --
  // for a small screen that still fits md:flex, or a staff member who just
  // wants the nav out of the way while working a form.
  const [railCollapsed, setRailCollapsed] = useState(false);

  // Runs exactly once on mount ([] deps) to hydrate from localStorage --
  // not a recurring subscription, so react-hooks/set-state-in-effect's
  // "cascading renders" concern doesn't apply here; this is the one
  // extra render every mount takes to pick up a saved preference,
  // deliberately deferred out of the initial render for hydration safety.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setCollapsed(new Set(JSON.parse(saved)));
    } catch {
      // Default (nothing collapsed) already set.
    }
    try {
      setRailCollapsed(localStorage.getItem(RAIL_STORAGE_KEY) === "true");
    } catch {
      // Default (false) already set.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem(RAIL_STORAGE_KEY, String(railCollapsed));
  }, [railCollapsed]);

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
      railCollapsed ? "justify-center" : ""
    } ${active ? "bg-primary text-white" : "text-foreground/80 hover:bg-secondary/15"}`;

  // Group headers need room for text that a narrow icon rail doesn't have,
  // so rail mode flattens every module (pinned + grouped) into one plain
  // icon list instead -- same rows AdminMobileNav effectively becomes on
  // small screens, just for "I want the nav out of the way" on desktop.
  const allModules = [...pinned, ...groups.flatMap((g) => g.modules)];

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-secondary/20 bg-white transition-[width] duration-150 md:flex ${
        railCollapsed ? "w-16" : "w-52 lg:w-64"
      }`}
    >
      <div className={`flex items-center gap-2 border-b border-secondary/20 py-5 ${railCollapsed ? "justify-center px-2" : "justify-between px-4 lg:px-5"}`}>
        {!railCollapsed && (
          <div className="min-w-0">
            <p className="font-heading text-lg font-bold text-primary">
              Teyezilla <span className="text-accent">Admin</span>
            </p>
            <p className="mt-1 truncate text-xs text-foreground/60">
              {name} · {ROLE_LABELS[role]}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setRailCollapsed((v) => !v)}
          title={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-secondary/15 hover:text-foreground"
        >
          {railCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-3">
        {railCollapsed ? (
          allModules.map((mod) => (
            <Link key={mod.key} href={mod.href} title={mod.label} className={`relative ${linkClass(pathname === mod.href)}`}>
              <span>{mod.icon}</span>
              {mod.key === "notifications" && unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
              )}
            </Link>
          ))
        ) : (
          <>
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
          </>
        )}
      </nav>

      <form action="/admin/logout" method="POST" className="border-t border-secondary/20 p-4">
        <button
          type="submit"
          title="Log Out"
          className={`flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white ${
            railCollapsed ? "p-2" : "px-4 py-2"
          }`}
        >
          {railCollapsed ? <LogOut className="h-4 w-4" /> : "Log Out"}
        </button>
      </form>
    </aside>
  );
}
