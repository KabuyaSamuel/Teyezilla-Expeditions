import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <h3 className="font-heading text-lg font-bold">
            Teyezilla <span className="text-accent">Expeditions</span>
          </h3>
          <p className="mt-3 text-sm text-white/80">
            Extraordinary journeys across Africa, tailor-made for every traveler.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Explore
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/safaris">Safaris</Link></li>
            <li><Link href="/experiences">Experiences</Link></li>
            <li><Link href="/blog">Travel Guides</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>WhatsApp: +254 700 000 000</li>
            <li>Email: hello@teyezillaexpeditions.com</li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Newsletter
          </h4>
          <form className="mt-3 flex gap-2">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your email"
              className="w-full rounded-full border-none px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn-secondary px-4 py-2 text-sm">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/20 px-6 py-6 text-center text-xs text-white/70">
        <p>
          © {new Date().getFullYear()} Teyezilla Expeditions. All rights reserved. ·{" "}
          <Link href="/privacy-policy" className="underline">Privacy Policy</Link> ·{" "}
          <Link href="/terms" className="underline">Terms & Conditions</Link>
        </p>
      </div>
    </footer>
  );
}
