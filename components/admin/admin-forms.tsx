'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Images,
  MousePointerClick,
  Plus,
  Save,
  SlidersHorizontal,
  Table2,
  Trash2,
  Type,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import AdminNotice from '@/components/admin/AdminNotice'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { AnimalRow, NewsPostRow, ReportRow } from '@/lib/admin-types'
import type { NewsContentBlock } from '@/lib/news'
import { cn } from '@/lib/utils'

const supabase = getSupabaseBrowserClient()

const emptyAnimal = (): Omit<AnimalRow, 'id' | 'created_at' | 'updated_at'> => ({
  slug: '',
  name: '',
  species: 'dog',
  gender: 'male',
  size: 'medium',
  status: 'draft',
  short_description: '',
  full_story: '',
  birth_date: null,
  approximate_age_label: '',
  shelter_arrival_date: null,
  is_vaccinated: false,
  is_neutered: false,
  is_featured: false,
  published_at: null,
})

const emptyNews = (): Omit<NewsPostRow, 'id'> => ({
  slug: '',
  title: '',
  excerpt: '',
  content_blocks: [],
  cover_url: '',
  cover_r2_key: '',
  related_animal_id: null,
  is_published: false,
  published_at: null,
})

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

export function AnimalForm({ initial, mode }: { initial?: AnimalRow; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState(() =>
    initial
      ? {
          slug: initial.slug,
          name: initial.name,
          species: initial.species,
          gender: initial.gender,
          size: initial.size,
          status: initial.status,
          short_description: initial.short_description ?? '',
          full_story: initial.full_story ?? '',
          birth_date: initial.birth_date,
          approximate_age_label: initial.approximate_age_label ?? '',
          shelter_arrival_date: initial.shelter_arrival_date,
          is_vaccinated: Boolean(initial.is_vaccinated),
          is_neutered: Boolean(initial.is_neutered),
          is_featured: Boolean(initial.is_featured),
          published_at: initial.published_at,
        }
      : emptyAnimal()
  )
  const [status, setStatus] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    const payload = normalizeAnimalPayload(form)
    const result =
      mode === 'create'
        ? await supabase.from('animals').insert(payload).select('id').single()
        : await supabase.from('animals').update(payload).eq('id', initial!.id).select('id').single()

    if (result.error) {
      setStatus(result.error.message)
      return
    }

    router.push(`/admin/animals/${result.data?.id ?? initial?.id}`)
    router.refresh()
  }

  return (
    <EntityForm status={status} submitLabel={mode === 'create' ? 'Створити тварину' : 'Зберегти зміни'} onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} /></Field>
        <Field label="Ім'я"><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></Field>
        <Field label="Тип"><Select value={form.species} onChange={(e) => setForm((p) => ({ ...p, species: e.target.value as AnimalRow['species'] }))}><option value="dog">Собака</option><option value="cat">Кіт</option></Select></Field>
        <Field label="Стать"><Select value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value as AnimalRow['gender'] }))}><option value="male">Хлопчик</option><option value="female">Дівчинка</option></Select></Field>
        <Field label="Розмір"><Select value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value as AnimalRow['size'] }))}><option value="small">Малий</option><option value="medium">Середній</option><option value="large">Великий</option></Select></Field>
        <Field label="Статус"><Select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AnimalRow['status'] }))}><option value="draft">Чернетка</option><option value="available">Доступний</option><option value="reserved">Зарезервований</option><option value="adopted">Прилаштований</option><option value="hidden">Прихований</option></Select></Field>
        <Field label="Дата народження"><Input type="date" value={form.birth_date ?? ''} onChange={(e) => setForm((p) => ({ ...p, birth_date: e.target.value || null }))} /></Field>
        <Field label="Вік текстом"><Input value={form.approximate_age_label ?? ''} onChange={(e) => setForm((p) => ({ ...p, approximate_age_label: e.target.value }))} /></Field>
        <Field label="Дата прибуття"><Input type="date" value={form.shelter_arrival_date ?? ''} onChange={(e) => setForm((p) => ({ ...p, shelter_arrival_date: e.target.value || null }))} /></Field>
        <Field label="Дата публікації"><Input type="datetime-local" value={toDatetimeLocal(form.published_at)} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value || null }))} /></Field>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Checkbox label="Вакциновано" checked={Boolean(form.is_vaccinated)} onChange={(checked) => setForm((p) => ({ ...p, is_vaccinated: checked }))} />
        <Checkbox label="Стерилізовано" checked={Boolean(form.is_neutered)} onChange={(checked) => setForm((p) => ({ ...p, is_neutered: checked }))} />
        <Checkbox label="Показувати на головній" checked={Boolean(form.is_featured)} onChange={(checked) => setForm((p) => ({ ...p, is_featured: checked }))} />
      </div>
      <Field label="Короткий опис"><Textarea value={form.short_description ?? ''} onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))} /></Field>
      <Field label="Повна історія"><Textarea className="min-h-56" value={form.full_story ?? ''} onChange={(e) => setForm((p) => ({ ...p, full_story: e.target.value }))} /></Field>
    </EntityForm>
  )
}

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
  const [form, setForm] = useState(() =>
    initial
      ? {
          slug: initial.slug,
          title: initial.title,
          excerpt: initial.excerpt ?? '',
          cover_url: initial.cover_url ?? '',
          cover_r2_key: initial.cover_r2_key ?? '',
          related_animal_id: initial.related_animal_id,
          is_published: Boolean(initial.is_published),
          published_at: initial.published_at,
        }
      : {
          ...emptyNews(),
          content_blocks: undefined,
        }
  )
  const [blocks, setBlocks] = useState<NewsContentBlock[]>(() => normalizeBlocks(initial?.content_blocks))
  const [status, setStatus] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    const payload = normalizeNewsPayload({ ...form, content_blocks: blocks })
    const result =
      mode === 'create'
        ? await supabase.from('news_posts').insert(payload).select('id').single()
        : await supabase.from('news_posts').update(payload).eq('id', initial!.id).select('id').single()

    if (result.error) {
      setStatus(result.error.message)
      return
    }

    router.push(`/admin/news/${result.data?.id ?? initial?.id}`)
    router.refresh()
  }

  const addBlock = (type: NewsContentBlock['type']) => {
    setBlocks((current) => [...current, createBlock(type)])
  }

  const updateBlock = (index: number, patch: Partial<NewsContentBlock>) => {
    setBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index ? ({ ...block, ...patch } as NewsContentBlock) : block
      )
    )
  }

  const removeBlock = (index: number) => {
    setBlocks((current) => current.filter((_, blockIndex) => blockIndex !== index))
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  return (
    <EntityForm status={status} submitLabel={mode === 'create' ? 'Створити новину' : 'Зберегти зміни'} onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} /></Field>
        <Field label="Заголовок"><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></Field>
        <Field label="Cover URL"><Input value={form.cover_url ?? ''} onChange={(e) => setForm((p) => ({ ...p, cover_url: e.target.value }))} /></Field>
        <Field label="Cover R2 key"><Input value={form.cover_r2_key ?? ''} onChange={(e) => setForm((p) => ({ ...p, cover_r2_key: e.target.value }))} /></Field>
        <Field label="Повязана тварина">
          <Select value={form.related_animal_id ?? ''} onChange={(e) => setForm((p) => ({ ...p, related_animal_id: e.target.value || null }))}>
            <option value="">Без привязки</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Дата публікації"><Input type="datetime-local" value={toDatetimeLocal(form.published_at)} onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value || null }))} /></Field>
      </div>
      <Checkbox label="Опубліковано" checked={Boolean(form.is_published)} onChange={(checked) => setForm((p) => ({ ...p, is_published: checked }))} />
      <Field label="Короткий опис"><Textarea value={form.excerpt ?? ''} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} /></Field>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-950">Блоки новини</h3>
            <p className="mt-1 text-sm text-slate-500">Додавай контент кнопками. Структура відповідає сторінці новин: текст, медіа, таблиці, галереї та слайдери.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.type}
                  type="button"
                  onClick={() => addBlock(action.type)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-extrabold text-slate-700">Блоків ще немає</p>
              <p className="mt-2 text-sm text-slate-500">Натисни одну з кнопок вище, щоб зібрати новину як конструктор.</p>
            </div>
          ) : (
            blocks.map((block, index) => (
              <BlockEditor
                key={`${block.type}-${index}`}
                block={block}
                index={index}
                onUpdate={(patch) => updateBlock(index, patch)}
                onRemove={() => removeBlock(index)}
                onMoveUp={() => moveBlock(index, -1)}
                onMoveDown={() => moveBlock(index, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < blocks.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </EntityForm>
  )
}

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

const blockActions: Array<{
  type: NewsContentBlock['type']
  label: string
  icon: typeof Type
}> = [
  { type: 'paragraph', label: 'Текст', icon: Type },
  { type: 'image', label: 'Фото', icon: ImageIcon },
  { type: 'video', label: 'Відео', icon: Video },
  { type: 'table', label: 'Таблиця', icon: Table2 },
  { type: 'buttons', label: 'Кнопки', icon: MousePointerClick },
  { type: 'gallery', label: 'Галерея', icon: Images },
  { type: 'slider', label: 'Слайдер', icon: SlidersHorizontal },
]

function BlockEditor({
  block,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  block: NewsContentBlock
  index: number
  onUpdate: (patch: Partial<NewsContentBlock>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const action = blockActions.find((item) => item.type === block.type) ?? blockActions[0]
  const Icon = action.icon

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-slate-950">{index + 1}. {action.label}</p>
            <p className="text-xs font-semibold uppercase text-slate-400">{block.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <IconTool label="Вище" disabled={!canMoveUp} onClick={onMoveUp}><ArrowUp className="h-4 w-4" /></IconTool>
          <IconTool label="Нижче" disabled={!canMoveDown} onClick={onMoveDown}><ArrowDown className="h-4 w-4" /></IconTool>
          <IconTool label="Видалити" onClick={onRemove} danger><Trash2 className="h-4 w-4" /></IconTool>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <BlockSizing block={block} onUpdate={onUpdate} />
        <BlockFields block={block} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

function BlockSizing({
  block,
  onUpdate,
}: {
  block: NewsContentBlock
  onUpdate: (patch: Partial<NewsContentBlock>) => void
}) {
  const hasHeight = block.type === 'image' || block.type === 'video' || block.type === 'slider'

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Ширина блоку">
        <Select value={block.width ?? 'medium'} onChange={(e) => onUpdate({ width: e.target.value as NewsContentBlock['width'] })}>
          <option value="narrow">Вузький</option>
          <option value="medium">Середній</option>
          <option value="wide">Широкий</option>
          <option value="full">На всю ширину</option>
        </Select>
      </Field>
      {hasHeight ? (
        <Field label="Висота медіа">
          <Select value={block.height ?? 'medium'} onChange={(e) => onUpdate({ height: e.target.value as NewsContentBlock['height'] })}>
            <option value="small">Мала</option>
            <option value="medium">Середня</option>
            <option value="large">Велика</option>
          </Select>
        </Field>
      ) : null}
    </div>
  )
}

function BlockFields({
  block,
  onUpdate,
}: {
  block: NewsContentBlock
  onUpdate: (patch: Partial<NewsContentBlock>) => void
}) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Field label="Текст">
          <Textarea className="min-h-44" value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} />
        </Field>
      )

    case 'image':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL фото"><Input value={block.src} onChange={(e) => onUpdate({ src: e.target.value })} /></Field>
          <Field label="Alt текст"><Input value={block.alt} onChange={(e) => onUpdate({ alt: e.target.value })} /></Field>
          <Field label="Підпис"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
        </div>
      )

    case 'video':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL відео"><Input value={block.src} onChange={(e) => onUpdate({ src: e.target.value })} /></Field>
          <Field label="Назва відео"><Input value={block.title} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
          <Field label="Підпис"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
        </div>
      )

    case 'table':
      return (
        <div className="grid gap-4">
          <Field label="Назва таблиці"><Input value={block.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
          <Field label="Колонки через |"><Input value={block.columns.join(' | ')} onChange={(e) => onUpdate({ columns: splitPipes(e.target.value) })} /></Field>
          <Field label="Рядки, кожен рядок з колонками через |">
            <Textarea value={rowsToText(block.rows)} onChange={(e) => onUpdate({ rows: textToRows(e.target.value) })} />
          </Field>
        </div>
      )

    case 'buttons':
      return (
        <div className="space-y-3">
          {block.buttons.map((button, buttonIndex) => (
            <div key={buttonIndex} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_150px_auto]">
              <Field label="Текст кнопки"><Input value={button.label} onChange={(e) => onUpdate({ buttons: updateButton(block.buttons, buttonIndex, { label: e.target.value }) })} /></Field>
              <Field label="Посилання"><Input value={button.href} onChange={(e) => onUpdate({ buttons: updateButton(block.buttons, buttonIndex, { href: e.target.value }) })} /></Field>
              <Field label="Стиль"><Select value={button.variant ?? 'primary'} onChange={(e) => onUpdate({ buttons: updateButton(block.buttons, buttonIndex, { variant: e.target.value as 'primary' | 'outline' }) })}><option value="primary">Primary</option><option value="outline">Outline</option></Select></Field>
              <div className="flex items-end"><IconTool label="Видалити кнопку" onClick={() => onUpdate({ buttons: block.buttons.filter((_, index) => index !== buttonIndex) })} danger><Trash2 className="h-4 w-4" /></IconTool></div>
            </div>
          ))}
          <SmallAddButton onClick={() => onUpdate({ buttons: [...block.buttons, { label: 'Нова кнопка', href: '/', variant: 'primary' }] })}>Додати кнопку</SmallAddButton>
        </div>
      )

    case 'gallery':
    case 'slider':
      return (
        <div className="space-y-4">
          {block.type === 'slider' ? (
            <Field label="Підпис слайдера"><Input value={block.caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} /></Field>
          ) : null}
          <ImageListEditor images={block.images} onChange={(images) => onUpdate({ images })} />
        </div>
      )
  }
}

function ImageListEditor({
  images,
  onChange,
}: {
  images: Array<{ src: string; alt: string }>
  onChange: (images: Array<{ src: string; alt: string }>) => void
}) {
  return (
    <div className="space-y-3">
      {images.map((image, imageIndex) => (
        <div key={imageIndex} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto]">
          <Field label="URL зображення"><Input value={image.src} onChange={(e) => onChange(updateImage(images, imageIndex, { src: e.target.value }))} /></Field>
          <Field label="Alt текст"><Input value={image.alt} onChange={(e) => onChange(updateImage(images, imageIndex, { alt: e.target.value }))} /></Field>
          <div className="flex items-end"><IconTool label="Видалити фото" onClick={() => onChange(images.filter((_, index) => index !== imageIndex))} danger><Trash2 className="h-4 w-4" /></IconTool></div>
        </div>
      ))}
      <SmallAddButton onClick={() => onChange([...images, { src: '', alt: '' }])}>Додати фото</SmallAddButton>
    </div>
  )
}

function EntityForm({
  status,
  submitLabel,
  onSubmit,
  children,
}: {
  status: string
  submitLabel: string
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {status && status !== 'saving' ? <AdminNotice>{status}</AdminNotice> : null}
      {status === 'saving' ? <div className="text-sm font-semibold text-primary">Збереження...</div> : null}
      {children}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="submit" className="border-primary bg-primary text-white shadow-[0_16px_40px_rgba(242,116,56,0.18)] hover:bg-orange-600">
          <Save className="h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-extrabold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function Checkbox({
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
      <input className="peer sr-only" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cn('relative h-7 w-12 rounded-full transition', checked ? 'bg-primary' : 'bg-slate-200')}>
        <span className={cn('absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-0')} />
      </span>
    </label>
  )
}

function IconTool({
  label,
  children,
  onClick,
  disabled,
  danger,
}: {
  label: string
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl border text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-35',
        danger
          ? 'border-rose-200 bg-rose-50 hover:border-rose-400 hover:text-rose-700'
          : 'border-slate-200 bg-white hover:border-orange-200 hover:text-primary'
      )}
    >
      {children}
    </button>
  )
}

function SmallAddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  )
}

function createBlock(type: NewsContentBlock['type']): NewsContentBlock {
  switch (type) {
    case 'paragraph':
      return { type, width: 'narrow', text: '' }
    case 'image':
      return { type, width: 'medium', height: 'medium', src: '', alt: '', caption: '' }
    case 'video':
      return { type, width: 'medium', height: 'medium', src: '', title: '', caption: '' }
    case 'table':
      return { type, width: 'wide', title: '', columns: ['Колонка 1', 'Колонка 2'], rows: [['', '']] }
    case 'buttons':
      return { type, width: 'medium', buttons: [{ label: 'Підтримати', href: '/help-for-us', variant: 'primary' }] }
    case 'gallery':
      return { type, width: 'wide', images: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }] }
    case 'slider':
      return { type, width: 'medium', height: 'medium', caption: '', images: [{ src: '', alt: '' }, { src: '', alt: '' }] }
  }
}

function normalizeBlocks(value: unknown[] | null | undefined): NewsContentBlock[] {
  if (!Array.isArray(value)) return []
  return value.filter((block): block is NewsContentBlock => {
    return Boolean(block && typeof block === 'object' && 'type' in block)
  })
}

function splitPipes(value: string) {
  return value.split('|').map((item) => item.trim()).filter(Boolean)
}

function rowsToText(rows: string[][]) {
  return rows.map((row) => row.join(' | ')).join('\n')
}

function textToRows(value: string) {
  return value.split('\n').map(splitPipes).filter((row) => row.length > 0)
}

function updateImage(images: Array<{ src: string; alt: string }>, index: number, patch: Partial<{ src: string; alt: string }>) {
  return images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image))
}

function updateButton(
  buttons: Array<{ label: string; href: string; variant?: 'primary' | 'outline' }>,
  index: number,
  patch: Partial<{ label: string; href: string; variant?: 'primary' | 'outline' }>
) {
  return buttons.map((button, buttonIndex) => (buttonIndex === index ? { ...button, ...patch } : button))
}

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function emptyToNull(value: string | null | undefined) {
  if (value == null) return null
  return value.trim() === '' ? null : value
}

function normalizeAnimalPayload(form: ReturnType<typeof emptyAnimal>) {
  return {
    ...form,
    short_description: emptyToNull(form.short_description),
    full_story: emptyToNull(form.full_story),
    approximate_age_label: emptyToNull(form.approximate_age_label),
    published_at: emptyToNull(form.published_at),
  }
}

function normalizeNewsPayload(form: Omit<NewsPostRow, 'id'>) {
  return {
    ...form,
    excerpt: emptyToNull(form.excerpt),
    cover_url: emptyToNull(form.cover_url),
    cover_r2_key: emptyToNull(form.cover_r2_key),
    published_at: emptyToNull(form.published_at),
  }
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
