import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Teyezilla Expeditions is a local-expert-led African travel company.",
};

export default function AboutPage() {
  return (
    <div className="section max-w-3xl">
      <h1 className="font-heading text-4xl font-bold text-foreground">About Teyezilla Expeditions</h1>
      <p className="mt-4 text-foreground/70">
        Teyezilla Expeditions was built to make extraordinary African travel accessible,
        transparent, and personal — planned by local experts who know these destinations
        firsthand.
      </p>
    </div>
  );
}
