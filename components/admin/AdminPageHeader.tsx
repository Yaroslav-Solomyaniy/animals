export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
