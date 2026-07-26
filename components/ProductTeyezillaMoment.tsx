export default function ProductTeyezillaMoment({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="rounded-2xl bg-primary px-6 py-10 text-center text-white sm:px-10">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Your Teyezilla Moment</span>
      <p className="mx-auto mt-4 max-w-xl font-heading text-xl italic leading-relaxed">{text}</p>
    </div>
  );
}
