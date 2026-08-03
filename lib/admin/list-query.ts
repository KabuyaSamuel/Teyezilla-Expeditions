// Shared URL-search-param parsing for paginated admin list pages
// (tours/journeys/destinations). Keeps the `sort` query param format
// (`${column}_${direction}`) and page size consistent across all three.

export const ADMIN_LIST_PAGE_SIZE = 10;

export function parsePage(searchParams: Record<string, string | string[] | undefined>): number {
  const raw = searchParams.page;
  const page = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function parseSort<T extends string>(
  searchParams: Record<string, string | string[] | undefined>,
  fallback: string
): { sortBy: T; sortDir: "asc" | "desc" } {
  const raw = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) ?? fallback;
  const dir = raw.endsWith("_asc") ? "asc" : "desc";
  const sortBy = raw.replace(/_(asc|desc)$/, "") as T;
  return { sortBy, sortDir: dir };
}

export function parseString(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const raw = searchParams[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value || undefined;
}

// "" (unset, "All") is distinct from "false" (explicitly filtered to
// not-featured) -- undefined means don't filter at all.
export function parseBoolean(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): boolean | undefined {
  const value = parseString(searchParams, key);
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}
