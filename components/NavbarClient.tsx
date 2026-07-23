"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";

interface DropdownLink {
  label: string;
  href: string;
}

interface DropdownGroup {
  label: string;
  links: DropdownLink[];
}

interface NavItem {
  label: string;
  href: string;
  dropdown?: DropdownLink[];
  groups?: DropdownGroup[];
}

export default function NavbarClient({
  destinationGroups,
  journeyLinks,
  experienceLinks,
  collectionLinks,
  safariLinks,
}: {
  destinationGroups: DropdownGroup[];
  journeyLinks: DropdownLink[];
  experienceLinks: DropdownLink[];
  collectionLinks: DropdownLink[];
  safariLinks: DropdownLink[];
}) {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const transparent = isHome && !condensed && !menuOpen;

  const NAV_ITEMS: NavItem[] = [
    { label: "Destinations", href: "/destinations", groups: destinationGroups },
    { label: "Journeys", href: "/journeys", dropdown: journeyLinks },
    { label: "Experiences", href: "/experiences", dropdown: experienceLinks },
    { label: "Collections", href: "/collections", dropdown: collectionLinks },
    { label: "Safari", href: "/safari", dropdown: safariLinks },
    { label: "Bespoke", href: "/tailor-made-trips" },
    { label: "Concierge", href: "/concierge" },
    { label: "Journal", href: "/blog" },
  ];

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileSection(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-background/95 shadow-card backdrop-blur"
      }`}
    >
      <div ref={navRef} className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
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
          {NAV_ITEMS.map((item) =>
            item.groups && item.groups.length > 0 ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown((v) => (v === item.label ? null : item.label))}
                  aria-expanded={openDropdown === item.label}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    transparent ? "text-white hover:text-accent" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openDropdown === item.label && (
                  <div className="absolute left-1/2 top-full z-10 w-[36rem] -translate-x-1/2 pt-3">
                    <div className="flex gap-6 rounded-2xl bg-white p-6 text-left shadow-cardHover">
                      {item.groups.map((group) => (
                        <div key={group.label} className="flex-1">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40">
                            {group.label}
                          </p>
                          <div className="flex flex-col gap-1">
                            {group.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/15 hover:text-primary"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="w-full border-t border-secondary/20 pt-3">
                        <Link
                          href={item.href}
                          className="block text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          View All {item.label} →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : item.dropdown && item.dropdown.length > 0 ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown((v) => (v === item.label ? null : item.label))}
                  aria-expanded={openDropdown === item.label}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    transparent ? "text-white hover:text-accent" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>

                {openDropdown === item.label && (
                  <div className="absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 pt-3">
                    <div className="rounded-2xl bg-white p-2 text-left shadow-cardHover">
                      {item.dropdown.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/15 hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        className="mt-1 block rounded-xl px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary/15"
                      >
                        View All {item.label} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full ${
                  transparent ? "text-white hover:text-accent" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className={transparent ? "text-white" : "text-foreground"}
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            {searchOpen && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="absolute right-0 top-full z-10 mt-3 w-64 rounded-2xl bg-white p-2 shadow-cardHover"
              >
                <input
                  type="search"
                  placeholder="Search destinations, journeys..."
                  autoFocus
                  className="w-full rounded-xl border border-secondary/30 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </form>
            )}
          </div>
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
            Plan Your Journey
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
        <nav className="flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto border-t border-secondary/30 bg-background px-6 py-6 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const flatLinks: DropdownLink[] = item.groups
              ? item.groups.flatMap((g) => g.links)
              : item.dropdown ?? [];

            return flatLinks.length > 0 ? (
              <div key={item.href}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMobileSection((v) => (v === item.label ? null : item.label))
                  }
                  className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-foreground"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openMobileSection === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                {openMobileSection === item.label && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-secondary/30 pl-3 pb-2">
                    {flatLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="py-1.5 text-sm text-foreground/70 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="py-1.5 text-sm font-semibold text-primary"
                    >
                      View All {item.label} →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="py-2.5 text-sm font-medium text-foreground hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/booking" className="btn-secondary mt-3 text-sm" onClick={() => setMenuOpen(false)}>
            Plan Your Journey
          </Link>
        </nav>
      )}
    </header>
  );
}
