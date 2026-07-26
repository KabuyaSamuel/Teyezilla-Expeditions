"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchResultGroup } from "@/app/api/search/route";

function SearchResults({
  loading,
  groups,
  hasSearched,
  onNavigate,
}: {
  loading: boolean;
  groups: SearchResultGroup[];
  hasSearched: boolean;
  onNavigate: () => void;
}) {
  if (loading) {
    return <p className="px-3 py-4 text-center text-sm text-foreground/50">Searching…</p>;
  }
  if (hasSearched && groups.length === 0) {
    return <p className="px-3 py-4 text-center text-sm text-foreground/50">No matches found.</p>;
  }
  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <div key={group.category} className="py-1">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground/40">
            {group.category}
          </p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="block rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary/15 hover:text-primary"
            >
              {item.label}
              {item.sublabel && <span className="ml-1.5 text-xs text-foreground/40">{item.sublabel}</span>}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SearchBox({
  variant,
  transparent,
}: {
  variant: "desktop" | "mobile";
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchResultGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setGroups([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setGroups(data.groups ?? []);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  function closeAndReset() {
    setOpen(false);
    setQuery("");
    setGroups([]);
    setHasSearched(false);
  }

  if (variant === "mobile") {
    return (
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, journeys..."
            className="w-full rounded-full border border-secondary/40 py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        {query.trim().length >= 2 && (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-2xl border border-secondary/20 bg-white shadow-cardHover">
            <SearchResults loading={loading} groups={groups} hasSearched={hasSearched} onNavigate={closeAndReset} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen((v) => !v)}
        className={transparent ? "text-white" : "text-foreground"}
      >
        <Search className="h-4.5 w-4.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-3 w-80 rounded-2xl bg-white p-2 shadow-cardHover">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, journeys..."
              autoFocus
              className="w-full rounded-xl border border-secondary/30 py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
          {query.trim().length >= 2 && (
            <div className="mt-2 max-h-96 overflow-y-auto">
              <SearchResults loading={loading} groups={groups} hasSearched={hasSearched} onNavigate={closeAndReset} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
