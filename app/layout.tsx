import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Teyezilla Expeditions | Extraordinary Journeys Across Africa",
    template: "%s | Teyezilla Expeditions",
  },
  description:
    "Discover Africa with Teyezilla Expeditions. Unforgettable safaris in Kenya and Tanzania, Zanzibar beach escapes, the ancient wonders of Egypt, and the vibrant culture of Morocco.",
  openGraph: {
    title: "Teyezilla Expeditions | Extraordinary Journeys Across Africa",
    description:
      "Premium, tailor-made African travel across Kenya, Tanzania, Zanzibar, Egypt, and Morocco.",
    siteName: "Teyezilla Expeditions",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teyezilla Expeditions | Extraordinary Journeys Across Africa",
    description:
      "Premium, tailor-made African travel across Kenya, Tanzania, Zanzibar, Egypt, and Morocco.",
    images: ["/og-image.png"],
  },
};

// Deliberately bare: the public Navbar/Footer/WhatsApp button live in
// app/(public)/layout.tsx instead of here, so /admin/* (which sits outside
// that route group) never renders them, and this layout never needs a
// dynamic per-request check that would force the whole app out of static
// generation. See app/(public)/layout.tsx for why.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
