"use client";

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
  function updateBlock(index: number, patch: Partial<ContentBlock>) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
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
        <code className="rounded bg-secondary/15 px-1">`code`</code>, or{" "}
        <code className="rounded bg-secondary/15 px-1">[text](url)</code> for links.
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

              {["heading1", "heading2", "heading3", "bulleted_list", "numbered_list"].includes(block.type) ? (
                <input
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  placeholder={block.type === "toggle" ? "Hidden content" : "Text"}
                  className={fieldClass}
                />
              ) : (
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  placeholder={block.type === "toggle" ? "Hidden content" : "Text"}
                  rows={block.type === "code" ? 4 : 2}
                  className={`${areaClass} ${block.type === "code" ? "font-mono" : ""}`}
                />
              )}
            </div>
          </div>
        ))}

        {blocks.length === 0 && (
          <p className="text-sm text-foreground/50">No content blocks yet — add the first one below.</p>
        )}
      </div>

      <button type="button" onClick={addBlock} className="mt-4 text-sm font-medium text-primary hover:underline">
        + Add Block
      </button>
    </section>
  );
}
