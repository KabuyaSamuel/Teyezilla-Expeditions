// Renders a Postgres timestamptz string (raw ISO, microsecond precision) as
// something a staff member can actually read at a glance, instead of e.g.
// "2026-08-10T22:20:09.196622+00:00" showing up verbatim in the admin UI.
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
