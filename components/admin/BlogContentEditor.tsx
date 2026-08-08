"use client";

import { useRef, useState } from "react";
import { BLOCK_TYPES, BLOCK_TYPE_LABELS, newBlock, type BlockType, type ContentBlock } from "@/lib/blogBlocks";

const fieldClass =
  "w-full rounded-full border border-secondary/40 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const areaClass =
  "w-full rounded-2xl border border-secondary/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export default function BlogContentEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  // Keyed by block id (not index) so a ref never goes stale after a
  // reorder/delete shifts array positions out from under it.
  const textRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const [linkPopoverId, setLinkPopoverId] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState({ text: "", url: "" });

  function updateBlock(index: number, patch: Partial<ContentBlock>) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function openLinkPopover(block: ContentBlock) {
    const el = textRefs.current[block.id];
    const selected = el ? block.text.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0) : "";
    setLinkDraft({ text: selected, url: "" });
    setLinkPopoverId(block.id);
  }

  function insertLink(index: number) {
    const block = blocks[index];
    const el = textRefs.current[block.id];
    const start = el?.selectionStart ?? block.text.length;
    const end = el?.selectionEnd ?? block.text.length;
    const label = linkDraft.text.trim() || linkDraft.url.trim();
    const markdown = `[${label}](${linkDraft.url.trim()})`;
    updateBlock(index, { text: block.text.slice(0, start) + markdown + block.text.slice(end) });
    setLinkPopoverId(null);
  }

  function setType(index: number, type: BlockType) {
    const block = blocks[index];
    updateBlock(index, {
      type,
      ...(type === "callout" && !block.emoji ? { emoji: "💡" } : {}),
      ...(type === "toggle" && block.summary === undefined ? { summary: "" } : {}),
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function addBlock() {
    onChange([...blocks, newBlock("paragraph")]);
  }

  return (
    <section className="card p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Article Body</h2>
      <p className="mt-1 text-xs text-foreground/50">
        Pick a block type for each piece of content. Within any text, use{" "}
        <code className="rounded bg-secondary/15 px-1">**bold**</code>,{" "}
        <code className="rounded bg-secondary/15 px-1">*italic*</code>,{" "}
        <code className="rounded bg-secondary/15 px-1">~~strike~~</code>,{" "}
        <code className="rounded bg-secondary/15 px-1">`code`</code>, or the{" "}
        <strong>Add Link</strong> button below any field to link to another page or an outside
        source. Add a <strong>YouTube Video</strong> block to embed a video.
      </p>

      <div className="mt-4 space-y-3">
        {blocks.map((block, i) => (
          <div key={block.id} className="rounded-xl bg-secondary/10 p-3">
            <div className="flex items-center gap-2">
              <select
                value={block.type}
                onChange={(e) => setType(i, e.target.value as BlockType)}
                className="rounded-full border border-secondary/40 bg-white px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="px-1 text-xs text-foreground/40 hover:text-foreground disabled:opacity-30">▲</button>
                <button type="button" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className="px-1 text-xs text-foreground/40 hover:text-foreground disabled:opacity-30">▼</button>
                <button type="button" onClick={() => remove(i)} className="ml-2 text-xs font-medium text-error hover:underline">Delete</button>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {block.type === "todo" && (
                <label className="flex items-center gap-2 text-xs text-foreground/70">
                  <input
                    type="checkbox"
                    checked={!!block.checked}
                    onChange={(e) => updateBlock(i, { checked: e.target.checked })}
                    className="h-4 w-4 accent-primary"
                  />
                  Checked
                </label>
              )}

              {block.type === "toggle" && (
                <input
                  value={block.summary ?? ""}
                  onChange={(e) => updateBlock(i, { summary: e.target.value })}
                  placeholder="Toggle title (always visible)"
                  className={fieldClass}
                />
              )}

              {block.type === "code" && (
                <input
                  value={block.language ?? ""}
                  onChange={(e) => updateBlock(i, { language: e.target.value })}
                  placeholder="Language label (optional, e.g. JavaScript)"
                  className={fieldClass}
                />
              )}

              {block.type === "callout" && (
                <input
                  value={block.emoji ?? ""}
                  onChange={(e) => updateBlock(i, { emoji: e.target.value })}
                  placeholder="💡"
                  maxLength={4}
                  className="w-20 rounded-full border border-secondary/40 px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}

              {block.type === "video" && (
                <input
                  value={block.url ?? ""}
                  onChange={(e) => updateBlock(i, { url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className={fieldClass}
                />
              )}

              {["heading1", "heading2", "heading3", "bulleted_list", "numbered_list"].includes(block.type) ? (
                <input
                  ref={(el) => { textRefs.current[block.id] = el; }}
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  placeholder={block.type === "toggle" ? "Hidden content" : "Text"}
                  className={fieldClass}
                />
              ) : (
                <textarea
                  ref={(el) => { textRefs.current[block.id] = el; }}
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  placeholder={
                    block.type === "toggle"
                      ? "Hidden content"
                      : block.type === "video"
                        ? "Caption (optional)"
                        : "Text"
                  }
                  rows={block.type === "code" ? 4 : 2}
                  className={`${areaClass} ${block.type === "code" ? "font-mono" : ""}`}
                />
              )}

              {block.type !== "code" && (
                <button
                  type="button"
                  onClick={() => openLinkPopover(block)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  🔗 Add link
                </button>
              )}

              {linkPopoverId === block.id && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-secondary/30">
                  <input
                    autoFocus
                    value={linkDraft.text}
                    onChange={(e) => setLinkDraft((d) => ({ ...d, text: e.target.value }))}
                    placeholder="Link text"
                    className="min-w-0 flex-1 rounded-full border border-secondary/40 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    value={linkDraft.url}
                    onChange={(e) => setLinkDraft((d) => ({ ...d, url: e.target.value }))}
                    placeholder="https://... or /destinations/kenya"
                    className="min-w-0 flex-1 rounded-full border border-secondary/40 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    disabled={!linkDraft.url.trim()}
                    onClick={() => insertLink(i)}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                  >
                    Insert
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkPopoverId(null)}
                    className="text-xs text-foreground/50 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <p className="text-sm text-foreground/50">No content blocks yet. Add the first one below.</p>
        )}
      </div>

      <button type="button" onClick={addBlock} className="mt-4 text-sm font-medium text-primary hover:underline">
        + Add Block
      </button>
    </section>
  );
}
