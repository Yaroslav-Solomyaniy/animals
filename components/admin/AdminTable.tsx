export function AdminTable({
  columns,
  children,
}: {
  columns: string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div
        className="grid gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-extrabold uppercase text-slate-500"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  )
}

export function AdminTableRow({
  columns,
}: {
  columns: React.ReactNode[]
}) {
  return (
    <div
      className="grid gap-4 px-5 py-4 text-sm transition hover:bg-slate-50"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
    >
      {columns.map((column, index) => (
        <div key={index} className="min-w-0">
          {column}
        </div>
      ))}
    </div>
  )
}
