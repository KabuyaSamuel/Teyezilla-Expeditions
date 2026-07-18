const INDICATORS = [
  "5-Star Rated Experiences",
  "Local Expert Guides",
  "Secure Online Booking",
  "Custom Itineraries",
  "24/7 Customer Support",
];

export default function TrustIndicators() {
  return (
    <div className="border-y border-secondary/30 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-6 text-sm font-medium text-foreground/80">
        {INDICATORS.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span className="text-accent">✔</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
