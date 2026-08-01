"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export interface SortOption {
  value: string;
  label: string;
}

// Drives list filtering/sorting entirely through URL search params, so the
// server component page (which does the actual paginated Supabase query)
// re-renders with the new params on navigation -- no client-side data
// fetching or duplicate query logic needed here.
export default function AdminListToolbar({
  searchPlaceholder = "Search by name…",
  sortOptions,
  countries,
}: {
  searchPlaceholder?: string;
  sortOptions: SortOption[];
  countries?: { id: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // any filter/sort change resets to page 1
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") updateParams({ q: search });
        }}
        onBlur={() => updateParams({ q: search })}
        placeholder={searchPlaceholder}
        className="w-full max-w-xs rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <select
        defaultValue={searchParams.get("sort") ?? sortOptions[0]?.value}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {countries && countries.length > 0 && (
        <select
          defaultValue={searchParams.get("country") ?? ""}
          onChange={(e) => updateParams({ country: e.target.value })}
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
