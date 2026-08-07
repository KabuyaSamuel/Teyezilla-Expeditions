"use client";

import { useState } from "react";
import type { FaqInput } from "@/lib/admin/actions/productShared";
import { SortableList, SortableItem, arrayMoveIndex } from "./SortableList";

export default function FaqsEditor({
  faqs,
  onChange,
}: {
  faqs: FaqInput[];
  onChange: (faqs: FaqInput[]) => void;
}) {
  // Client-only drag identity -- faqs carry no DB id in form state
  // (delete-then-reinserted on save, ordered by array position). Kept in
  // lockstep with `faqs` by every function below that changes its length or
  // order; editing a field never touches this.
  const [ids, setIds] = useState<string[]>(() => faqs.map(() => crypto.randomUUID()));

  function update(index: number, field: keyof FaqInput, value: string) {
    onChange(faqs.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  }
  function add() {
    onChange([...faqs, { question: "", answer: "" }]);
    setIds((prev) => [...prev, crypto.randomUUID()]);
  }
  function remove(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
    setIds((prev) => prev.filter((_, i) => i !== index));
  }
  function reorder(oldIndex: number, newIndex: number) {
    onChange(arrayMoveIndex(faqs, oldIndex, newIndex));
    setIds((prev) => arrayMoveIndex(prev, oldIndex, newIndex));
  }

  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">FAQs</h2>
          <p className="mt-1 text-xs text-foreground/50">
            Shown as an accordion on the public page, and included in its FAQ structured data.
          </p>
        </div>
        <button type="button" onClick={add} className="text-sm font-medium text-primary hover:underline">
          + Add FAQ
        </button>
      </div>
      <SortableList ids={ids} onReorder={reorder}>
        <div className="mt-4 space-y-3">
          {faqs.map((f, i) => (
            <SortableItem key={ids[i]} id={ids[i]}>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">FAQ {i + 1}</p>
                  <button type="button" onClick={() => remove(i)} className="text-xs font-medium text-error hover:underline">
                    Remove
                  </button>
                </div>
                <input
                  value={f.question}
                  onChange={(e) => update(i, "question", e.target.value)}
                  placeholder="Question"
                  className="mt-2 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={f.answer}
                  onChange={(e) => update(i, "answer", e.target.value)}
                  placeholder="Answer"
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
