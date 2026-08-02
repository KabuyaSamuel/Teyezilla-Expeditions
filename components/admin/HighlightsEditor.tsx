"use client";

import { useState } from "react";
import type { HighlightInput } from "@/lib/admin/actions/productShared";
import { SortableList, SortableItem, arrayMoveIndex } from "./SortableList";

export default function HighlightsEditor({
  highlights,
  onChange,
}: {
  highlights: HighlightInput[];
  onChange: (highlights: HighlightInput[]) => void;
}) {
  // Client-only drag identity -- highlights carry no DB id in form state
  // (delete-then-reinserted on save, ordered by array position). Kept in
  // lockstep with `highlights` by every function below that changes its
  // length or order; editing a field never touches this.
  const [ids, setIds] = useState<string[]>(() => highlights.map(() => crypto.randomUUID()));

  function update(index: number, field: keyof HighlightInput, value: string) {
    onChange(highlights.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  }
  function add() {
    onChange([...highlights, { title: "", description: "" }]);
    setIds((prev) => [...prev, crypto.randomUUID()]);
  }
  function remove(index: number) {
    onChange(highlights.filter((_, i) => i !== index));
    setIds((prev) => prev.filter((_, i) => i !== index));
  }
  function reorder(oldIndex: number, newIndex: number) {
    onChange(arrayMoveIndex(highlights, oldIndex, newIndex));
    setIds((prev) => arrayMoveIndex(prev, oldIndex, newIndex));
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Highlights</h2>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add Highlight
        </button>
      </div>
      <SortableList ids={ids} onReorder={reorder}>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Highlight {i + 1}</p>
                  <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                    Remove
                  </button>
                </div>
                <input
                  value={h.title}
                  onChange={(e) => update(i, "title", e.target.value)}
                  placeholder="Title"
                  className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={h.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="mt-2 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableList>
    </section>
  );
}
