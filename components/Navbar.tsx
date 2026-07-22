"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Safaris", href: "/safaris" },
  { label: "Experiences", href: "/experiences" },
  { label: "Tailor-Made Trips", href: "/tailor-made-trips" },
  { label: "Travel Guides", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !condensed && !menuOpen;

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-background/95 shadow-card backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Teyezilla Expeditions"
            width={160}
            height={155}
            priority
            className={`h-10 w-auto lg:h-12 transition-all duration-300 ${
              transparent ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full ${
                transparent
                  ? "text-white hover:text-accent"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <select
            name="language"
            aria-label="Language"
            className={`border-none bg-transparent text-sm focus:outline-none ${
              transparent ? "text-white" : "text-foreground"
            }`}
          >
            <option>EN</option>
            <option>FR</option>
            <option>SW</option>
          </select>
          <select
            name="currency"
            aria-label="Currency"
            className={`border-none bg-transparent text-sm focus:outline-none ${
              transparent ? "text-white" : "text-foreground"
            }`}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>KES</option>
          </select>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-200 ease-smooth hover:scale-110"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4">
              <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.339.653 4.522 1.786 6.393L4 29l7.79-1.755A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.75c-1.97 0-3.81-.55-5.38-1.5l-.386-.23-4.62 1.04 1.06-4.5-.253-.4A9.71 9.71 0 0 1 5.75 15c0-5.66 4.59-10.25 10.251-10.25 5.66 0 10.25 4.59 10.25 10.25s-4.59 10.25-10.25 10.25Zm5.63-7.68c-.31-.155-1.828-.902-2.11-1.005-.283-.103-.489-.155-.694.155-.206.31-.797 1.005-.977 1.212-.18.206-.36.232-.67.077-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.838-1.726-2.148-.18-.31-.02-.478.136-.632.14-.14.31-.36.464-.54.155-.18.206-.31.31-.516.103-.206.051-.387-.026-.542-.077-.155-.694-1.673-.951-2.291-.25-.6-.505-.519-.694-.529l-.592-.01c-.206 0-.542.077-.826.387-.283.31-1.082 1.057-1.082 2.577s1.108 2.99 1.263 3.196c.155.206 2.18 3.328 5.283 4.667.738.319 1.314.51 1.763.652.741.236 1.415.203 1.948.123.594-.089 1.828-.747 2.086-1.469.258-.722.258-1.34.18-1.469-.077-.129-.283-.206-.593-.361Z" />
            </svg>
          </a>
          <Link href="/booking" className="btn-secondary text-sm">
            Book Now
          </Link>
        </div>

        <button
          className={transparent ? "text-white lg:hidden" : "text-primary lg:hidden"}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-4 border-t border-secondary/30 bg-background px-6 py-6 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/booking" className="btn-secondary mt-2 text-sm">
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
