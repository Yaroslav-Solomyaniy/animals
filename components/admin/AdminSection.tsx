import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AdminSectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function AdminSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: AdminSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-6',
        className
      )}
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-extrabold uppercase text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  )
}
