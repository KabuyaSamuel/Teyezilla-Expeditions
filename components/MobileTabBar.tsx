"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Menu } from "lucide-react";

// Persistent mobile bottom nav (Home / Search / WhatsApp / Menu) -- WhatsApp
// is the primary mobile conversion path for this business, so it gets a
// permanent one-tap slot instead of living only inside the hamburger menu.
// lg:hidden to match every other mobile-vs-desktop split in the nav (see
// NavbarClient's comment on why the full mega-menu stays lg:-gated).
//
// "Search" and "Menu" both open the same NavbarClient mobile panel (search
// lives at the top of it) via a plain window CustomEvent rather than lifting
// menuOpen state into a shared store -- NavbarClient owns that state and
// listens for "teyezilla:toggle-mobile-menu" itself.

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.339.653 4.522 1.786 6.393L4 29l7.79-1.755A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.75c-1.97 0-3.81-.55-5.38-1.5l-.386-.23-4.62 1.04 1.06-4.5-.253-.4A9.71 9.71 0 0 1 5.75 15c0-5.66 4.59-10.25 10.251-10.25 5.66 0 10.25 4.59 10.25 10.25s-4.59 10.25-10.25 10.25Zm5.63-7.68c-.31-.155-1.828-.902-2.11-1.005-.283-.103-.489-.155-.694.155-.206.31-.797 1.005-.977 1.212-.18.206-.36.232-.67.077-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.838-1.726-2.148-.18-.31-.02-.478.136-.632.14-.14.31-.36.464-.54.155-.18.206-.31.31-.516.103-.206.051-.387-.026-.542-.077-.155-.694-1.673-.951-2.291-.25-.6-.505-.519-.694-.529l-.592-.01c-.206 0-.542.077-.826.387-.283.31-1.082 1.057-1.082 2.577s1.108 2.99 1.263 3.196c.155.206 2.18 3.328 5.283 4.667.738.319 1.314.51 1.763.652.741.236 1.415.203 1.948.123.594-.089 1.828-.747 2.086-1.469.258-.722.258-1.34.18-1.469-.077-.129-.283-.206-.593-.361Z" />
    </svg>
  );
}

export const TOGGLE_MOBILE_MENU_EVENT = "teyezilla:toggle-mobile-menu";

export default function MobileTabBar({
  phoneNumber,
  prefillMessage = "Hi Teyezilla Expeditions, I'd like to know more about your tours.",
}: {
  phoneNumber: string;
  prefillMessage?: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const whatsappHref = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(prefillMessage)}`;

  function openMenu() {
    window.dispatchEvent(new Event(TOGGLE_MOBILE_MENU_EVENT));
  }

  const itemClass = (active = false) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
      active ? "text-accent" : "text-white/90"
    }`;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-white/10 bg-primary lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Quick navigation"
    >
      <Link href="/" className={itemClass(isHome)}>
        <Home className="h-5 w-5" />
        Home
      </Link>
      <button type="button" onClick={openMenu} className={itemClass()}>
        <Search className="h-5 w-5" />
        Search
      </button>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={itemClass()}>
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <button type="button" onClick={openMenu} className={itemClass()}>
        <Menu className="h-5 w-5" />
        Menu
      </button>
    </nav>
  );
}
