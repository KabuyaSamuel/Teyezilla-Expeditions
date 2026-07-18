const REASONS = [
  { title: "Local Travel Experts", desc: "Guides and planners who live where they guide." },
  { title: "Personalized Itineraries", desc: "Every trip is shaped around how you want to travel." },
  { title: "Transparent Pricing", desc: "No hidden fees — what you see is what you pay." },
  { title: "Flexible Booking", desc: "Deposit options and easy date changes." },
  { title: "Handpicked Experiences", desc: "Every tour is vetted before it makes the list." },
];

export default function WhyChoose() {
  return (
    <section className="section">
      <h2 className="font-heading text-3xl font-bold text-foreground">
        Why Choose Teyezilla Expeditions?
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {REASONS.map((reason) => (
          <div key={reason.title} className="card p-6">
            <div className="mb-3 h-10 w-10 rounded-full bg-primary/10 text-center font-heading text-lg font-bold leading-10 text-primary">
              ✓
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              {reason.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/70">{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
