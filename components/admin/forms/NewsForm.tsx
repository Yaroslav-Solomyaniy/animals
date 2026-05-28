'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  ImageIcon,
  Images,
  Loader2,
  MousePointerClick,
  SlidersHorizontal,
  Table2,
  Trash2,
  Type,
  Video,
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
import { SITE_ROUTES } from '@/lib/site-config'
import {
  Checkbox,
  EntityForm,
  Field,
  IconTool,
  SmallAddButton,
  emptyToNull,
} from '@/components/admin/forms/shared'

const emptyNews = () => ({
  title: '',
  excerpt: '',
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
          excerpt: initial.excerpt ?? '',
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
  const selectedAnimal = animals.find((animal) => animal.id === form.related_animal_id)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    const payload = normalizeNewsPayload({ ...form, content_blocks: blocks })
    const result = await saveNewsPostAction(newsId ? 'edit' : mode, newsId, payload)

    if (!result.ok) {
      setStatus(result.error)
      return
    }

    setNewsId(result.id)
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

      const saved = await setNewsCoverAction({
        newsId: upload.newsId,
        r2Key: upload.r2Key,
        publicUrl: upload.publicUrl,
      })

      if (!saved.ok) {
        setStatus(saved.error)
        return
      }

      if (form.cover_r2_key && form.cover_r2_key !== upload.r2Key) {
        await deleteUploadedImage(form.cover_r2_key)
      }

      setForm((current) => ({
        ...current,
        cover_url: upload.publicUrl,
        cover_r2_key: upload.r2Key,
      }))
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
    const upload = await createNewsImageUploadAction({
      newsId: currentNewsId,
      fileName: file.name,
      contentType: file.type || 'image/jpeg',
    })

    if (!upload.ok) {
      setStatus(upload.error)
      return null
    }

    let response: Response
    try {
      response = await fetch(upload.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      })
    } catch {
      setStatus('Браузер заблокував upload у R2. Перевір CORS policy для bucket.')
      return null
    }

    if (!response.ok) {
      const details = await response.text().catch(() => '')
      setStatus(`R2 upload failed: ${response.status} ${response.statusText}${details ? ` — ${details}` : ''}`)
      return null
    }

    return { ...upload, newsId: currentNewsId }
  }

  async function createDraftForUpload() {
    const payload = normalizeNewsPayload({ ...form, content_blocks: blocks })
    const result = await saveNewsPostAction('create', null, {
      ...payload,
      is_published: false,
    })

    if (!result.ok) {
      setStatus(result.error)
      return null
    }

    setNewsId(result.id)
    router.replace(`/admin/news/${result.id}`)
    router.refresh()

    return result.id
  }

  async function deleteUploadedImage(r2Key: string | undefined) {
    if (!newsId || !r2Key) return true

    const deleted = await deleteNewsImageAction({
      newsId,
      r2Key,
    })

    if (!deleted.ok) {
      setStatus(deleted.error)
      return false
    }

    return true
  }

  async function removeCover() {
    if (!form.cover_url) return
    setStatus('')

    const cleared = newsId ? await clearNewsCoverAction(newsId) : { ok: true as const }
    if (!cleared.ok) {
      setStatus(cleared.error)
      return
    }

    const deleted = await deleteUploadedImage(form.cover_r2_key || undefined)
    if (!deleted) return

    setForm((current) => ({
      ...current,
      cover_url: '',
      cover_r2_key: '',
    }))
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
      <Field label="Заголовок"><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></Field>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-950">Обкладинка новини</h3>
            <p className="mt-1 text-sm text-slate-500">
              Завантаж фото після створення чернетки. Технічні URL і R2 key форма сховає.
            </p>
          </div>
          <div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => uploadCover(event.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isCoverUploading}
              onClick={() => coverInputRef.current?.click()}
            >
              {isCoverUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {newsId ? 'Завантажити обкладинку' : 'Завантажити обкладинку'}
            </Button>
          </div>
        </div>
        {form.cover_url ? (
          <div className="mt-4 space-y-3">
            <img
              src={form.cover_url}
              alt={form.title || 'Обкладинка новини'}
              className="aspect-[16/7] w-full rounded-xl border border-slate-200 object-cover"
            />
            <Button type="button" variant="danger" size="sm" onClick={removeCover}>
              <Trash2 className="h-4 w-4" />
              Видалити обкладинку
            </Button>
          </div>
        ) : null}
      </div>

      <RelatedAnimalPicker
        animals={animals}
        selectedAnimal={selectedAnimal}
        isOpen={isAnimalModalOpen}
        onOpen={() => setIsAnimalModalOpen(true)}
        onClose={() => setIsAnimalModalOpen(false)}
        onSelect={(animalId) => {
          setForm((current) => ({ ...current, related_animal_id: animalId }))
          setIsAnimalModalOpen(false)
        }}
        onClear={() => setForm((current) => ({ ...current, related_animal_id: null }))}
      />

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
                <Button
                  key={action.type}
                  type="button"
                  onClick={() => addBlock(action.type)}
                  variant="outline"
                  size="sm"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
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

function RelatedAnimalPicker({
  animals,
  selectedAnimal,
  isOpen,
  onOpen,
  onClose,
  onSelect,
  onClear,
}: {
  animals: AnimalRow[]
  selectedAnimal: AnimalRow | undefined
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onSelect: (animalId: string) => void
  onClear: () => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-950">Повʼязана собака</h3>
          <p className="mt-1 text-sm text-slate-500">
            {selectedAnimal ? selectedAnimal.name : 'Новина не привʼязана до собаки.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedAnimal ? (
            <Button type="button" variant="outline" size="sm" onClick={onClear}>
              Прибрати
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={onOpen}>
            Обрати собаку
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950">Обрати собаку</h3>
                <p className="mt-1 text-sm text-slate-500">Показуємо весь каталог собак з адмінки.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Закрити
              </Button>
            </div>
            <div className="grid max-h-[62vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2">
              {animals.length > 0 ? (
                animals.map((animal) => {
                  const isSelected = selectedAnimal?.id === animal.id

                  return (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => onSelect(animal.id)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
                    >
                      <span>
                        <span className="block font-extrabold text-slate-950">{animal.name}</span>
                        <span className="mt-1 block text-sm text-slate-500">{animal.status}</span>
                      </span>
                      {isSelected ? <Check className="h-5 w-5 text-primary" /> : null}
                    </button>
                  )
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-500 sm:col-span-2">
                  Собак у каталозі поки немає.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function BlockEditor({
  block,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUploadImage,
  onDeleteImage,
  uploadingKey,
  setUploadingKey,
  canMoveUp,
  canMoveDown,
}: {
  block: NewsContentBlock
  index: number
  onUpdate: (patch: Partial<NewsContentBlock>) => void
  onRemove: () => void | Promise<void>
  onMoveUp: () => void
  onMoveDown: () => void
  onUploadImage: (file: File) => Promise<{ r2Key: string; publicUrl: string; newsId: string } | null>
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
  uploadingKey: string
  setUploadingKey: (key: string) => void
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
          <IconTool label="Видалити" onClick={() => void onRemove()} danger><Trash2 className="h-4 w-4" /></IconTool>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <BlockSizing block={block} onUpdate={onUpdate} />
        <BlockFields
          block={block}
          blockIndex={index}
          onUpdate={onUpdate}
          onUploadImage={onUploadImage}
          onDeleteImage={onDeleteImage}
          uploadingKey={uploadingKey}
          setUploadingKey={setUploadingKey}
        />
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
  blockIndex,
  onUpdate,
  onUploadImage,
  onDeleteImage,
  uploadingKey,
  setUploadingKey,
}: {
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
        <Field label="Текст">
          <Textarea className="min-h-44" value={block.text} onChange={(e) => onUpdate({ text: e.target.value })} />
        </Field>
      )

    case 'image':
      return (
        <div className="grid gap-4">
          <NewsImageUploader
            image={{ src: block.src, alt: block.alt, r2Key: block.r2Key }}
            uploadKey={`${blockIndex}-image`}
            uploadingKey={uploadingKey}
            setUploadingKey={setUploadingKey}
            onUpload={async (file) => {
              const upload = await onUploadImage(file)
              if (upload) {
                onUpdate({ src: upload.publicUrl, r2Key: upload.r2Key })
              }
            }}
            onDelete={async () => {
              const deleted = await onDeleteImage(block.r2Key)
              if (deleted) {
                onUpdate({ src: '', r2Key: undefined })
              }
            }}
          />
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
          <ImageListEditor
            images={block.images}
            blockIndex={blockIndex}
            uploadingKey={uploadingKey}
            setUploadingKey={setUploadingKey}
            onUploadImage={onUploadImage}
            onDeleteImage={onDeleteImage}
            onChange={(images) => onUpdate({ images })}
          />
        </div>
      )
  }
}

function ImageListEditor({
  images,
  blockIndex,
  uploadingKey,
  setUploadingKey,
  onUploadImage,
  onDeleteImage,
  onChange,
}: {
  images: NewsImageValue[]
  blockIndex: number
  uploadingKey: string
  setUploadingKey: (key: string) => void
  onUploadImage: (file: File) => Promise<{ r2Key: string; publicUrl: string; newsId: string } | null>
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
  onChange: (images: NewsImageValue[]) => void
}) {
  return (
    <div className="space-y-3">
      {images.map((image, imageIndex) => (
        <div key={imageIndex} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
          <NewsImageUploader
            image={image}
            uploadKey={`${blockIndex}-list-${imageIndex}`}
            uploadingKey={uploadingKey}
            setUploadingKey={setUploadingKey}
            onUpload={async (file) => {
              const upload = await onUploadImage(file)
              if (upload) {
                onChange(updateImage(images, imageIndex, { src: upload.publicUrl, r2Key: upload.r2Key }))
              }
            }}
            onDelete={async () => {
              const deleted = await onDeleteImage(image.r2Key)
              if (deleted) {
                onChange(images.filter((_, index) => index !== imageIndex))
              }
            }}
          />
          <Field label="Alt текст"><Input value={image.alt} onChange={(e) => onChange(updateImage(images, imageIndex, { alt: e.target.value }))} /></Field>
        </div>
      ))}
      <SmallAddButton onClick={() => onChange([...images, { src: '', alt: '' }])}>Додати фото</SmallAddButton>
    </div>
  )
}

type NewsImageValue = {
  src: string
  alt: string
  r2Key?: string
}

function NewsImageUploader({
  image,
  uploadKey,
  uploadingKey,
  setUploadingKey,
  onUpload,
  onDelete,
}: {
  image: NewsImageValue
  uploadKey: string
  uploadingKey: string
  setUploadingKey: (key: string) => void
  onUpload: (file: File) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const isUploading = uploadingKey === uploadKey

  return (
    <div className="space-y-2">
      {image.src ? (
        <img
          src={image.src}
          alt={image.alt || 'Фото новини'}
          className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm font-bold text-slate-400">
          Фото не завантажено
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {image.src ? 'Замінити фото' : 'Завантажити фото'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setUploadingKey(uploadKey)
              try {
                await onUpload(file)
              } finally {
                setUploadingKey('')
                event.currentTarget.value = ''
              }
            }}
          />
        </label>
        {image.src ? (
          <Button type="button" variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Видалити
          </Button>
        ) : null}
      </div>
    </div>
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
      return { type, width: 'medium', buttons: [{ label: 'Підтримати', href: SITE_ROUTES.help, variant: 'primary' }] }
    case 'gallery':
      return { type, width: 'wide', images: [] }
    case 'slider':
      return { type, width: 'medium', height: 'medium', caption: '', images: [] }
  }
}

async function deleteBlockImages(
  block: NewsContentBlock,
  onDeleteImage: (r2Key: string | undefined) => Promise<boolean>
) {
  if (block.type === 'image') {
    await onDeleteImage(block.r2Key)
    return
  }

  if (block.type === 'gallery' || block.type === 'slider') {
    await Promise.all(block.images.map((image) => onDeleteImage(image.r2Key)))
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

function updateImage(images: NewsImageValue[], index: number, patch: Partial<NewsImageValue>) {
  return images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image))
}

function updateButton(
  buttons: Array<{ label: string; href: string; variant?: 'primary' | 'outline' }>,
  index: number,
  patch: Partial<{ label: string; href: string; variant?: 'primary' | 'outline' }>
) {
  return buttons.map((button, buttonIndex) => (buttonIndex === index ? { ...button, ...patch } : button))
}

function normalizeNewsPayload(form: {
  title: string
  excerpt: string | null
  content_blocks: NewsContentBlock[]
  cover_url: string | null
  cover_r2_key: string | null
  related_animal_id: string | null
  is_published: boolean | null
}): NewsFormPayload {
  return {
    ...form,
    slug: '',
    excerpt: emptyToNull(form.excerpt),
    content_blocks: form.content_blocks,
    cover_url: emptyToNull(form.cover_url),
    cover_r2_key: emptyToNull(form.cover_r2_key),
    related_animal_id: emptyToNull(form.related_animal_id),
    is_published: Boolean(form.is_published),
    published_at: null,
  }
}
