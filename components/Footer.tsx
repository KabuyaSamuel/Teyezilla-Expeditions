import Image from "next/image";
import Link from "next/link";
import { getDestinations } from "@/lib/destinations";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.34c-.26-.03-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.76V10.5H8v3h2.65V21h2.85Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C18 4.8 12 4.8 12 4.8s-6 0-7.5.4A3 3 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.5.4 7.5.4 7.5.4s6 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 15.2 22 12 22 12Z" opacity="0" />
      <path
        fill="currentColor"
        stroke="none"
        d="M2 12s0-3.2.4-4.7a3 3 0 0 1 2.1-2.1C6 4.8 12 4.8 12 4.8s6 0 7.5.4a3 3 0 0 1 2.1 2.1C22 8.8 22 12 22 12s0 3.2-.4 4.7a3 3 0 0 1-2.1 2.1c-1.5.4-7.5.4-7.5.4s-6 0-7.5-.4a3 3 0 0 1-2.1-2.1C2 15.2 2 12 2 12Zm8 2.7 5-2.7-5-2.7v5.4Z"
      />
    </svg>
  );
}

// TODO: swap "#" for the real profile URLs once the business has them —
// left as placeholders rather than guessed links so we don't point visitors
// at the wrong (or a squatted) account.
const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export default async function Footer() {
  const destinations = await getDestinations();
  const topDestinations = destinations.slice(0, 5);

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Teyezilla Expeditions home">
            <Image
              src="/logo.png"
              alt="Teyezilla Expeditions"
              width={160}
              height={155}
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>
          <h3 className="sr-only">Teyezilla Expeditions</h3>
          <p className="mt-3 text-sm text-white/80">
            Extraordinary journeys across Africa, tailor-made for every traveler.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <a
              href="https://wa.me/254700000000"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4">
                <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.339.653 4.522 1.786 6.393L4 29l7.79-1.755A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.75c-1.97 0-3.81-.55-5.38-1.5l-.386-.23-4.62 1.04 1.06-4.5-.253-.4A9.71 9.71 0 0 1 5.75 15c0-5.66 4.59-10.25 10.251-10.25 5.66 0 10.25 4.59 10.25 10.25s-4.59 10.25-10.25 10.25Zm5.63-7.68c-.31-.155-1.828-.902-2.11-1.005-.283-.103-.489-.155-.694.155-.206.31-.797 1.005-.977 1.212-.18.206-.36.232-.67.077-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.838-1.726-2.148-.18-.31-.02-.478.136-.632.14-.14.31-.36.464-.54.155-.18.206-.31.31-.516.103-.206.051-.387-.026-.542-.077-.155-.694-1.673-.951-2.291-.25-.6-.505-.519-.694-.529l-.592-.01c-.206 0-.542.077-.826.387-.283.31-1.082 1.057-1.082 2.577s1.108 2.99 1.263 3.196c.155.206 2.18 3.328 5.283 4.667.738.319 1.314.51 1.763.652.741.236 1.415.203 1.948.123.594-.089 1.828-.747 2.086-1.469.258-.722.258-1.34.18-1.469-.077-.129-.283-.206-.593-.361Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Quick Links
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/journeys">Journeys</Link></li>
            <li><Link href="/safari">Safari</Link></li>
            <li><Link href="/experiences">Experiences</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Top Destinations
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {topDestinations.map((d) => (
              <li key={d.id}>
                <Link href={`/destinations/${d.slug}`}>{d.countryName}</Link>
              </li>
            ))}
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
