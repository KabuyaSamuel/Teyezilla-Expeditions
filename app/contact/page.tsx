import type { Metadata } from "next";

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
      <form className="mt-8 space-y-4">
        <input id="name" name="name" type="text" autoComplete="name" placeholder="Full name" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input id="email" name="email" type="email" autoComplete="email" placeholder="Email" className="w-full rounded-full border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <textarea id="message" name="message" placeholder="Message" rows={5} className="w-full rounded-2xl border border-secondary/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button type="submit" className="btn-primary">Send Message</button>
      </form>
    </div>
  );
}
