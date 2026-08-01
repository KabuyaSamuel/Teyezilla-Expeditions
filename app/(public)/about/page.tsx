import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Teyezilla Expeditions is a premium African travel company founded by Paul Teye, creating authentic, personalized journeys across Kenya and beyond.",
};

const WHY_TRAVEL_WITH_US = [
  {
    title: "Authentic Experiences",
    desc: "We take you beyond the typical tourist experience and help you discover the true character of Africa.",
  },
  {
    title: "Personalized Journeys",
    desc: "Every traveler is different. We create experiences that match your interests, travel style, time, and expectations.",
  },
  {
    title: "Local Knowledge",
    desc: "Our experiences are built around local expertise and a genuine understanding of the destinations we showcase.",
  },
  {
    title: "Exceptional Service",
    desc: "From your first inquiry to the end of your journey, we are committed to making your experience seamless and memorable.",
  },
  {
    title: "Adventure Without Limits",
    desc: "From wildlife safaris and cultural encounters to coastal adventures and off-the-beaten-path expeditions, Africa is yours to explore.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="section max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          About Teyezilla Expeditions
        </span>
        <h1 className="mt-3 h1-page">
          Discover Africa. Experience the Extraordinary.
        </h1>
        <p className="mt-6 intro-text text-foreground/70">
          Teyezilla Expeditions is a premium African travel and expedition company dedicated to
          creating extraordinary journeys across Kenya and beyond. We specialize in authentic,
          immersive, and carefully curated travel experiences that connect travelers with
          Africa&apos;s breathtaking landscapes, incredible wildlife, rich cultures, vibrant
          cities, and hidden gems.
        </p>
        <p className="mt-4 text-foreground/70">
          From unforgettable safari adventures and cultural encounters to coastal escapes, nature
          expeditions, city experiences, and tailor-made journeys, we design experiences that go
          beyond simply visiting a destination. Every journey is thoughtfully planned to help our
          guests experience Africa in a meaningful, comfortable, and memorable way.
        </p>
      </div>

      <div className="bg-secondary/10">
        <div className="section max-w-3xl">
          <h2 className="h2-section">Our Story</h2>
          <p className="mt-4 text-foreground/70">
            Teyezilla Expeditions was founded by <strong className="text-foreground">Paul Teye</strong>,
            a passionate tour guide, traveler, and explorer with a deep appreciation for Africa
            and its incredible diversity.
          </p>
          <p className="mt-4 text-foreground/70">
            Through years of connecting with travelers and exploring the beauty of Kenya, Paul
            developed a vision to create a travel company that would introduce visitors to Africa
            in a more authentic and personal way. His goal was simple: to create journeys where
            travelers do not just see Africa, but truly experience it.
          </p>
          <p className="mt-4 text-foreground/70">
            From the vast savannahs of the Maasai Mara and the spectacular Great Migration to the
            vibrant streets of Nairobi, the traditions of local communities, the breathtaking
            landscapes of the Rift Valley, and the tropical beauty of the Kenyan coast, Paul
            believes that every destination has a story waiting to be discovered.
          </p>
          <p className="mt-4 text-foreground/70">
            That vision became Teyezilla Expeditions: a brand built on passion, authenticity,
            adventure, and exceptional hospitality.
          </p>
        </div>
      </div>

      <div className="section max-w-3xl">
        <h2 className="h2-section">Our Philosophy</h2>
        <p className="mt-4 text-foreground/70">
          At Teyezilla Expeditions, we believe that travel is more than visiting places. It is
          about the moments you experience, the people you meet, the cultures you discover, and
          the stories you take home.
        </p>
        <p className="mt-4 text-foreground/70">
          We are passionate about creating journeys that bring travelers closer to the real Africa
          while maintaining high standards of professionalism, safety, comfort, and personalized
          service.
        </p>
        <p className="mt-4 text-foreground/70">
          Whether you are embarking on your first African safari, seeking an authentic cultural
          experience, planning a romantic escape, looking for an unforgettable adventure, or
          dreaming of a completely tailor-made African journey, we are here to make it
          extraordinary.
        </p>
      </div>

      <div className="section max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-4 text-foreground/70">
              Our mission is to showcase the very best of Africa to the world through exceptional
              travel experiences that are authentic, responsible, personalized, and unforgettable.
            </p>
            <p className="mt-4 text-foreground/70">
              We aim to create meaningful connections between travelers and destinations while
              supporting local communities, celebrating African culture, and promoting responsible
              tourism.
            </p>
          </div>
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="mt-4 text-foreground/70">
              Our vision is to build a world-class African travel brand recognized globally for
              exceptional experiences, outstanding service, and authentic journeys that inspire
              people to explore, connect, and discover Africa.
            </p>
            <p className="mt-4 text-foreground/70">
              We want every traveler who journeys with Teyezilla Expeditions to leave with more
              than photographs; they should leave with stories, memories, and a deeper connection
              to Africa.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/10">
        <div className="section">
          <h2 className="h2-section">
            Why Travel With Teyezilla Expeditions?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_TRAVEL_WITH_US.map((reason) => (
              <div key={reason.title} className="card p-6">
                <Check className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section max-w-3xl text-center">
        <h2 className="h2-section">Your Journey Begins Here</h2>
        <p className="mt-4 text-foreground/70">
          Africa is not just a destination. It is a feeling, a story, an adventure, and an
          experience that stays with you long after you return home.
        </p>
        <p className="mt-4 text-foreground/70">
          At Teyezilla Expeditions, we invite you to discover Africa through our eyes, experience
          its wonders, connect with its people, and create memories that will last a lifetime.
        </p>
        <p className="mt-6 font-heading text-lg font-semibold text-primary">
          Explore Africa. Experience More. Travel with Teyezilla.
        </p>
        <Link href="/destinations" className="btn-primary mt-8 inline-flex">
          Start Exploring →
        </Link>
      </div>
    </div>
  );
}
