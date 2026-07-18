"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-shadow duration-300 ${
        condensed ? "shadow-card" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${
          condensed ? "py-3" : "py-5"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Teyezilla Expeditions"
            width={160}
            height={155}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-foreground transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <select
            name="language"
            aria-label="Language"
            className="border-none bg-transparent text-sm text-foreground focus:outline-none"
          >
            <option>EN</option>
            <option>FR</option>
            <option>SW</option>
          </select>
          <select
            name="currency"
            aria-label="Currency"
            className="border-none bg-transparent text-sm text-foreground focus:outline-none"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>KES</option>
          </select>
          <Link href="/booking" className="btn-primary text-sm">
            Book Now
          </Link>
        </div>

        <button
          className="text-2xl text-primary lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
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
          <Link href="/booking" className="btn-primary mt-2 text-sm">
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
