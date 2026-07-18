const COLOR_MAP: Record<string, string> = {
  // status-neutral defaults; pass a matching key or fall back to gray
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  pending: "bg-accent/15 text-accent",
  info: "bg-primary/10 text-primary",
  neutral: "bg-secondary/20 text-foreground/70",
};

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof COLOR_MAP;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${COLOR_MAP[tone]}`}>
      {children}
    </span>
  );
}
