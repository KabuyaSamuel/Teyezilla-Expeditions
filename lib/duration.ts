// Short experiences (e.g. a 4-hour Tuk Tuk tour) are set in hours instead of
// days; durationHours takes priority over durationDays when both are set.
export function formatTourDuration(tour: { durationDays: number; durationHours?: number | null }): string {
  if (tour.durationHours && tour.durationHours > 0) {
    return `${tour.durationHours} hr${tour.durationHours !== 1 ? "s" : ""}`;
  }
  return `${tour.durationDays} day${tour.durationDays !== 1 ? "s" : ""}`;
}
