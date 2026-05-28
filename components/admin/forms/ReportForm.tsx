'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input, Textarea } from '@/components/ui/FormControls'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ReportRow } from '@/lib/admin-types'
import { Checkbox, EntityForm, Field, emptyToNull, toDatetimeLocal } from '@/components/admin/forms/shared'

const supabase = getSupabaseBrowserClient()

const emptyReport = (): Omit<ReportRow, 'id'> => ({
  title: '',
  month: '',
  year: String(new Date().getFullYear()),
  summary: '',
  file_url: '',
  file_r2_key: '',
  is_published: false,
  published_at: null,
})

export function ReportForm({ initial, mode }: { initial?: ReportRow; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          month: initial.month ?? '',
          year: initial.year ?? '',
          summary: initial.summary ?? '',
          file_url: initial.file_url ?? '',
          file_r2_key: initial.file_r2_key ?? '',
          is_published: Boolean(initial.is_published),
          published_at: initial.published_at,
        }
      : emptyReport()
  )
  const [status, setStatus] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    const payload = normalizeReportPayload(form)
    const result =
      mode === 'create'
        ? await supabase.from('reports').insert(payload).select('id').single()
        : await supabase.from('reports').update(payload).eq('id', initial!.id).select('id').single()

    if (result.error) {
      setStatus(result.error.message)
      return
    }

    router.push(`/admin/reports/${result.data?.id ?? initial?.id}`)
    router.refresh()
  }

  return (
    <EntityForm status={status} submitLabel={mode === 'create' ? 'Створити звіт' : 'Зберегти зміни'} onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Назва"><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></Field>
        <Field label="Місяць"><Input value={form.month ?? ''} onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))} /></Field>
        <Field label="Рік"><Input value={form.year ?? ''} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} /></Field>
        <Field label="Дата публікації"><Input type="datetime-local" value={toDatetimeLocal(form.published_at)} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value || null }))} /></Field>
        <Field label="File URL"><Input value={form.file_url ?? ''} onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))} /></Field>
        <Field label="File R2 key"><Input value={form.file_r2_key ?? ''} onChange={(e) => setForm((p) => ({ ...p, file_r2_key: e.target.value }))} /></Field>
      </div>
      <Checkbox label="Опубліковано" checked={Boolean(form.is_published)} onChange={(checked) => setForm((p) => ({ ...p, is_published: checked }))} />
      <Field label="Summary"><Textarea value={form.summary ?? ''} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} /></Field>
    </EntityForm>
  )
}

function normalizeReportPayload(form: ReturnType<typeof emptyReport>) {
  return {
    ...form,
    month: emptyToNull(form.month),
    year: emptyToNull(form.year),
    summary: emptyToNull(form.summary),
    file_url: emptyToNull(form.file_url),
    file_r2_key: emptyToNull(form.file_r2_key),
    published_at: emptyToNull(form.published_at),
  }
}
