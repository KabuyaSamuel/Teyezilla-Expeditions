import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
  metadataBase: new URL("https://www.teyezillaexpeditions.com"),
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton phoneNumber="254700000000" />
        <SpeedInsights />
      </body>
    </html>
  );
}
