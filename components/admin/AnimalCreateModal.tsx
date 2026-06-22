'use client'

import { useRef, useState, useTransition } from 'react'
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Hash,
  Heart,
  ImagePlus,
  Loader2,
  Palette,
  PawPrint,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, IconButton } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { toDatetimeLocal } from '@/components/admin/forms/shared'
import {
  createAnimalDraftAction,
  publishAnimalAction,
  updateAnimalDraftAction,
} from '@/app/admin/animals/actions'
import {
  createAnimalPhotoUploadAction,
  deleteAnimalPhotoAction,
  registerAnimalPhotoAction,
  setMainAnimalPhotoAction,
} from '@/app/admin/animals/photo-actions'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

export const COLOR_OPTIONS: Array<{ value: string; hex: string }> = [
  { value: 'Чорний',       hex: '#1c1917' },
  { value: 'Білий',        hex: '#f5f0eb' },
  { value: 'Сірий',        hex: '#9ca3af' },
  { value: 'Рудий',        hex: '#c2440e' },
  { value: 'Коричневий',   hex: '#7c4a1e' },
  { value: 'Палевий',      hex: '#d4a96a' },
  { value: 'Кремовий',     hex: '#ede0cc' },
  { value: 'Тигровий',     hex: '#8b6914' },
  { value: 'Плямистий',    hex: '#a16207' },
  { value: 'Чорно-білий',  hex: '#374151' },
  { value: 'Рудо-білий',   hex: '#ea580c' },
  { value: 'Сіро-білий',   hex: '#6b7280' },
  { value: 'Трьохколірний',hex: '#7c3aed' },
]

export const CHARACTER_TRAITS: string[] = [
  'Ласкавий', 'Активний', 'Спокійний', 'Ігривий', 'Самостійний',
  'Товариський', 'Боязкий', 'Охайний', "Прив'язаний", 'Мирний',
  'Добрий з дітьми', 'Добрий з тваринами', 'Розумний', 'Слухняний', 'Енергійний',
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'details' | 'photos' | 'publish'

type AnimalDetails = {
  name: string
  gender: AnimalRow['gender']
  size: AnimalRow['size']
  status: AnimalRow['status']
  short_description: string
  full_story: string
  approximate_age_label: string
  public_badges: string
  adoption_status: AnimalRow['adoption_status'] | ''
  is_vaccinated: boolean
  is_neutered: boolean
  published_at: string
  animal_number: string
  color: string
  vaccination_count: number
  character_traits: string[]
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnimalCreateModal({
  initialAnimal,
  initialPhotos = [],
  initialStep = 'details',
  triggerLabel = 'Додати тварину',
  triggerDisabled = false,
}: {
  initialAnimal?: AnimalRow
  initialPhotos?: AnimalPhotoRow[]
  initialStep?: Step
  triggerLabel?: string
  triggerDisabled?: boolean
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [animalId, setAnimalId] = useState<string | null>(null)
  const [animalName, setAnimalName] = useState('')
  const [photos, setPhotos] = useState<AnimalPhotoRow[]>([])
  const [details, setDetails] = useState(() => getAnimalDetails(initialAnimal))
  const [detailsSaved, setDetailsSaved] = useState(
    Boolean(initialAnimal && isAnimalDetailsComplete(getAnimalDetails(initialAnimal)))
  )
  const [status, setStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const mainPhoto = photos.find((p) => p.is_main)
  const isEditing = Boolean(initialAnimal)
  const hasPublication = Boolean(initialAnimal?.published_at)
  const detailsComplete = isAnimalDetailsComplete(details)
  const canUsePhotos = Boolean(animalId) && detailsComplete && detailsSaved
  const canUsePublish = canUsePhotos && Boolean(mainPhoto)

  function openModal() {
    const next = getAnimalDetails(initialAnimal)
    const nextComplete = isAnimalDetailsComplete(next)
    const nextHasMain = initialPhotos.some((p) => p.is_main)
    setAnimalId(initialAnimal?.id ?? null)
    setAnimalName(initialAnimal?.name ?? '')
    setDetails(next)
    setDetailsSaved(Boolean(initialAnimal && nextComplete))
    setPhotos(initialPhotos)
    setStatus('')
    setIsOpen(true)
    setStep(getAvailableStep(initialStep, { hasSavedDetails: Boolean(initialAnimal && nextComplete), hasMainPhoto: nextHasMain }))
  }

  function closeModal() {
    setIsOpen(false)
    setStep('details')
    setAnimalId(null)
    setAnimalName('')
    setDetails(getAnimalDetails(initialAnimal))
    setDetailsSaved(Boolean(initialAnimal && isAnimalDetailsComplete(getAnimalDetails(initialAnimal))))
    setPhotos([])
    setStatus('')
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function saveDetails(formData: FormData) {
    if (!detailsComplete) {
      setStatus("Заповни вік, короткий та повний опис — вони обов'язкові.")
      return
    }
    const intent = formData.get('intent')?.toString() ?? 'save-photos'
    setStatus('')
    startTransition(async () => {
      const result = initialAnimal
        ? await updateAnimalDraftAction(initialAnimal.id, formData)
        : await createAnimalDraftAction(formData)
      if (!result.ok) { setStatus(result.error); return }
      setAnimalId(result.animal.id)
      setAnimalName(result.animal.name)
      setDetailsSaved(true)
      router.refresh()
      if (intent === 'save-close') { closeModal(); return }
      if (intent === 'save') return
      if (intent === 'save-publish') {
        if (!mainPhoto) { setStep('photos'); setStatus('Перед публікацією обери головне фото.'); return }
        setStep('publish'); return
      }
      setStep('photos')
    })
  }

  function upd<K extends keyof AnimalDetails>(key: K, value: AnimalDetails[K]) {
    setDetails((c) => ({ ...c, [key]: value }))
    setDetailsSaved(false)
    if (key === 'name') setAnimalName(String(value))
  }

  function changeStep(next: Step) {
    if (next === 'photos' && !canUsePhotos) { setStatus('Спочатку збережи дані тварини.'); return }
    if (next === 'publish' && !canUsePublish) { setStatus('Для публікації потрібні дані та головне фото.'); return }
    setStatus('')
    setStep(next)
  }

  async function uploadPhotos(files: FileList | null) {
    if (!animalId || !files?.length) return
    setStatus('')
    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const upload = await createAnimalPhotoUploadAction({ animalId, fileName: file.name, contentType: file.type || 'image/jpeg' })
        if (!upload.ok) { setStatus(upload.error); continue }
        let resp: Response
        try { resp = await fetch(upload.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } }) }
        catch { setStatus('Браузер заблокував upload у R2. Перевір CORS.'); continue }
        if (!resp.ok) { setStatus(`R2 upload failed: ${resp.status} ${resp.statusText}`); continue }
        const reg = await registerAnimalPhotoAction({ animalId, r2Key: upload.r2Key, publicUrl: upload.publicUrl, alt: `${animalName} фото` })
        if (!reg.ok) { setStatus(reg.error); continue }
        setPhotos((c) => [...c, reg.photo as AnimalPhotoRow])
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    router.refresh()
  }

  function setMainPhoto(photoId: string) {
    if (!animalId) return
    setStatus('')
    startTransition(async () => {
      const r = await setMainAnimalPhotoAction(animalId, photoId)
      if (!r.ok) { setStatus(r.error); return }
      setPhotos((c) => c.map((p) => ({ ...p, is_main: p.id === photoId })))
      router.refresh()
    })
  }

  function deletePhoto(photoId: string) {
    if (!animalId) return
    setStatus('')
    startTransition(async () => {
      const r = await deleteAnimalPhotoAction(animalId, photoId)
      if (!r.ok) { setStatus(r.error); return }
      setPhotos((c) =>
        c.filter((p) => p.id !== r.deletedPhotoId)
         .map((p) => ({ ...p, is_main: r.nextMainPhotoId ? p.id === r.nextMainPhotoId : p.is_main }))
      )
      if (!r.r2Deleted) setStatus('Фото прибрано, але файл у R2 не видалився.')
      router.refresh()
    })
  }

  function publish() {
    if (!animalId) return
    setStatus('')
    const fd = new FormData()
    fd.set('animalId', animalId)
    startTransition(async () => {
      const r = await publishAnimalAction(fd)
      if (!r.ok) { setStatus(r.error); return }
      closeModal(); router.refresh()
    })
  }

  function savePublicationState(nextStatus: AnimalRow['status']) {
    if (!animalId) return
    setStatus('')
    const nextDetails = { ...details, status: nextStatus, published_at: nextStatus === 'draft' ? '' : details.published_at }
    const fd = getAnimalFormData(nextDetails)
    startTransition(async () => {
      const r = await updateAnimalDraftAction(animalId, fd)
      if (!r.ok) { setStatus(r.error); return }
      setDetails(nextDetails)
      setAnimalName(r.animal.name)
      setDetailsSaved(true)
      closeModal(); router.refresh()
    })
  }

  return (
    <>
      <Button onClick={openModal} variant={isEditing ? 'outline' : 'primary'} size={isEditing ? 'sm' : 'md'} disabled={triggerDisabled}>
        {!isEditing ? <Plus className="h-4 w-4" /> : null}
        {triggerLabel}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 pt-8 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.32)]">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                  <PawPrint className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                    {isEditing ? 'Редагування' : 'Нова тварина'}
                  </p>
                  <h2 className="text-lg font-extrabold leading-tight text-slate-950">
                    {animalName || 'Без імені'}
                  </h2>
                </div>
              </div>
              <IconButton label="Закрити" variant="ghost" onClick={closeModal}>
                <X className="h-5 w-5" />
              </IconButton>
            </div>

            {/* ── Step tabs ── */}
            <div className="grid grid-cols-3 border-b border-slate-100 text-sm font-bold">
              {(['details', 'photos', 'publish'] as const).map((s, i) => {
                const labels = ['Дані', 'Фото', 'Публікація']
                const done = s === 'details' ? (detailsSaved && detailsComplete) : s === 'photos' ? Boolean(mainPhoto) : hasPublication
                const disabled = s === 'photos' ? !canUsePhotos : s === 'publish' ? !canUsePublish : false
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeStep(s)}
                    disabled={disabled}
                    className={cn(
                      'flex items-center justify-center gap-2 py-3 text-sm font-bold transition',
                      'border-b-2',
                      step === s ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-700',
                      disabled && 'cursor-not-allowed opacity-40'
                    )}
                  >
                    <span className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black',
                      done ? 'bg-emerald-100 text-emerald-600' : step === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    )}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {labels[i]}
                  </button>
                )
              })}
            </div>

            {/* ── Body ── */}
            <div className="max-h-[calc(100vh-260px)] overflow-y-auto">

              {/* Error */}
              {status ? (
                <div className="mx-6 mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {status}
                </div>
              ) : null}

              {/* ════ STEP: DETAILS ════ */}
              {step === 'details' ? (
                <form action={saveDetails} className="divide-y divide-slate-100">

                  {/* — Ідентифікація — */}
                  <FormSection icon={<Hash className="h-4 w-4" />} label="Ідентифікація">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FL label="Ім'я">
                        <Input name="name" placeholder="Ім'я відсутнє" value={details.name} onChange={(e) => upd('name', e.target.value)} />
                      </FL>
                      <FL label="Номер тварини" hint="Тільки цифри">
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">#</span>
                          <Input name="animal_number" placeholder="0932187" value={details.animal_number} className="pl-7" onChange={(e) => upd('animal_number', e.target.value.replace(/\D/g, ''))} />
                        </div>
                      </FL>
                      <FL label="Дата публікації">
                        <Input name="published_at" type="datetime-local" value={details.published_at} onChange={(e) => upd('published_at', e.target.value)} />
                      </FL>
                    </div>
                  </FormSection>

                  {/* — Характеристика — */}
                  <FormSection icon={<ClipboardList className="h-4 w-4" />} label="Характеристика">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <FL label="Стать">
                        <Select name="gender" value={details.gender} onChange={(e) => upd('gender', e.target.value as AnimalDetails['gender'])}>
                          <option value="male">Хлопчик</option>
                          <option value="female">Дівчинка</option>
                        </Select>
                      </FL>
                      <FL label="Розмір">
                        <Select name="size" value={details.size} onChange={(e) => upd('size', e.target.value as AnimalDetails['size'])}>
                          <option value="small">Малий</option>
                          <option value="medium">Середній</option>
                          <option value="large">Великий</option>
                        </Select>
                      </FL>
                      <FL label="Вік *" hint="1.6 = 1 рік 6 міс.">
                        <Input
                          name="approximate_age_label"
                          placeholder="1.6"
                          value={details.approximate_age_label}
                          onChange={(e) => upd('approximate_age_label', e.target.value.replace(/[^\d.]/g, ''))}
                        />
                      </FL>
                      <FL label="Статус">
                        <Select name="status" value={details.status} onChange={(e) => upd('status', e.target.value as AnimalDetails['status'])}>
                          <option value="draft">Чернетка</option>
                          <option value="available">Доступна</option>
                          <option value="reserved">Резерв</option>
                          <option value="adopted">Прилаштована</option>
                          <option value="hidden">Прихована</option>
                        </Select>
                      </FL>
                    </div>
                    {/* Color picker */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-extrabold text-slate-500">Забарвлення</p>
                      <input type="hidden" name="color" value={details.color} />
                      <ColorPicker value={details.color} onChange={(c) => upd('color', c)} />
                    </div>
                  </FormSection>

                  {/* — Здоров'я — */}
                  <FormSection icon={<ShieldCheck className="h-4 w-4" />} label="Здоров'я">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <VaccinationField count={details.vaccination_count} onChange={(n) => { upd('vaccination_count', n); upd('is_vaccinated', n > 0) }} />
                      <NeuterField gender={details.gender} checked={details.is_neutered} onChange={(v) => upd('is_neutered', v)} />
                    </div>
                    <input type="hidden" name="vaccination_count" value={details.vaccination_count} />
                    <input type="hidden" name="is_vaccinated" value={details.vaccination_count > 0 ? 'on' : ''} />
                    <input type="hidden" name="is_neutered" value={details.is_neutered ? 'on' : ''} />
                    <div className="mt-3">
                      <FL label="Бейдж і фільтр">
                        <Select name="adoption_status" value={details.adoption_status ?? ''} onChange={(e) => upd('adoption_status', e.target.value as AnimalDetails['adoption_status'])}>
                          <option value="">Без бейджа</option>
                          <option value="ready">Готовий до адопції</option>
                          <option value="needs_care">Потребує турботи</option>
                        </Select>
                      </FL>
                    </div>
                  </FormSection>

                  {/* — Опис — */}
                  <FormSection icon={<Heart className="h-4 w-4" />} label="Опис">
                    <div className="space-y-4">
                      <FL label="Короткий опис *">
                        <Textarea
                          name="short_description"
                          className="min-h-[80px]"
                          placeholder="2–3 речення для картки тварини"
                          value={details.short_description}
                          onChange={(e) => upd('short_description', e.target.value)}
                        />
                      </FL>
                      <FL label="Повна історія *">
                        <Textarea
                          name="full_story"
                          className="min-h-[120px]"
                          placeholder="Докладна розповідь"
                          value={details.full_story}
                          onChange={(e) => upd('full_story', e.target.value)}
                        />
                      </FL>
                    </div>
                  </FormSection>

                  {/* — Характер — */}
                  <FormSection icon={<Sparkles className="h-4 w-4" />} label="Характер та звички">
                    <CharacterTraitsField selected={details.character_traits} onChange={(t) => upd('character_traits', t)} />
                    <input type="hidden" name="character_traits" value={details.character_traits.join('\n')} />
                    <div className="mt-4">
                      <FL label="Публічні бейджі" hint="По одному на рядок">
                        <Textarea
                          name="public_badges"
                          className="min-h-[64px]"
                          placeholder={'Готовий до адопції\nШукає родину'}
                          value={details.public_badges}
                          onChange={(e) => upd('public_badges', e.target.value)}
                        />
                      </FL>
                    </div>
                  </FormSection>

                  {/* — Actions — */}
                  <div className="flex items-center justify-between gap-3 bg-slate-50 px-6 py-4">
                    <div className="flex gap-2">
                      <Button type="submit" name="intent" value="save" variant="outline" size="sm" disabled={isPending || !detailsComplete} showIcon={false}>
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Зберегти
                      </Button>
                      <Button type="submit" name="intent" value="save-close" variant="ghost" size="sm" disabled={isPending || !detailsComplete} showIcon={false}>
                        Зберегти і закрити
                      </Button>
                    </div>
                    <Button type="submit" name="intent" value="save-photos" size="sm" disabled={isPending || !detailsComplete}>
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Перейти до фото
                    </Button>
                  </div>
                </form>
              ) : null}

              {/* ════ STEP: PHOTOS ════ */}
              {step === 'photos' ? (
                <div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-4">
                      <div>
                        <p className="text-sm font-extrabold text-slate-800">Фото тварини</p>
                        <p className="mt-0.5 text-xs text-slate-500">Перше фото стає головним автоматично. Зірочка — змінити.</p>
                      </div>
                      <div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => uploadPhotos(e.target.files)} />
                        <Button onClick={() => fileInputRef.current?.click()} disabled={!animalId || isUploading} size="sm">
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                          {isUploading ? 'Завантаження...' : 'Додати фото'}
                        </Button>
                      </div>
                    </div>

                    {photos.length ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {photos.map((photo) => (
                          <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            <div className="aspect-[4/3]">
                              {photo.public_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={photo.public_url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
                              ) : null}
                            </div>
                            {photo.is_main ? (
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-white">
                                <Star className="h-2.5 w-2.5 fill-current" /> Головне
                              </div>
                            ) : null}
                            <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                              <button type="button" onClick={() => setMainPhoto(photo.id)} disabled={isPending || photo.is_main}
                                className={cn('flex h-8 w-8 items-center justify-center rounded-lg border bg-white/90 shadow-sm transition',
                                  photo.is_main ? 'border-amber-300 text-amber-500' : 'border-slate-200 text-slate-500 hover:text-amber-500')}>
                                <Star className={cn('h-3.5 w-3.5', photo.is_main && 'fill-current')} />
                              </button>
                              <button type="button" onClick={() => deletePhoto(photo.id)} disabled={isPending}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-rose-500 shadow-sm transition hover:bg-rose-50">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 py-12 text-center text-sm text-slate-400">
                        Фото ще немає — додай перше
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => setStep('details')} showIcon={false}>
                      <ArrowLeft className="h-4 w-4" /> Назад
                    </Button>
                    <Button size="sm" onClick={() => changeStep('publish')} disabled={!canUsePublish}>
                      Перейти до публікації
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* ════ STEP: PUBLISH ════ */}
              {step === 'publish' ? (
                <div>
                  <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Поточний статус</p>
                      <div className="mt-3"><StatusPill status={details.status} /></div>
                      <p className="mt-3 text-sm text-slate-500">{getPublicationCopy(details.status, hasPublication)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                    <Button variant="ghost" size="sm" onClick={() => setStep('photos')} showIcon={false}>
                      <ArrowLeft className="h-4 w-4" /> Назад
                    </Button>
                    <div className="flex gap-2">
                      {details.status === 'draft' ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => savePublicationState('draft')} disabled={isPending} showIcon={false}>
                            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                            Залишити чернеткою
                          </Button>
                          <Button size="sm" onClick={publish} disabled={isPending || !mainPhoto}>
                            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            Опублікувати
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => savePublicationState(details.status)} disabled={isPending}>
                          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Зберегти
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function FormSection({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-primary">
          {icon}
        </span>
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      {children}
    </div>
  )
}

// ─── Field label ──────────────────────────────────────────────────────────────

function FL({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold text-slate-600">{label}</span>
      {hint ? <span className="mb-1.5 block text-[11px] text-slate-400">{hint}</span> : null}
      {children}
    </label>
  )
}

// ─── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.value}
            onClick={() => onChange(active ? '' : opt.value)}
            className={cn(
              'group relative flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition',
              active
                ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary/30'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: opt.hex }} />
            {opt.value}
            {active ? <Check className="h-3 w-3" /> : null}
          </button>
        )
      })}
    </div>
  )
}

// ─── Vaccination ──────────────────────────────────────────────────────────────

function VaccinationField({ count, onChange }: { count: number; onChange: (n: number) => void }) {
  const active = count > 0
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-slate-700">Вакцинація</p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {active ? `${count} вакцин${count === 1 ? 'а' : count < 5 ? 'и' : ''}` : 'Не вакцинована'}
          </p>
        </div>
        <Toggle active={active} onToggle={() => onChange(active ? 0 : 1)} />
      </div>
      {active ? (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button key={n} type="button" onClick={() => onChange(n)}
              className={cn('h-7 w-7 rounded-lg border text-xs font-extrabold transition',
                count === n ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40')}>
              {n}
            </button>
          ))}
          <input type="number" min={1} max={20} placeholder="7+" value={count > 6 ? count : ''}
            onChange={(e) => { const n = parseInt(e.target.value, 10); if (Number.isFinite(n) && n >= 1 && n <= 20) onChange(n) }}
            className="h-7 w-12 rounded-lg border border-slate-200 bg-slate-50 px-1.5 text-xs font-bold text-slate-700 outline-none focus:border-primary" />
        </div>
      ) : null}
    </div>
  )
}

// ─── Neuter ───────────────────────────────────────────────────────────────────

function NeuterField({ gender, checked, onChange }: { gender: AnimalDetails['gender']; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-xs font-extrabold text-slate-700">
          {gender === 'female' ? 'Стерилізація' : 'Кастрація'}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">{checked ? 'Проведена' : 'Не проведена'}</p>
      </div>
      <label className="cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <Toggle active={checked} onToggle={() => onChange(!checked)} />
      </label>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition', active ? 'bg-primary' : 'bg-slate-200')}>
      <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', active && 'translate-x-5')} />
    </button>
  )
}

// ─── Character Traits ─────────────────────────────────────────────────────────

function CharacterTraitsField({ selected, onChange }: { selected: string[]; onChange: (t: string[]) => void }) {
  function toggle(trait: string) {
    if (selected.includes(trait)) onChange(selected.filter((t) => t !== trait))
    else if (selected.length < 5) onChange([...selected, trait])
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CHARACTER_TRAITS.map((trait) => {
          const active = selected.includes(trait)
          const disabled = !active && selected.length >= 5
          return (
            <button key={trait} type="button" disabled={disabled} onClick={() => toggle(trait)}
              className={cn('flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-semibold transition',
                active ? 'border-primary bg-orange-50 text-primary' :
                disabled ? 'cursor-not-allowed border-slate-100 text-slate-300' :
                'border-slate-200 bg-white text-slate-600 hover:border-slate-300')}>
              {active ? <Check className="h-3 w-3" /> : null}
              {trait}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        {selected.length > 0
          ? `Обрано: ${selected.join(', ')}`
          : 'Оберіть до 5 рис характеру'}
      </p>
    </div>
  )
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: AnimalRow['status'] }) {
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-extrabold',
      status === 'available' && 'bg-emerald-50 text-emerald-700',
      status === 'reserved' && 'bg-amber-50 text-amber-700',
      (status === 'adopted' || status === 'hidden') && 'bg-rose-50 text-rose-700',
      status === 'draft' && 'bg-slate-100 text-slate-600')}>
      {{ draft: 'Чернетка', available: 'Опублікована', reserved: 'Резерв', adopted: 'Прилаштована', hidden: 'Прихована' }[status]}
    </span>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAnimalDetails(a?: AnimalRow): AnimalDetails {
  return {
    name: a?.name ?? '',
    gender: a?.gender ?? 'male',
    size: a?.size ?? 'medium',
    status: a?.status ?? 'draft',
    short_description: a?.short_description ?? '',
    full_story: a?.full_story ?? '',
    approximate_age_label: a?.approximate_age_label ?? '',
    public_badges: a?.public_badges?.join('\n') ?? '',
    adoption_status: a?.adoption_status ?? '',
    is_vaccinated: Boolean(a?.is_vaccinated),
    is_neutered: Boolean(a?.is_neutered),
    published_at: toDatetimeLocal(a?.published_at),
    animal_number: a?.animal_number ?? '',
    color: a?.color ?? '',
    vaccination_count: a?.vaccination_count ?? 0,
    character_traits: a?.character_traits ?? [],
  }
}

function getAnimalFormData(d: AnimalDetails) {
  const fd = new FormData()
  fd.set('name', d.name)
  fd.set('gender', d.gender)
  fd.set('size', d.size)
  fd.set('status', d.status)
  fd.set('short_description', d.short_description)
  fd.set('full_story', d.full_story)
  fd.set('approximate_age_label', d.approximate_age_label)
  fd.set('public_badges', d.public_badges)
  fd.set('adoption_status', d.adoption_status ?? '')
  fd.set('published_at', d.published_at)
  fd.set('animal_number', d.animal_number)
  fd.set('color', d.color)
  fd.set('vaccination_count', String(d.vaccination_count))
  fd.set('character_traits', d.character_traits.join('\n'))
  if (d.vaccination_count > 0) fd.set('is_vaccinated', 'on')
  if (d.is_neutered) fd.set('is_neutered', 'on')
  return fd
}

function isAnimalDetailsComplete(d: AnimalDetails) {
  return Boolean(d.approximate_age_label.trim() && d.short_description.trim() && d.full_story.trim())
}

function getAvailableStep(req: Step, s: { hasSavedDetails: boolean; hasMainPhoto: boolean }): Step {
  if (req === 'publish') return s.hasSavedDetails && s.hasMainPhoto ? 'publish' : 'details'
  if (req === 'photos') return s.hasSavedDetails ? 'photos' : 'details'
  return 'details'
}

function getPublicationCopy(status: AnimalRow['status'], hasPub: boolean) {
  if (status === 'draft') return 'Чернетка не показується в публічному каталозі.'
  if (status === 'available') return hasPub ? 'Тварина доступна в публічному каталозі.' : 'Після збереження тварина буде у каталозі.'
  if (status === 'reserved') return 'Тварина зарезервована.'
  if (status === 'adopted') return 'Тварину вже прилаштовано.'
  return 'Прихований запис не показується на сайті.'
}
