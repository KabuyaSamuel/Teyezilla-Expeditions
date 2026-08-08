interface Props {
  defaultDestination?: string;
  defaultExperience?: string;
  defaultTravelDate?: string;
  defaultTravelers?: string;
}

export default function TripSearch({
  defaultDestination,
  defaultExperience,
  defaultTravelDate,
  defaultTravelers,
}: Props) {
  return (
    // No top padding here -- that's a caller concern. Baking in a fixed
    // pt-12 double-counted with CategoryOverview's own bottom padding on
    // the homepage (the two stacked into a ~130px gap, way past the
    // site's normal ~64-96px section rhythm) since this sits directly
    // beneath it there.
    <div className="mx-auto max-w-6xl px-6">
      <form action="/search" method="GET" className="grid gap-3 rounded-2xl bg-white p-4 text-foreground shadow-card md:grid-cols-4">
        <input
          id="search-destination"
          name="destination"
          type="text"
          defaultValue={defaultDestination}
          placeholder="Destination"
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          id="search-experience"
          name="experience"
          type="text"
          defaultValue={defaultExperience}
          placeholder="Experience"
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          id="search-date"
          name="travelDate"
          type="date"
          defaultValue={defaultTravelDate}
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <input
            id="search-travelers"
            name="travelers"
            type="number"
            min={1}
            defaultValue={defaultTravelers}
            placeholder="Travelers"
            className="w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="btn-primary shrink-0 px-4">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
