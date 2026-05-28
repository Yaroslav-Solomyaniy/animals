'use client'

import type { ComponentProps, FormEventHandler, ReactNode } from 'react'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import AdminNotice from '@/components/admin/AdminNotice'
import { cn } from '@/lib/utils'

export function EntityForm({
  status = '',
  pending = false,
  submitLabel,
  onSubmit,
  action,
  formProps,
  children,
}: {
  status?: string
  pending?: boolean
  submitLabel: string
  onSubmit?: FormEventHandler<HTMLFormElement>
  action?: ComponentProps<'form'>['action']
  formProps?: Omit<ComponentProps<'form'>, 'action' | 'children' | 'className'>
  children: ReactNode
}) {
  const { onSubmit: metadataSubmit, ...restFormProps } = formProps ?? {}

  return (
    <form {...restFormProps} action={action} onSubmit={onSubmit ?? metadataSubmit} className="space-y-5">
      {status && status !== 'saving' ? <AdminNotice>{status}</AdminNotice> : null}
      {pending || status === 'saving' ? <div className="text-sm font-semibold text-primary">Збереження...</div> : null}
      {children}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="submit" disabled={pending || status === 'saving'}>
          <Save className="h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export function Field({
  label,
  errors,
  children,
}: {
  label: string
  errors?: string[]
  children: ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-extrabold text-slate-700">{label}</span>
      {children}
      {errors?.length ? (
        <span className="block text-sm font-semibold text-red-600">{errors.join(', ')}</span>
      ) : null}
    </label>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-slate-300">
      <span>{label}</span>
      <input className="peer sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={cn('relative h-7 w-12 rounded-full transition', checked ? 'bg-primary' : 'bg-slate-200')}>
        <span className={cn('absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-0')} />
      </span>
    </label>
  )
}

export function IconTool({
  label,
  children,
  onClick,
  disabled,
  danger,
}: {
  label: string
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <Button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      variant={danger ? 'danger' : 'outline'}
      size="icon"
      className="h-10 w-10"
    >
      {children}
    </Button>
  )
}

export function SmallAddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} variant="outline" size="sm">
      <Plus className="h-4 w-4" />
      {children}
    </Button>
  )
}

export function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export function emptyToNull(value: string | null | undefined) {
  if (value == null) return null
  return value.trim() === '' ? null : value
}
