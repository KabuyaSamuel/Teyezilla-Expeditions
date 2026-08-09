"use client";

import { useState } from "react";
import Badge from "@/components/admin/Badge";
import {
  createStatusOption,
  deleteStatusOption,
  reorderStatusOptions,
  updateStatusOption,
} from "@/lib/admin/actions/status-options";
import type { StatusCategory, StatusOption, StatusTone } from "@/lib/admin/data/status-options";
import { useToast } from "./Toast";

const TONES: StatusTone[] = ["neutral", "info", "pending", "success", "error"];

export default function StatusOptionsManager({
  category,
  title,
  description,
  options,
}: {
  category: StatusCategory;
  title: string;
  description: string;
  options: StatusOption[];
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newTone, setNewTone] = useState<StatusTone>("neutral");

  // successMessage is only passed for deliberate actions (add/delete) --
  // reordering and inline label/tone edits stay quiet on success (a toast
  // per arrow click or blur would be noise) but still surface errors.
  async function run(fn: () => Promise<void>, successMessage?: string) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      if (successMessage) toast.success(successMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= options.length) return;
    const reordered = [...options];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    run(() => reorderStatusOptions(category, reordered.map((o) => o.id)));
  }

  return (
    <div className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-foreground/50">{description}</p>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}

      <div className="mt-4 space-y-2">
        {options.map((o, i) => (
          <div
            key={o.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-secondary/20 px-3 py-2"
          >
            <div className="flex flex-col leading-none">
              <button
                type="button"
                disabled={busy || i === 0}
                onClick={() => move(i, -1)}
                className="px-1 text-xs text-foreground/40 hover:text-foreground disabled:opacity-30"
                aria-label={`Move ${o.label} up`}
              >
                ▲
              </button>
              <button
                type="button"
                disabled={busy || i === options.length - 1}
                onClick={() => move(i, 1)}
                className="px-1 text-xs text-foreground/40 hover:text-foreground disabled:opacity-30"
                aria-label={`Move ${o.label} down`}
              >
                ▼
              </button>
            </div>

            <input
              key={`${o.id}-${o.label}`}
              defaultValue={o.label}
              disabled={busy}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value && value !== o.label) run(() => updateStatusOption(o.id, { label: value }));
              }}
              className="min-w-[8rem] flex-1 rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={o.tone}
              disabled={busy}
              onChange={(e) => run(() => updateStatusOption(o.id, { tone: e.target.value as StatusTone }))}
              className="rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <Badge tone={o.tone}>{o.label}</Badge>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (confirm(`Delete "${o.label}"?`)) run(() => deleteStatusOption(o.id), `"${o.label}" deleted.`);
              }}
              className="ml-auto text-xs font-medium text-error hover:underline disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-foreground/50">No statuses yet. Add the first one below.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-secondary/20 pt-4">
        <input
          placeholder="New status label…"
          value={newLabel}
          disabled={busy}
          onChange={(e) => setNewLabel(e.target.value)}
          className="min-w-[10rem] flex-1 rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={newTone}
          disabled={busy}
          onChange={(e) => setNewTone(e.target.value as StatusTone)}
          className="rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || !newLabel.trim()}
          onClick={() =>
            run(async () => {
              await createStatusOption(category, newLabel, newTone);
              setNewLabel("");
              setNewTone("neutral");
            }, `"${newLabel}" added.`)
          }
          className="btn-primary px-4 py-1.5 text-sm disabled:opacity-40"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
