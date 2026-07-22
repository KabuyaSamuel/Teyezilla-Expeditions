export default function TripSearch() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      <form className="grid gap-3 rounded-2xl bg-white p-4 text-foreground shadow-card md:grid-cols-4">
        <input
          id="search-destination"
          name="destination"
          type="text"
          placeholder="Destination"
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          id="search-experience"
          name="experience"
          type="text"
          placeholder="Experience"
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          id="search-date"
          name="travelDate"
          type="date"
          className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <input
            id="search-travelers"
            name="travelers"
            type="number"
            min={1}
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
