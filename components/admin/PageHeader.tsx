export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-bold text-foreground break-words">{title}</h1>
        {description && <p className="mt-1 break-words text-sm text-foreground/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
