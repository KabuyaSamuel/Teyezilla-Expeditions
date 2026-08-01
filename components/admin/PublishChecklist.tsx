// A soft readiness hint next to the Status field -- the real gate is the
// server-side check in createTour/updateTour/createJourney/updateJourney
// (status="published" requires these same fields), so this can only ever
// under-report on a brand-new unsaved form; it never blocks saving as a
// draft.

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export default function PublishChecklist({ items }: { items: ChecklistItem[] }) {
  const missing = items.filter((i) => !i.done);

  return (
    <div className="rounded-xl bg-secondary/10 p-4 text-sm">
      <p className="font-medium text-foreground">
        {missing.length === 0 ? "Ready to publish" : `${missing.length} item${missing.length === 1 ? "" : "s"} needed to publish`}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item.label} className={`flex items-center gap-2 ${item.done ? "text-foreground/50" : "text-error"}`}>
            <span>{item.done ? "✓" : "○"}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
