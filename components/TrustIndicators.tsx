import { Award, ShieldCheck, Gem, Leaf } from "lucide-react";

const INDICATORS = [
  {
    icon: Award,
    title: "Local Experts",
    desc: "Passionate guides with deep local knowledge.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    desc: "Your safety and comfort are our priority.",
  },
  {
    icon: Gem,
    title: "Quality Experiences",
    desc: "Handpicked activities and premium services.",
  },
  {
    icon: Leaf,
    title: "Sustainable Tourism",
    desc: "Travel responsibly and support local communities.",
  },
];

export default function TrustIndicators() {
  return (
    <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
      <div className="grid gap-6 rounded-2xl bg-primary px-8 py-10 shadow-cardHover sm:grid-cols-2 lg:grid-cols-4">
        {INDICATORS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
            <div>
              <p className="font-heading text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs text-white/70">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
