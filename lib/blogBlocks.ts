// A simple block-based content model for blog posts, inspired by Notion's
// block types but deliberately scoped down: no drag-and-drop, no nested
// blocks, no equations/mentions. Each block is one row in the admin editor
// with a type picker; inline styling (bold/italic/etc.) is typed directly
// as lightweight markdown within a block's text and parsed at render time.

export const BLOCK_TYPES = [
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bulleted_list",
  "numbered_list",
  "todo",
  "toggle",
  "quote",
  "callout",
  "code",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  paragraph: "Text",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bulleted_list: "Bulleted List",
  numbered_list: "Numbered List",
  todo: "To-do List",
  toggle: "Toggle List",
  quote: "Quote",
  callout: "Callout",
  code: "Code",
};

export interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  summary?: string; // toggle only, the always-visible clickable header
  checked?: boolean; // todo only
  emoji?: string; // callout only
  language?: string; // code only, a plain label, no syntax highlighting engine
}

export function newBlock(type: BlockType = "paragraph"): ContentBlock {
  return {
    id: crypto.randomUUID(),
    type,
    text: "",
    ...(type === "callout" ? { emoji: "💡" } : {}),
    ...(type === "toggle" ? { summary: "" } : {}),
  };
}
