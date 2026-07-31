// Shared list-view shell for every admin table. Renders a real <table> from
// md: (768px) up -- tablets get the real table, not a compressed mobile
// layout -- and a stacked card list below that, since reading an 8-column
// booking row on a phone by scrolling sideways (the old overflow-x-auto
// fallback) technically works but isn't something staff can actually use.
// Each table keeps full control of what its mobile card shows via
// renderMobileCard: not every column needs to appear there, only what staff
// actually scan for (see MobileCardField below for the common label/value row).

export interface ResponsiveTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Defaults to text-foreground/70; pass e.g. "font-medium text-foreground" for the primary column. */
  className?: string;
}

export default function ResponsiveTable<T>({
  columns,
  rows,
  keyField,
  emptyMessage = "No records yet.",
  renderMobileCard,
}: {
  columns: ResponsiveTableColumn<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
  renderMobileCard: (row: T) => React.ReactNode;
}) {
  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-secondary/20 text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-5 py-3">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={keyField(row)} className="border-b border-secondary/10 last:border-0">
                {columns.map((col, i) => (
                  <td key={i} className={`px-5 py-3 ${col.className ?? "text-foreground/70"}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-6 text-center text-sm text-foreground/50">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={keyField(row)} className="card p-4">
            {renderMobileCard(row)}
          </div>
        ))}
        {rows.length === 0 && (
          <div className="card p-6 text-center text-sm text-foreground/50">{emptyMessage}</div>
        )}
      </div>
    </>
  );
}

export function MobileCardField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-sm">
      <span className="text-foreground/50">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function MobileCardHeader({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{title}</p>
        {subtitle && <p className="truncate text-xs text-foreground/60">{subtitle}</p>}
      </div>
      <div className="shrink-0 text-sm font-medium text-primary">{action}</div>
    </div>
  );
}
