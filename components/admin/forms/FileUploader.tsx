'use client'

import { useRef, useState } from 'react'
import { FileText, FileUp, Loader2, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/FormControls'
import { Field } from '@/components/admin/forms/shared'

type Props = {
  src: string
  name: string
  description?: string
  size?: number
  r2Key?: string
  onUpdate: (patch: { src?: string; name?: string; description?: string; size?: number; r2Key?: string }) => void
  onUpload: (file: File) => Promise<{ r2Key: string; publicUrl: string } | null>
  onDelete: (r2Key: string | undefined) => Promise<boolean>
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader({ src, name, description, size, r2Key, onUpdate, onUpload, onDelete }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isUploaded = Boolean(r2Key)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.currentTarget.value = ''
    if (!file) return

    setError(null)
    setIsUploading(true)
    try {
      const result = await onUpload(file)
      if (!result) throw new Error('Помилка завантаження')
      onUpdate({ src: result.publicUrl, r2Key: result.r2Key, name: name || file.name, size: file.size })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete() {
    if (!r2Key) return
    const ok = await onDelete(r2Key)
    if (ok) onUpdate({ src: '', r2Key: undefined, size: undefined })
  }

  return (
    <div className="space-y-3">
      {/* File zone */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {isUploaded ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{name || 'Файл'}</p>
              {size != null && <p className="text-xs text-slate-400">{formatBytes(size)}</p>}
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : isUploading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-bold text-slate-500">Завантаження…</span>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-8 text-slate-400 transition hover:text-primary">
            <FileUp className="h-7 w-7" />
            <span className="text-sm font-bold">Обрати файл</span>
            <span className="text-xs text-slate-400">PDF, DOCX, XLSX, ZIP та інші</span>
            <input ref={inputRef} type="file" className="sr-only" onChange={handleFileChange} />
          </label>
        )}
        {error && <p className="px-3 pb-3 text-xs font-bold text-red-500">{error}</p>}
      </div>

      {/* Metadata */}
      <Field label="Назва файлу">
        <Input value={name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder="Наприклад: Фінансовий звіт за 2025 рік" />
      </Field>
      <Field label={description ? `Короткий опис (${description.length}/100)` : 'Короткий опис'}>
        <Input
          value={description ?? ''}
          maxLength={100}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="До 100 символів"
        />
      </Field>
    </div>
  )
}
