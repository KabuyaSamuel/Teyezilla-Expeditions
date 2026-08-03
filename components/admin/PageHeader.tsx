import BackButton from "./BackButton";

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
      <div className="flex min-w-0 items-start gap-2">
        <div className="pt-0.5">
          <BackButton />
        </div>
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold text-foreground break-words">{title}</h1>
          {description && <p className="mt-1 break-words text-sm text-foreground/60">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
