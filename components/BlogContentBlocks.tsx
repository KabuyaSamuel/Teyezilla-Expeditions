import type { ContentBlock } from "@/lib/blogBlocks";
import InlineMarkdown from "./InlineMarkdown";

// Groups runs of consecutive list-like blocks (bulleted/numbered/todo) into
// one wrapping <ul>/<ol> instead of each rendering its own single-item list.
type Group = { kind: "list"; type: "bulleted_list" | "numbered_list" | "todo"; blocks: ContentBlock[] } | { kind: "block"; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];
  for (const block of blocks) {
    const prev = groups[groups.length - 1];
    if (
      (block.type === "bulleted_list" || block.type === "numbered_list" || block.type === "todo") &&
      prev?.kind === "list" &&
      prev.type === block.type
    ) {
      prev.blocks.push(block);
    } else if (block.type === "bulleted_list" || block.type === "numbered_list" || block.type === "todo") {
      groups.push({ kind: "list", type: block.type, blocks: [block] });
    } else {
      groups.push({ kind: "block", block });
    }
  }
  return groups;
}

export default function BlogContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="mt-6 space-y-4 text-foreground/80">
      {groupBlocks(blocks).map((group, i) => {
        if (group.kind === "list") {
          if (group.type === "bulleted_list") {
            return (
              <ul key={i} className="list-disc space-y-1 pl-6">
                {group.blocks.map((b) => (
                  <li key={b.id}><InlineMarkdown text={b.text} /></li>
                ))}
              </ul>
            );
          }
          if (group.type === "numbered_list") {
            return (
              <ol key={i} className="list-decimal space-y-1 pl-6">
                {group.blocks.map((b) => (
                  <li key={b.id}><InlineMarkdown text={b.text} /></li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={i} className="space-y-2">
              {group.blocks.map((b) => (
                <li key={b.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={!!b.checked}
                    disabled
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span className={b.checked ? "line-through text-foreground/50" : ""}>
                    <InlineMarkdown text={b.text} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        const block = group.block;
        switch (block.type) {
          case "heading1":
            return (
              <h2 key={block.id} className="!mt-10 h2-section">
                <InlineMarkdown text={block.text} />
              </h2>
            );
          case "heading2":
            return (
              <h3 key={block.id} className="!mt-8 font-heading text-2xl font-bold text-foreground">
                <InlineMarkdown text={block.text} />
              </h3>
            );
          case "heading3":
            return (
              <h4 key={block.id} className="!mt-6 font-heading text-xl font-semibold text-foreground">
                <InlineMarkdown text={block.text} />
              </h4>
            );
          case "quote":
            return (
              <blockquote key={block.id} className="border-l-4 border-accent pl-4 italic text-foreground/70">
                <InlineMarkdown text={block.text} />
              </blockquote>
            );
          case "callout":
            return (
              <div key={block.id} className="flex gap-3 rounded-2xl bg-secondary/15 p-4">
                <span aria-hidden className="text-xl leading-none">{block.emoji || "💡"}</span>
                <p className="text-foreground/80"><InlineMarkdown text={block.text} /></p>
              </div>
            );
          case "code":
            return (
              <div key={block.id}>
                {block.language && (
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground/40">{block.language}</p>
                )}
                <pre className="overflow-x-auto rounded-2xl bg-primary px-4 py-3 text-sm text-white">
                  <code>{block.text}</code>
                </pre>
              </div>
            );
          case "toggle":
            return (
              <details key={block.id} className="rounded-2xl border border-secondary/30 p-4">
                <summary className="cursor-pointer font-medium text-foreground">
                  <InlineMarkdown text={block.summary || "Details"} />
                </summary>
                <div className="mt-3 text-foreground/70">
                  <InlineMarkdown text={block.text} />
                </div>
              </details>
            );
          case "paragraph":
          default:
            return (
              <p key={block.id}>
                <InlineMarkdown text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
