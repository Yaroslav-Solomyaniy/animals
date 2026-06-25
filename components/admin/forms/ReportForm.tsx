'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, FileText, FileUp, Loader2, Plus, Save, ScrollText, Trash2 } from 'lucide-react'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ReportFile, ReportRow } from '@/lib/admin-types'
import { Field, toDatetimeLocal } from '@/components/admin/forms/shared'
import { createReportFileUploadAction, deleteReportFileAction } from '@/app/admin/reports/media-actions'

const supabase = getSupabaseBrowserClient()

type FormState = {
  title: string
  period: string
  description: string
  published_at: string
  is_published: boolean
  files: ReportFile[]
}

function getTodayDatetimeLocal() {
  const now = new Date()
  now.setSeconds(0, 0)
  return now.toISOString().slice(0, 16)
}

const emptyForm = (): FormState => ({
  title: '',
  period: '',
  description: '',
  published_at: getTodayDatetimeLocal(),
  is_published: false,
  files: [],
})

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ReportForm({ initial, mode }: { initial?: ReportRow; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          title: initial.title,
          period: initial.period ?? '',
          description: initial.description ?? '',
          published_at: toDatetimeLocal(initial.published_at) || getTodayDatetimeLocal(),
          is_published: Boolean(initial.is_published),
          files: Array.isArray(initial.files) ? initial.files : [],
        }
      : emptyForm()
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reportId = initial?.id ?? 'new'

  async function handleFileAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const { uploadUrl, publicUrl, r2Key } = await createReportFileUploadAction({
            reportId,
            fileName: file.name,
          })
          await fetch(uploadUrl, { method: 'PUT', body: file })
          return { name: file.name, src: publicUrl, r2Key, size: file.size } satisfies ReportFile
        })
      )
      setForm((p) => ({ ...p, files: [...p.files, ...uploaded] }))
    } catch {
      setError('Помилка завантаження файлу')
    } finally {
      setUploading(false)
    }
  }

  async function handleFileRemove(index: number) {
    const file = form.files[index]
    if (file.r2Key) await deleteReportFileAction(file.r2Key)
    setForm((p) => ({ ...p, files: p.files.filter((_, i) => i !== index) }))
  }

  async function handleSubmit() {
    setIsSaving(true)
    setError('')
    const payload = {
      title: form.title,
      period: form.period || null,
      description: form.description || null,
      published_at: form.published_at || null,
      is_published: form.is_published,
      files: form.files,
    }
    const result =
      mode === 'create'
        ? await supabase.from('reports').insert(payload).select('id').single()
        : await supabase.from('reports').update(payload).eq('id', initial!.id).select('id').single()

    setIsSaving(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push(`/admin/reports/${result.data?.id ?? initial?.id}`)
    router.refresh()
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}
      className="flex min-h-screen flex-col bg-[#f8f9fb]"
    >
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/admin/reports"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Звіти</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-primary">
              <ScrollText className="h-3.5 w-3.5" />
            </span>
            <span className="truncate text-sm font-bold text-slate-800">
              {form.title || (mode === 'edit' ? 'Без назви' : 'Новий звіт')}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <input
            type="datetime-local"
            value={form.published_at}
            onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))}
            className="hidden h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-orange-200 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:block"
          />
          <Select
            wrapperClassName="hidden sm:block"
            className="h-9 min-w-[148px] rounded-lg py-0 pl-3 pr-1 text-xs font-bold"
            value={form.is_published ? 'published' : 'draft'}
            onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.value === 'published' }))}
          >
            <option value="draft">Чернетка</option>
            <option value="published">Опубліковано</option>
          </Select>
          <Button type="submit" size="sm" showIcon={false} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{mode === 'create' ? 'Створити' : 'Зберегти'}</span>
          </Button>
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 sm:mx-6">
          {error}
        </div>
      )}

      <div className="w-full p-4 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

          {/* Left: metadata */}
          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Назва звіту">
                  <Input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Наприклад: Фінансовий звіт"
                  />
                </Field>
              </div>
              <Field label="Період">
                <Input
                  value={form.period}
                  onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
                  placeholder="Наприклад: Квітень 2026"
                />
              </Field>
              <div className="sm:hidden">
                <Field label="Дата публікації">
                  <Input
                    type="datetime-local"
                    value={form.published_at}
                    onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="sm:hidden">
                <Field label="Статус">
                  <select
                    value={form.is_published ? 'published' : 'draft'}
                    onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.value === 'published' }))}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="draft">Чернетка</option>
                    <option value="published">Опубліковано</option>
                  </select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Короткий опис">
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Кілька речень про звіт"
                    rows={4}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Right: files */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] lg:w-80 lg:shrink-0">
            <p className="mb-3 text-sm font-extrabold text-slate-700">Файли звіту</p>
            {form.files.length > 0 && (
              <div className="mb-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                {form.files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{file.name}</p>
                      {file.size != null && (
                        <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileRemove(i)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className={`flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-primary hover:bg-orange-50 hover:text-primary${uploading ? ' pointer-events-none opacity-60' : ''}`}>
              {uploading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Завантаження…</>
                : <><Plus className="h-4 w-4" /><FileUp className="h-4 w-4" /> Додати файл</>
              }
              <input ref={fileInputRef} type="file" multiple className="sr-only" onChange={handleFileAdd} />
            </label>
          </div>

        </div>
      </div>
    </form>
  )
}
