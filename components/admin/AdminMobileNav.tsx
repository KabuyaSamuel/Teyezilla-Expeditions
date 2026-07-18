"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getModulesForRole, type StaffRole } from "@/lib/admin/permissions";

export default function AdminMobileNav({ role }: { role: StaffRole }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const modules = getModulesForRole(role);

  return (
    <div className="border-b border-secondary/20 bg-white px-4 py-3 lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-primary"
      >
        <span>{open ? "✕" : "☰"}</span> Menu
      </button>
      {open && (
        <nav className="mt-3 grid grid-cols-2 gap-2">
          {modules.map((mod) => (
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
        </nav>
      )}
    </div>
  );
}
