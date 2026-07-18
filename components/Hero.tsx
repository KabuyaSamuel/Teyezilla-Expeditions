import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.25),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-24 md:py-32">
        <span className="animate-fadeUp rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wide text-accent">
          Extraordinary Journeys Across Africa
        </span>

        <h1 className="animate-fadeUp max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl [animation-delay:100ms]">
          Discover Africa with Teyezilla Expeditions
        </h1>

        <p className="animate-fadeUp max-w-2xl text-lg text-white/85 [animation-delay:200ms]">
          Explore unforgettable safaris in Kenya and Tanzania, relax on the beaches of
          Zanzibar, uncover the ancient wonders of Egypt, and experience the vibrant
          culture of Morocco.
        </p>

        <div className="animate-fadeUp flex flex-wrap gap-4 [animation-delay:300ms]">
          <Link href="/destinations" className="btn-secondary">
            Explore Destinations
          </Link>
          <Link href="/trip-planner" className="rounded-full border-2 border-white px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-primary">
            Plan My Trip
          </Link>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-accent px-6 py-3 font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
          >
            Contact on WhatsApp
          </a>
        </div>

        <form className="animate-fadeUp mt-6 grid w-full gap-3 rounded-2xl bg-white p-4 text-foreground shadow-cardHover md:grid-cols-4 [animation-delay:400ms]">
          <input
            type="text"
            placeholder="Destination"
            className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Experience"
            className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="date"
            className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
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
    </section>
  );
}
