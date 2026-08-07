// Target counts for the homepage's featured sections, and the fallback that
// keeps each section looking intentional when staff haven't marked enough
// items featured yet -- shared with the admin dashboard so its "add more"
// nudge uses the exact same numbers the homepage renders against.

export const FEATURED_DESTINATIONS_COUNT = 3;
export const FEATURED_EXPERIENCES_COUNT = 4;
export const FEATURED_JOURNEYS_COUNT = 3;

// Tops up a manually-curated list with additional items from the full
// catalogue (in their existing order) when there aren't enough featured
// picks to fill the section -- never repeating an item already included,
// so a short-staffed featured list still fills the row instead of leaving
// empty grid cells.
export function fillToCount<T>(featured: T[], all: T[], count: number, getId: (item: T) => string): T[] {
  const result = featured.slice(0, count);
  if (result.length >= count) return result;

  const usedIds = new Set(result.map(getId));
  for (const item of all) {
    if (result.length >= count) break;
    const id = getId(item);
    if (!usedIds.has(id)) {
      result.push(item);
      usedIds.add(id);
    }
  }
  return result;
}
