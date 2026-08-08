import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Mail, Clock, HelpCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { buildSocialLinks } from "@/components/SocialIcons";
import { getSiteSetting } from "@/lib/settings";
import { whatsappLink } from "@/lib/enquiry-shared";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Teyezilla Expeditions by WhatsApp, email, or contact form.",
};

export default async function ContactPage() {
  const [contactEmail, instagramUrl, facebookUrl, tiktokUrl, youtubeUrl] = await Promise.all([
    getSiteSetting("contactEmail"),
    getSiteSetting("instagramUrl"),
    getSiteSetting("facebookUrl"),
    getSiteSetting("tiktokUrl"),
    getSiteSetting("youtubeUrl"),
  ]);
  const email = contactEmail || "hello@teyezillaexpeditions.com";
  const socialLinks = buildSocialLinks({ instagramUrl, facebookUrl, tiktokUrl, youtubeUrl });

  return (
    <div className="section">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Get In Touch</span>
        <h1 className="mt-3 h1-page">We&apos;d Love To Hear From You</h1>
        <p className="mt-4 intro-text text-foreground/70">
          Questions about a destination, travel advice, or just want to say hi? Send us a message
          and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:items-start">
        <div className="space-y-6">
          <a
            href={whatsappLink("Hi! I have a question about Teyezilla Expeditions.")}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-start gap-4 p-5 transition-colors hover:bg-primary/5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-heading font-semibold text-foreground">Chat on WhatsApp</p>
              <p className="mt-1 text-sm text-foreground/70">Usually replies within a few hours</p>
            </div>
          </a>

          <a href={`mailto:${email}`} className="card flex items-start gap-4 p-5 transition-colors hover:bg-primary/5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-heading font-semibold text-foreground">Email Us</p>
              <p className="mt-1 text-sm text-foreground/70">{email}</p>
            </div>
          </a>

          <div className="card flex items-start gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-heading font-semibold text-foreground">Response Time</p>
              <p className="mt-1 text-sm text-foreground/70">We reply to every message within 24 hours.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/10 p-5">
            <p className="flex items-center gap-2 font-heading font-semibold text-foreground">
              <HelpCircle className="h-5 w-5 text-primary" />
              Already have a booking?
            </p>
            <p className="mt-1 text-sm text-foreground/70">
              For questions about an existing reservation, visit our booking information page instead.
            </p>
            <Link href="/booking-information" className="btn-outline mt-3 inline-block px-4 py-2 text-xs">
              Booking Information
            </Link>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">Follow Us</p>
              <div className="mt-3 flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
