"use client";

export default function RelatedContentPicker({
  title,
  items,
  selectedIds,
  onChange,
  emptyMessage,
}: {
  title: string;
  items: { id: string; label: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  emptyMessage?: string;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  }

  return (
    <div>
      <p className="text-xs font-medium text-foreground/60">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-foreground/50">{emptyMessage ?? "Nothing available yet."}</p>
      ) : (
        <div className="mt-2 max-h-56 space-y-1.5 overflow-y-auto rounded-xl border border-secondary/20 p-3">
          {items.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggle(item.id)} />
              {item.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
