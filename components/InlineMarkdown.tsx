import type { ReactNode } from "react";

// Lightweight inline styling within a block's text: **bold**, *italic*,
// ~~strikethrough~~, `code`, and [link](url). Deliberately not a full
// markdown engine (no nesting, no block-level syntax); those are handled
// as separate block types by BlogContentBlocks.
const INLINE_PATTERN = /`([^`]+)`|\*\*([^*]+)\*\*|~~([^~]+)~~|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;

export default function InlineMarkdown({ text }: { text: string }): ReactNode {
  if (!text) return null;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, code, bold, strike, italic, linkText, linkUrl] = match;
    if (code !== undefined) {
      nodes.push(
        <code key={key++} className="rounded bg-secondary/15 px-1.5 py-0.5 text-[0.9em]">
          {code}
        </code>
      );
    } else if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>);
    } else if (strike !== undefined) {
      nodes.push(<s key={key++}>{strike}</s>);
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>);
    } else if (linkText !== undefined) {
      const isExternal = /^https?:\/\//.test(linkUrl);
      nodes.push(
        <a
          key={key++}
          href={linkUrl}
          className="text-primary underline hover:text-primary/80"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {linkText}
        </a>
      );
    }

    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
