"use client";

import { useState } from "react";
import type { AdminFaq } from "@/lib/admin/data/faqs";
import { createFaq, updateFaq, deleteFaq } from "@/lib/admin/actions/faqs";
import { useToast } from "./Toast";

function isRedirectError(err: unknown): boolean {
  return !!err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT");
}

export default function FaqForm({ existingFaq }: { existingFaq?: AdminFaq }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const input = {
      category: String(formData.get("category") ?? "safari-guide"),
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      status: String(formData.get("status") ?? "draft"),
      displayOrder: Number(formData.get("displayOrder") ?? 0),
    };

    try {
      if (existingFaq) {
        await updateFaq(existingFaq.id, input);
      } else {
        await createFaq(input);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to save FAQ.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingFaq) return;
    if (!confirm(`Delete this FAQ? This can't be undone.`)) return;
    setSaving(true);
    try {
      await deleteFaq(existingFaq.id);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      const message = err instanceof Error ? err.message : "Failed to delete FAQ.";
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{error}</div>}
      <p className="text-xs text-foreground/50">Fields marked with <span className="text-error">*</span> are required.</p>

      <section className="card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">FAQ Details</h2>
        <p className="mt-1 text-xs text-foreground/50">
          Only the &ldquo;safari-guide&rdquo; category is shown publicly today (on /faqs and /safari) --
          a new category needs a developer to wire up a page for it before it&apos;ll be visible anywhere.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="text-xs font-medium text-foreground/60">Category <span className="text-error">*</span></label>
            <input id="category" name="category" required defaultValue={existingFaq?.category ?? "safari-guide"} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="displayOrder" className="text-xs font-medium text-foreground/60">Display Order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={existingFaq?.displayOrder ?? 0} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="question" className="text-xs font-medium text-foreground/60">Question <span className="text-error">*</span></label>
          <input id="question" name="question" required defaultValue={existingFaq?.question} className="mt-1 w-full rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="mt-4">
          <label htmlFor="answer" className="text-xs font-medium text-foreground/60">Answer <span className="text-error">*</span></label>
          <textarea id="answer" name="answer" required defaultValue={existingFaq?.answer} rows={4} className="mt-1 w-full rounded-2xl border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </section>

      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <select id="status" name="status" defaultValue={existingFaq?.status ?? "draft"} className="rounded-full border border-secondary/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="flex flex-wrap gap-3">
          {existingFaq && (
            <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border-2 border-error px-5 py-2 text-sm font-medium text-error hover:bg-error hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save FAQ"}
          </button>
        </div>
      </section>
    </form>
  );
}
