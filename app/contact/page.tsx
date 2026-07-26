import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Teyezilla Expeditions by WhatsApp, email, or contact form.",
};

export default function ContactPage() {
  return (
    <div className="section max-w-2xl">
      <h1 className="font-heading text-4xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-4 text-foreground/70">
        WhatsApp: +254 700 000 000 · Email: hello@teyezillaexpeditions.com
      </p>
      <ContactForm />
    </div>
  );
}
