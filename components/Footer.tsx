import Image from "next/image";
import Link from "next/link";
import { getSiteSetting } from "@/lib/settings";
import { whatsappLink } from "@/lib/enquiry-shared";

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

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3h-2.7v11.6a2.6 2.6 0 1 1-2.1-2.55V9.3a5.3 5.3 0 1 0 4.8 5.28V9.15a6.9 6.9 0 0 0 4 1.28V7.75a4.2 4.2 0 0 1-4-4.75Z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        d="M2 12s0-3.2.4-4.7a3 3 0 0 1 2.1-2.1C6 4.8 12 4.8 12 4.8s6 0 7.5.4a3 3 0 0 1 2.1 2.1C22 8.8 22 12 22 12s0 3.2-.4 4.7a3 3 0 0 1-2.1 2.1c-1.5.4-7.5.4-7.5.4s-6 0-7.5-.4a3 3 0 0 1-2.1-2.1C2 15.2 2 12 2 12Zm8 2.7 5-2.7-5-2.7v5.4Z"
      />
    </svg>
  );
}

const EXPLORE_LINKS = [
  { label: "Safaris", href: "/safari" },
  { label: "Journeys", href: "/journeys" },
  { label: "Experiences", href: "/experiences" },
  { label: "Destinations", href: "/destinations" },
  { label: "Collections", href: "/collections" },
];

const TRAVEL_WITH_US_LINKS = [
  { label: "Private Travel", href: "/private-travel" },
  { label: "Bespoke Journeys", href: "/tailor-made-trips" },
  { label: "About Teyezilla", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const INSPIRATION_LINKS = [
  { label: "Teyezilla Journal", href: "/blog" },
  { label: "Travel Guide", href: "/travel-guide" },
  { label: "FAQs", href: "/faqs" },
];

export default async function Footer() {
  const [instagramUrl, facebookUrl, tiktokUrl, youtubeUrl] = await Promise.all([
    getSiteSetting("instagramUrl"),
    getSiteSetting("facebookUrl"),
    getSiteSetting("tiktokUrl"),
    getSiteSetting("youtubeUrl"),
  ]);

  const socialLinks = [
    { icon: InstagramIcon, href: instagramUrl, label: "Instagram" },
    { icon: FacebookIcon, href: facebookUrl, label: "Facebook" },
    { icon: TiktokIcon, href: tiktokUrl, label: "TikTok" },
    { icon: YoutubeIcon, href: youtubeUrl, label: "YouTube" },
  ].filter((link): link is typeof link & { href: string } => !!link.href);

  return (
    <footer className="bg-primary pb-16 text-white lg:pb-0">
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
          <p className="mt-3 text-sm text-white/80">Discover Africa, Your Way.</p>

          {socialLinks.length > 0 && (
            <div className="mt-6">
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
                Follow Teyezilla
              </h4>
              <div className="mt-3 flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
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
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Travel With Us
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {TRAVEL_WITH_US_LINKS.map((link) => (
              <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Inspiration
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {INSPIRATION_LINKS.map((link) => (
              <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
            Support
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/contact">Contact Us</Link></li>
            <li>
              <a
                href={whatsappLink("Hi! I have a question about Teyezilla Expeditions.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
            <li><Link href="/booking-information">Booking Information</Link></li>
            <li><Link href="/cancellation-policy">Cancellation Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 px-6 py-6 text-center text-xs text-white/70">
        <p>© {new Date().getFullYear()} Teyezilla Expeditions. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
