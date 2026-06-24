'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  Globe,
  GripVertical,
  ImagePlus,
  ImageIcon,
  Images,
  Loader2,
  MousePointerClick,
  Newspaper,
  Plus,
  Save,
  SlidersHorizontal,
  Table2,
  Trash2,
  Type,
  Video,
  X,
} from 'lucide-react'
import { saveNewsPostAction, type NewsFormPayload } from '@/app/admin/news/actions'
import {
  clearNewsCoverAction,
  createNewsImageUploadAction,
  deleteNewsImageAction,
  setNewsCoverAction,
} from '@/app/admin/news/media-actions'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import type { AnimalRow, NewsPostRow } from '@/lib/admin-types'
import type { NewsContentBlock } from '@/lib/news'
import { SITE_ROUTES, buildNewsHref } from '@/lib/site-config'
import {
  Field,
  IconTool,
  SmallAddButton,
  emptyToNull,
  toDatetimeLocal,
} from '@/components/admin/forms/shared'

const ANIMAL_STATUS_LABELS: Record<string, string> = {
  available: 'Шукає дім',
  reserved: 'Заброньована',
  adopted: 'Знайшла дім',
  draft: 'Чернетка',
  hidden: 'Прихована',
}

const ANIMAL_STATUS_CLASSES: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  reserved: 'bg-amber-100 text-amber-700',
  adopted: 'bg-blue-100 text-blue-700',
  draft: 'bg-slate-100 text-slate-500',
  hidden: 'bg-slate-100 text-slate-400',
}

const emptyNews = () => ({
  title: '',
  slug: '',
  excerpt: '',
  published_at: '',
  cover_url: '',
  cover_r2_key: '',
  related_animal_id: null as string | null,
  is_published: false,
})

export function NewsForm({
  initial,
  animals,
  mode,
}: {
  initial?: NewsPostRow
  animals: AnimalRow[]
  mode: 'create' | 'edit'
}) {
  const router = useRouter()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [newsId, setNewsId] = useState(initial?.id ?? null)
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          slug: initial.slug ?? '',
          excerpt: initial.excerpt ?? '',
          published_at: toDatetimeLocal(initial.published_at),
          cover_url: initial.cover_url ?? '',
          cover_r2_key: initial.cover_r2_key ?? '',
          related_animal_id: initial.related_animal_id,
          is_published: Boolean(initial.is_published),
        }
      : emptyNews()
  )
  const [blocks, setBlocks] = useState<NewsContentBlock[]>(() => normalizeBlocks(initial?.content_blocks))
  const [status, setStatus] = useState('')
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [uploadingKey, setUploadingKey] = useState('')
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false)
  const selectedAnimal = animals.find((a) => a.id === form.related_animal_id)

  async function handleSubmit() {
    setStatus('saving')
    const payload = normalizeNewsPayload({ ...form, content_blocks: blocks })
    const result = await saveNewsPostAction(newsId ? 'edit' : mode, newsId, payload)
    if (!result.ok) { setStatus(result.error); return }
    setNewsId(result.id)
    setForm((p) => ({ ...p, slug: result.slug }))
    router.push(`/admin/news/${result.id}`)
    router.refresh()
  }

  async function uploadCover(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setIsCoverUploading(true)
    try {
      const upload = await uploadNewsImage(file)
      if (!upload) return
      const saved = await setNewsCoverAction({ newsId: upload.newsId, r2Key: upload.r2Key, publicUrl: upload.publicUrl })
      if (!saved.ok) { setStatus(saved.error); return }
      if (form.cover_r2_key && form.cover_r2_key !== upload.r2Key) await deleteUploadedImage(form.cover_r2_key)
      setForm((c) => ({ ...c, cover_url: upload.publicUrl, cover_r2_key: upload.r2Key }))
      router.refresh()
    } finally {
      setIsCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  async function uploadNewsImage(file: File) {
    const currentNewsId = newsId ?? await createDraftForUpload()
    if (!currentNewsId) return null
    setStatus('')
    const upload = await createNewsImageUploadAction({ newsId: currentNewsId, fileName: file.name, contentType: file.type || 'image/jpeg' })
    if (!upload.ok) { setStatus(upload.error); return null }
    let response: Response
    try {
      response = await fetch(upload.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } })
    } catch { setStatus('Upload заблоковано. Перевір CORS у R2.'); return null }
    if (!response.ok) { setStatus(`R2 помилка: ${response.status}`); return null }
    return { ...upload, newsId: currentNewsId }
  }

  async function createDraftForUpload() {
    const payload = normalizeNewsPayload({ ...form, content_blocks: blocks })
    const result = await saveNewsPostAction('create', null, { ...payload, is_published: false })
    if (!result.ok) { setStatus(result.error); return null }
    setNewsId(result.id)
    router.replace(`/admin/news/${result.id}`)
    router.refresh()
    return result.id
  }

  async function deleteUploadedImage(r2Key: string | undefined) {
    if (!newsId || !r2Key) return true
    const deleted = await deleteNewsImageAction({ newsId, r2Key })
    if (!deleted.ok) { setStatus(deleted.error); return false }
    return true
  }

  async function removeCover() {
    if (!form.cover_url) return
    setStatus('')
    const cleared = newsId ? await clearNewsCoverAction(newsId) : { ok: true as const }
    if (!cleared.ok) { setStatus(cleared.error); return }
    await deleteUploadedImage(form.cover_r2_key || undefined)
    setForm((c) => ({ ...c, cover_url: '', cover_r2_key: '' }))
    router.refresh()
  }

  const addBlock = (type: NewsContentBlock['type']) =>
    setBlocks((c) => [...c, createBlock(type)])

  const updateBlock = (index: number, patch: Partial<NewsContentBlock>) =>
    setBlocks((c) => c.map((b, i) => i === index ? ({ ...b, ...patch } as NewsContentBlock) : b))

  const removeBlock = (index: number) =>
    setBlocks((c) => c.filter((_, i) => i !== index))

  const moveBlock = (index: number, dir: -1 | 1) =>
    setBlocks((c) => {
      const next = [...c]
      const target = index + dir
      if (target < 0 || target >= next.length) return c
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })

  const isSaving = status === 'saving'
  const siteHref = form.slug ? buildNewsHref(form.slug) : newsId ? buildNewsHref(newsId) : null

  return (
    <div className="flex min-h-screen flex-col">

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-slate-200 bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link href="/admin/news" className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Новини</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-primary">
              <Newspaper className="h-3.5 w-3.5" />
            </span>
            <span className="truncate text-sm font-bold text-slate-800">
              {form.title || (mode === 'edit' ? 'Без заголовку' : 'Нова новина')}
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
          <Button type="button" size="sm" showIcon={false} disabled={isSaving} onClick={() => void handleSubmit()}>
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{mode === 'create' ? 'Створити' : 'Зберегти'}</span>
          </Button>
          {mode === 'edit' && form.is_published && siteHref ? (
            <Link href={siteHref} target="_blank" className="hidden h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:flex">
              <Globe className="h-3 w-3" />На сайті ↗
            </Link>
          ) : null}
        </div>
      </header>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {status && !isSaving ? (
        <div className="mx-4 mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 sm:mx-6">
          {status}
        </div>
      ) : null}

      {/* ── Two-column body ─────────────────────────────────────────────────── */}
      <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }}
        className="mx-auto w-full max-w-[calc(100rem+4rem)] flex-1 gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:p-8">

        {/* ── LEFT: main content ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Title */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Заголовок</span>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Введіть заголовок новини..."
                className="block w-full border-0 bg-transparent p-0 text-2xl font-extrabold text-slate-950 placeholder:text-slate-300 outline-none focus:ring-0"
              />
            </label>
          </div>

          {/* Content blocks */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-extrabold text-slate-950">Контент</p>
                <p className="text-xs text-slate-400">{blocks.length} {blocks.length === 1 ? 'блок' : blocks.length < 5 ? 'блоки' : 'блоків'}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                {BLOCK_ACTIONS.map((action) => (
                  <button
                    key={action.type}
                    type="button"
                    onClick={() => addBlock(action.type)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {blocks.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <p className="font-extrabold text-slate-700">Додай перший блок</p>
                  <p className="mt-1 text-sm text-slate-400">Натисни одну з кнопок вище</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blocks.map((block, index) => (
                    <BlockCard
                      key={`${block.type}-${index}`}
                      block={block}
                      index={index}
                      total={blocks.length}
                      onUpdate={(patch) => updateBlock(index, patch)}
                      onRemove={async () => {
                        await deleteBlockImages(block, deleteUploadedImage)
                        removeBlock(index)
                      }}
                      onMoveUp={() => moveBlock(index, -1)}
                      onMoveDown={() => moveBlock(index, 1)}
                      onUploadImage={uploadNewsImage}
                      onDeleteImage={deleteUploadedImage}
                      uploadingKey={uploadingKey}
                      setUploadingKey={setUploadingKey}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: sidebar ──────────────────────────────────────────────── */}
        <aside className="space-y-4">

          {/* Cover photo — compact */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Обкладинка</p>
            </div>
            <div className="p-3">
              <input ref={coverInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => uploadCover(e.target.files)} />
              {form.cover_url ? (
                <div className="group relative overflow-hidden rounded-xl">
                  <img src={form.cover_url} alt="Обкладинка" className="aspect-[16/9] w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
                    <button type="button" disabled={isCoverUploading} onClick={() => coverInputRef.current?.click()}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow transition hover:bg-orange-50 hover:text-primary">
                      {isCoverUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={removeCover}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => coverInputRef.current?.click()} disabled={isCoverUploading}
                  className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-orange-300 hover:bg-orange-50/50 hover:text-primary">
                  {isCoverUploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
                  <span className="text-xs font-bold">{isCoverUploading ? 'Завантаження...' : 'Додати обкладинку'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Slug (URL)</span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="shrink-0 text-xs text-slate-400">/новини/</span>
                <input
                  value={form.slug || '—'}
                  disabled
                  className="min-w-0 flex-1 bg-transparent text-xs font-mono text-slate-500 outline-none"
                />
              </div>
            </label>
          </div>

          {/* Excerpt */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Короткий опис</span>
              <textarea
                value={form.excerpt ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={4}
                placeholder="З'являється у списку новин та при шерингу..."
                className="block w-full resize-none border-0 bg-transparent p-0 text-sm leading-6 text-slate-700 placeholder:text-slate-300 outline-none focus:ring-0"
              />
            </label>
          </div>

          {/* Related animal */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Повʼязана тварина</p>
            </div>
            <div className="p-3">
              {selectedAnimal ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-start gap-3 p-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      {selectedAnimal.gender === 'female' ? '🐱' : '🐶'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold text-slate-950">{selectedAnimal.name}</p>
                      {selectedAnimal.approximate_age_label && (
                        <p className="text-xs text-slate-500">{selectedAnimal.approximate_age_label}</p>
                      )}
                      <span className={`mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${ANIMAL_STATUS_CLASSES[selectedAnimal.status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {ANIMAL_STATUS_LABELS[selectedAnimal.status] ?? selectedAnimal.status}
                      </span>
                    </div>
                    <button type="button" onClick={() => setForm((c) => ({ ...c, related_animal_id: null }))}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" onClick={() => setIsAnimalModalOpen(true)}
                    className="flex w-full items-center justify-center gap-1.5 border-t border-slate-200 py-2 text-xs font-bold text-slate-400 transition hover:bg-white hover:text-primary">
                    <Plus className="h-3 w-3" /> Змінити
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsAnimalModalOpen(true)}
                  className="group flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 py-6 text-slate-400 transition hover:border-orange-300 hover:bg-orange-50/40 hover:text-primary">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-orange-100">🐾</span>
                  <span className="text-xs font-bold">Прив'язати тварину</span>
                </button>
              )}
            </div>
          </div>

        </aside>
      </form>

      {/* Animal picker modal */}
      {isAnimalModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Обрати тварину</h3>
                <p className="mt-1 text-sm text-slate-500">Обери тварину з каталогу</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAnimalModalOpen(false)}>Закрити</Button>
            </div>
            <div className="grid max-h-[62vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2">
              {animals.length > 0 ? animals.map((animal) => (
                <Button key={animal.id} type="button" variant="secondary" showIcon={false}
                  onClick={() => { setForm((c) => ({ ...c, related_animal_id: animal.id })); setIsAnimalModalOpen(false) }}
                  className="h-auto w-full justify-between rounded-xl p-4 text-left font-normal hover:border-orange-200 hover:bg-orange-50">
                  <span>
                    <span className="block font-extrabold text-slate-950">{animal.name}</span>
                    <span className="mt-1 block text-sm text-slate-500">{animal.status}</span>
                  </span>
                  {form.related_animal_id === animal.id ? <Check className="h-5 w-5 text-primary" /> : null}
                </Button>
              )) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-500 sm:col-span-2">Тварин немає</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ─── Block definitions ────────────────────────────────────────────────────────

const BLOCK_ACTIONS = [
  { type: 'paragraph' as const, label: 'Текст',    icon: Type },
  { type: 'image'     as const, label: 'Фото',     icon: ImageIcon },
  { type: 'video'     as const, label: 'Відео',    icon: Video },
  { type: 'table'     as const, label: 'Таблиця',  icon: Table2 },
  { type: 'buttons'   as const, label: 'Кнопки',   icon: MousePointerClick },
  { type: 'gallery'   as const, label: 'Галерея',  icon: Images },
  { type: 'slider'    as const, label: 'Слайдер',  icon: SlidersHorizontal },
]

const BLOCK_COLORS: Record<string, string> = {
  paragraph: 'bg-blue-50 text-blue-600',
  image:     'bg-emerald-50 text-emerald-600',
  video:     'bg-purple-50 text-purple-600',
  table:     'bg-amber-50 text-amber-600',
  buttons:   'bg-orange-50 text-primary',
  gallery:   'bg-pink-50 text-pink-600',
  slider:    'bg-cyan-50 text-cyan-600',
}

// ─── Block card ───────────────────────────────────────────────────────────────

function BlockCard({
  block, index, total, onUpdate, onRemove, onMoveUp, onMoveDown,
  onUploadImage, onDeleteImage, uploadingKey, setUploadingKey,
}: {
  block: NewsContentBlock
  index: number
  total: number
  onUpdate: (patch: Partial<NewsContentBlock>) => void
  onRemove: () => void | Promise<void>
  onMoveUp: () => void
  onMoveDown: () => void
  onUploadImage: (file: File) => Promise<{ r2Key: string; publicUrl: string; newsId: string } | null>
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
  uploadingKey: string
  setUploadingKey: (key: string) => void
}) {
  const action = BLOCK_ACTIONS.find((a) => a.type === block.type) ?? BLOCK_ACTIONS[0]
  const colorClass = BLOCK_COLORS[block.type] ?? 'bg-slate-50 text-slate-500'
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-2.5">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${colorClass}`}>
          <action.icon className="h-3.5 w-3.5" />
        </span>
        <button type="button" onClick={() => setCollapsed((c) => !c)}
          className="flex-1 text-left text-xs font-extrabold text-slate-700 hover:text-slate-950">
          {index + 1}. {action.label}
        </button>
        <div className="flex items-center gap-0.5">
          <IconTool label="Вище" disabled={index === 0} onClick={onMoveUp}><ArrowUp className="h-3.5 w-3.5" /></IconTool>
          <IconTool label="Нижче" disabled={index === total - 1} onClick={onMoveDown}><ArrowDown className="h-3.5 w-3.5" /></IconTool>
          <IconTool label="Видалити" onClick={() => void onRemove()} danger><Trash2 className="h-3.5 w-3.5" /></IconTool>
        </div>
      </div>
      {!collapsed && (
        <div className="space-y-3 p-3">
          <BlockFields
            block={block} blockIndex={index} onUpdate={onUpdate}
            onUploadImage={onUploadImage} onDeleteImage={onDeleteImage}
            uploadingKey={uploadingKey} setUploadingKey={setUploadingKey}
          />
        </div>
      )}
    </div>
  )
}

// ─── Block fields ─────────────────────────────────────────────────────────────

function BlockFields({ block, blockIndex, onUpdate, onUploadImage, onDeleteImage, uploadingKey, setUploadingKey }: {
  block: NewsContentBlock
  blockIndex: number
  onUpdate: (patch: Partial<NewsContentBlock>) => void
  onUploadImage: (file: File) => Promise<{ r2Key: string; publicUrl: string; newsId: string } | null>
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
  uploadingKey: string
  setUploadingKey: (key: string) => void
}) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Textarea
          className="min-h-36 text-sm"
          placeholder="Текст абзацу..."
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
      )

    case 'image':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <SingleImageUploader
              src={block.src}
              alt={block.alt}
              r2Key={block.r2Key}
              uploadKey={`${blockIndex}-img`}
              uploadingKey={uploadingKey}
              setUploadingKey={setUploadingKey}
              onUpload={async (file) => {
                const up = await onUploadImage(file)
                if (up) onUpdate({ src: up.publicUrl, r2Key: up.r2Key })
              }}
              onDelete={async () => {
                if (await onDeleteImage(block.r2Key)) onUpdate({ src: '', r2Key: undefined })
              }}
            />
          </div>
          <Field label="Alt текст"><Input value={block.alt} onChange={(e) => onUpdate({ alt: e.target.value })} /></Field>
          <Field label="Підпис"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
          <Field label="Ширина">
            <Select value={block.width ?? 'medium'} onChange={(e) => onUpdate({ width: e.target.value as NewsContentBlock['width'] })}>
              <option value="narrow">Вузька (текст)</option>
              <option value="medium">Середня</option>
              <option value="wide">Широка</option>
              <option value="full">На всю ширину</option>
            </Select>
          </Field>
          <Field label="Висота">
            <Select value={block.height ?? 'medium'} onChange={(e) => onUpdate({ height: e.target.value as NewsContentBlock['height'] })}>
              <option value="small">Мала (300px)</option>
              <option value="medium">Середня (420px)</option>
              <option value="large">Велика (560px)</option>
            </Select>
          </Field>
        </div>
      )

    case 'video':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="URL відео" hint="YouTube, Vimeo і т.д." className="sm:col-span-2"><Input value={block.src} onChange={(e) => onUpdate({ src: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
          <Field label="Назва відео"><Input value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
          <Field label="Підпис"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
          <Field label="Ширина">
            <Select value={block.width ?? 'medium'} onChange={(e) => onUpdate({ width: e.target.value as NewsContentBlock['width'] })}>
              <option value="narrow">Вузька</option>
              <option value="medium">Середня</option>
              <option value="wide">Широка</option>
              <option value="full">На всю ширину</option>
            </Select>
          </Field>
          <Field label="Висота">
            <Select value={block.height ?? 'medium'} onChange={(e) => onUpdate({ height: e.target.value as NewsContentBlock['height'] })}>
              <option value="small">Мала (300px)</option>
              <option value="medium">Середня (420px)</option>
              <option value="large">Велика (560px)</option>
            </Select>
          </Field>
        </div>
      )

    case 'table':
      return (
        <div className="space-y-3">
          <Field label="Назва таблиці"><Input value={block.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
          <div>
            <span className="mb-2 block text-sm font-extrabold text-slate-700">Колонки</span>
            <div className="space-y-1.5">
              {block.columns.map((col, ci) => (
                <div key={ci} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-400">{ci + 1}</span>
                  <Input value={col} onChange={(e) => onUpdate({ columns: block.columns.map((c, j) => j === ci ? e.target.value : c) })} placeholder={`Колонка ${ci + 1}`} />
                  <IconTool label="Видалити колонку" danger disabled={block.columns.length <= 1}
                    onClick={() => onUpdate({ columns: block.columns.filter((_, j) => j !== ci), rows: block.rows.map((r) => r.filter((_, j) => j !== ci)) })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconTool>
                </div>
              ))}
              <SmallAddButton onClick={() => onUpdate({ columns: [...block.columns, `Колонка ${block.columns.length + 1}`], rows: block.rows.map((r) => [...r, '']) })}>
                Додати колонку
              </SmallAddButton>
            </div>
          </div>
          <div>
            <span className="mb-2 block text-sm font-extrabold text-slate-700">Рядки даних</span>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[400px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-8 px-2 py-2 text-center text-xs font-bold text-slate-400">#</th>
                    {block.columns.map((col, ci) => (
                      <th key={ci} className="px-3 py-2 text-left text-xs font-extrabold text-slate-700">{col}</th>
                    ))}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-slate-100 last:border-0">
                      <td className="px-2 py-1.5 text-center text-xs text-slate-400">{ri + 1}</td>
                      {block.columns.map((_, ci) => (
                        <td key={ci} className="px-1 py-1">
                          <input
                            value={row[ci] ?? ''}
                            onChange={(e) => onUpdate({ rows: block.rows.map((r, j) => j === ri ? r.map((c, k) => k === ci ? e.target.value : c) : r) })}
                            className="w-full rounded-lg border border-transparent bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/10"
                          />
                        </td>
                      ))}
                      <td className="px-1 py-1">
                        <button type="button" title="Видалити рядок"
                          onClick={() => onUpdate({ rows: block.rows.filter((_, j) => j !== ri) })}
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-300 transition hover:bg-red-50 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <SmallAddButton onClick={() => onUpdate({ rows: [...block.rows, block.columns.map(() => '')] })}>
                Додати рядок
              </SmallAddButton>
            </div>
          </div>
        </div>
      )

    case 'buttons':
      return (
        <div className="space-y-2">
          {block.buttons.map((btn, bi) => (
            <div key={bi} className="grid grid-cols-[1fr_1fr_120px_auto] gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <Field label="Текст"><Input value={btn.label} onChange={(e) => onUpdate({ buttons: updBtn(block.buttons, bi, { label: e.target.value }) })} /></Field>
              <Field label="Посилання"><Input value={btn.href} onChange={(e) => onUpdate({ buttons: updBtn(block.buttons, bi, { href: e.target.value }) })} /></Field>
              <Field label="Стиль">
                <Select value={btn.variant ?? 'primary'} onChange={(e) => onUpdate({ buttons: updBtn(block.buttons, bi, { variant: e.target.value as 'primary' | 'outline' }) })}>
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                </Select>
              </Field>
              <div className="flex items-end">
                <IconTool label="Видалити" danger onClick={() => onUpdate({ buttons: block.buttons.filter((_, i) => i !== bi) })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconTool>
              </div>
            </div>
          ))}
          <SmallAddButton onClick={() => onUpdate({ buttons: [...block.buttons, { label: 'Кнопка', href: '/', variant: 'primary' }] })}>
            Додати кнопку
          </SmallAddButton>
        </div>
      )

    case 'gallery':
      return (
        <ImageGrid
          images={block.images}
          blockIndex={blockIndex}
          uploadingKey={uploadingKey}
          setUploadingKey={setUploadingKey}
          onUploadImage={onUploadImage}
          onDeleteImage={onDeleteImage}
          onChange={(images) => onUpdate({ images })}
          showAlt
        />
      )

    case 'slider':
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Ширина">
              <Select value={block.width ?? 'medium'} onChange={(e) => onUpdate({ width: e.target.value as NewsContentBlock['width'] })}>
                <option value="narrow">Вузька</option>
                <option value="medium">Середня</option>
                <option value="wide">Широка</option>
                <option value="full">На всю ширину</option>
              </Select>
            </Field>
            <Field label="Висота слайдера">
              <Select value={block.height ?? 'medium'} onChange={(e) => onUpdate({ height: e.target.value as NewsContentBlock['height'] })}>
                <option value="small">Мала (300px)</option>
                <option value="medium">Середня (420px)</option>
                <option value="large">Велика (560px)</option>
              </Select>
            </Field>
            <Field label="Підпис"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
          </div>
          <ImageGrid
            images={block.images}
            blockIndex={blockIndex}
            uploadingKey={uploadingKey}
            setUploadingKey={setUploadingKey}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
            onChange={(images) => onUpdate({ images })}
            showAlt={true}
          />
        </div>
      )
  }
}

// ─── Image grid (for gallery & slider) ───────────────────────────────────────

type ImgVal = { src: string; alt: string; r2Key?: string }

function ImageGrid({ images, blockIndex, uploadingKey, setUploadingKey, onUploadImage, onDeleteImage, onChange, showAlt }: {
  images: ImgVal[]
  blockIndex: number
  uploadingKey: string
  setUploadingKey: (k: string) => void
  onUploadImage: (file: File) => Promise<{ r2Key: string; publicUrl: string; newsId: string } | null>
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
  onChange: (images: ImgVal[]) => void
  showAlt: boolean
}) {
  const addInputRef = useRef<HTMLInputElement>(null)
  const isAddUploading = uploadingKey === `${blockIndex}-add`

  return (
    <div className={showAlt ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : 'grid grid-cols-3 gap-2 sm:grid-cols-4'}>
      {images.map((img, i) => {
        const key = `${blockIndex}-grid-${i}`
        const isUploading = uploadingKey === key
        return (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100" style={{ aspectRatio: showAlt ? '4/3' : '1/1' }}>
              {img.src ? (
                <>
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/50 group-hover:opacity-100">
                    <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white shadow transition hover:bg-orange-50 hover:text-primary">
                      {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
                      <input type="file" accept="image/*" className="sr-only" disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploadingKey(key)
                          try {
                            const up = await onUploadImage(file)
                            if (up) onChange(images.map((im, j) => j === i ? { ...im, src: up.publicUrl, r2Key: up.r2Key } : im))
                          } finally { setUploadingKey(''); e.currentTarget.value = '' }
                        }}
                      />
                    </label>
                    <button type="button" onClick={async () => {
                      if (await onDeleteImage(img.r2Key)) onChange(images.filter((_, j) => j !== i))
                    }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow transition hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            {showAlt && (
              <input
                value={img.alt}
                onChange={(e) => onChange(images.map((im, j) => j === i ? { ...im, alt: e.target.value } : im))}
                placeholder={`Alt фото ${i + 1}`}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            )}
          </div>
        )
      })}

      {/* Add button */}
      <div className="flex flex-col gap-1.5">
        <label className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-orange-300 hover:text-primary ${showAlt ? 'aspect-[4/3]' : 'aspect-square'}`}>
          {isAddUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          <span className="text-[10px] font-bold">{isAddUploading ? '...' : 'Додати'}</span>
          <input ref={addInputRef} type="file" accept="image/*" multiple className="sr-only" disabled={isAddUploading}
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? [])
              if (!files.length) return
              setUploadingKey(`${blockIndex}-add`)
              try {
                let current = [...images]
                for (const file of files) {
                  const up = await onUploadImage(file)
                  if (up) current = [...current, { src: up.publicUrl, alt: '', r2Key: up.r2Key }]
                }
                onChange(current)
              } finally { setUploadingKey(''); e.currentTarget.value = '' }
            }}
          />
        </label>
        {showAlt && <div className="h-[30px]" />}
      </div>
    </div>
  )
}

// ─── Single image uploader ────────────────────────────────────────────────────

function SingleImageUploader({ src, alt, r2Key, uploadKey, uploadingKey, setUploadingKey, onUpload, onDelete }: {
  src: string; alt: string; r2Key?: string
  uploadKey: string; uploadingKey: string; setUploadingKey: (k: string) => void
  onUpload: (file: File) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const isUploading = uploadingKey === uploadKey
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {src ? (
        <>
          <img src={src} alt={alt} className="aspect-[16/7] w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:bg-slate-950/40 group-hover:opacity-100">
            <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white shadow transition hover:bg-orange-50 hover:text-primary">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              <input type="file" accept="image/*" className="sr-only" disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setUploadingKey(uploadKey)
                  try { await onUpload(file) } finally { setUploadingKey(''); e.currentTarget.value = '' }
                }}
              />
            </label>
            <button type="button" onClick={onDelete} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow transition hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <label className="flex aspect-[16/7] w-full cursor-pointer flex-col items-center justify-center gap-2 text-slate-400 transition hover:text-primary">
          {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
          <span className="text-xs font-bold">{isUploading ? 'Завантаження...' : 'Завантажити фото'}</span>
          <input type="file" accept="image/*" className="sr-only" disabled={isUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setUploadingKey(uploadKey)
              try { await onUpload(file) } finally { setUploadingKey(''); e.currentTarget.value = '' }
            }}
          />
        </label>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createBlock(type: NewsContentBlock['type']): NewsContentBlock {
  switch (type) {
    case 'paragraph': return { type, width: 'narrow', text: '' }
    case 'image':     return { type, width: 'medium', height: 'medium', src: '', alt: '', caption: '' }
    case 'video':     return { type, width: 'medium', height: 'medium', src: '', title: '', caption: '' }
    case 'table':     return { type, width: 'wide', title: '', columns: ['Колонка 1', 'Колонка 2'], rows: [['', '']] }
    case 'buttons':   return { type, width: 'medium', buttons: [{ label: 'Підтримати', href: SITE_ROUTES.help, variant: 'primary' }] }
    case 'gallery':   return { type, width: 'wide', images: [] }
    case 'slider':    return { type, width: 'medium', height: 'medium', caption: '', images: [] }
  }
}

async function deleteBlockImages(block: NewsContentBlock, del: (k: string | undefined) => Promise<boolean>) {
  if (block.type === 'image') { await del(block.r2Key); return }
  if (block.type === 'gallery' || block.type === 'slider') await Promise.all(block.images.map((i) => del(i.r2Key)))
}

function normalizeBlocks(value: unknown[] | null | undefined): NewsContentBlock[] {
  if (!Array.isArray(value)) return []
  return value.filter((b): b is NewsContentBlock => Boolean(b && typeof b === 'object' && 'type' in b))
}

function splitPipes(v: string) { return v.split('|').map((s) => s.trim()).filter(Boolean) }
function rowsToText(rows: string[][]) { return rows.map((r) => r.join(' | ')).join('\n') }
function textToRows(v: string) { return v.split('\n').map(splitPipes).filter((r) => r.length > 0) }

function updBtn(
  buttons: Array<{ label: string; href: string; variant?: 'primary' | 'outline' }>,
  index: number,
  patch: Partial<{ label: string; href: string; variant?: 'primary' | 'outline' }>
) { return buttons.map((b, i) => i === index ? { ...b, ...patch } : b) }

function normalizeNewsPayload(form: {
  title: string; slug: string; excerpt: string | null; published_at: string | null
  content_blocks: NewsContentBlock[]; cover_url: string | null; cover_r2_key: string | null
  related_animal_id: string | null; is_published: boolean | null
}): NewsFormPayload {
  return {
    slug: emptyToNull(form.slug) ?? '',
    title: form.title,
    excerpt: emptyToNull(form.excerpt),
    content_blocks: form.content_blocks,
    cover_url: emptyToNull(form.cover_url),
    cover_r2_key: emptyToNull(form.cover_r2_key),
    related_animal_id: emptyToNull(form.related_animal_id),
    is_published: Boolean(form.is_published),
    published_at: emptyToNull(form.published_at),
  }
}
