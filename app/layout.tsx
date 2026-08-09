import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/site";
import { env } from "@/lib/env";
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
    default: "Teyezilla Expeditions | Extraordinary Journeys. Wild Places. Deeper Connections.",
    template: "%s | Teyezilla Expeditions",
  },
  description:
    "Discover Africa with Teyezilla Expeditions: signature safaris, multi-country journeys, handpicked experiences, and bespoke private travel across 14 destinations, crafted by locals who know these places best.",
  openGraph: {
    title: "Teyezilla Expeditions | Extraordinary Journeys. Wild Places. Deeper Connections.",
    description:
      "Signature safaris, multi-country journeys, and handpicked experiences across Africa. Tailor-made travel with Teyezilla Expeditions.",
    siteName: "Teyezilla Expeditions",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teyezilla Expeditions | Extraordinary Journeys. Wild Places. Deeper Connections.",
    description:
      "Signature safaris, multi-country journeys, and handpicked experiences across Africa. Tailor-made travel with Teyezilla Expeditions.",
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
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />}
      </body>
    </html>
  );
}
