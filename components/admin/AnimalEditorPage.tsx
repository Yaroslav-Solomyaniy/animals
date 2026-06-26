'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Globe,
  Hash,
  Heart,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Lock,
  PawPrint,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { toDatetimeLocal } from '@/components/admin/forms/shared'
import { createAnimalDraftAction, deleteAnimalAction, publishAnimalAction, updateAnimalDraftAction } from '@/app/admin/animals/actions'
import {
  createAnimalPhotoUploadAction,
  deleteAnimalPhotoAction,
  registerAnimalPhotoAction,
  setMainAnimalPhotoAction,
} from '@/app/admin/animals/photo-actions'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'
import { cn } from '@/lib/utils'
import { formatAge } from '@/lib/formatAge'

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_OPTIONS: Array<{ value: string; hex: string }> = [
  { value: 'Чорний', hex: '#1c1917' },
  { value: 'Білий', hex: '#f5f0eb' },
  { value: 'Сірий', hex: '#9ca3af' },
  { value: 'Рудий', hex: '#c2440e' },
  { value: 'Коричневий', hex: '#7c4a1e' },
  { value: 'Палевий', hex: '#d4a96a' },
  { value: 'Кремовий', hex: '#ede0cc' },
  { value: 'Тигровий', hex: '#8b6914' },
  { value: 'Плямистий', hex: '#a16207' },
  { value: 'Чорно-білий', hex: '#374151' },
  { value: 'Рудо-білий', hex: '#ea580c' },
  { value: 'Сіро-білий', hex: '#6b7280' },
  { value: 'Трьохколірний', hex: '#7c3aed' },
]

const CHARACTER_TRAITS: string[] = [
  'Ласкавий',
  'Активний',
  'Спокійний',
  'Ігривий',
  'Самостійний',
  'Товариський',
  'Боязкий',
  'Охайний',
  "Прив'язаний",
  'Мирний',
  'Добрий з дітьми',
  'Добрий з тваринами',
  'Розумний',
  'Слухняний',
  'Енергійний',
]

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimalDetails = {
  name: string
  gender: AnimalRow['gender']
  size: AnimalRow['size']
  status: AnimalRow['status']
  short_description: string
  full_story: string
  approximate_age_label: string
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

export default function AnimalEditorPage({
  initialAnimal,
  initialPhotos = [],
}: {
  initialAnimal?: AnimalRow
  initialPhotos?: AnimalPhotoRow[]
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [animalId, setAnimalId] = useState<string | null>(initialAnimal?.id ?? null)
  const [animalName, setAnimalName] = useState(initialAnimal?.name ?? '')
  const [photos, setPhotos] = useState<AnimalPhotoRow[]>(initialPhotos)
  const [details, setDetails] = useState<AnimalDetails>(() => getAnimalDetails(initialAnimal))
  const [detailsSaved, setDetailsSaved] = useState(Boolean(initialAnimal && isAnimalDetailsComplete(getAnimalDetails(initialAnimal))))
  const [errorMsg, setErrorMsg] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [activeSection, setActiveSection] = useState('identification')

  const isEditing = Boolean(initialAnimal)
  const mainPhoto = photos.find((p) => p.is_main)
  const detailsComplete = isAnimalDetailsComplete(details)
  const canUsePhotos = Boolean(animalId) && detailsComplete && detailsSaved

  // Scroll spy
  const sectionIds = ['identification', 'characteristics', 'health', 'description', 'character', 'photos']
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-10% 0px -75% 0px' }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function upd<K extends keyof AnimalDetails>(key: K, value: AnimalDetails[K]) {
    setDetails((c) => ({ ...c, [key]: value }))
    setDetailsSaved(false)
    setSaveSuccess(false)
    if (key === 'name') setAnimalName(String(value))
  }

  function handleSave() {
    if (!detailsComplete) {
      setErrorMsg("Заповни вік, короткий та повний опис — вони обов'язкові.")
      scrollTo('description')
      return
    }
    setErrorMsg('')
    const fd = getAnimalFormData(details)
    startTransition(async () => {
      const result = initialAnimal ? await updateAnimalDraftAction(initialAnimal.id, fd) : await createAnimalDraftAction(fd)
      if (!result.ok) {
        setErrorMsg(result.error)
        return
      }
      setAnimalId(result.animal.id)
      setAnimalName(result.animal.name)
      setDetailsSaved(true)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      if (!initialAnimal) {
        router.push(`/admin/animals/${result.animal.id}`)
        return
      }
      router.refresh()
    })
  }

  async function uploadPhotos(files: FileList | null) {
    if (!animalId || !files?.length) return
    setErrorMsg('')
    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const upload = await createAnimalPhotoUploadAction({ animalId, fileName: file.name, contentType: file.type || 'image/jpeg' })
        if (!upload.ok) {
          setErrorMsg(upload.error)
          continue
        }
        let resp: Response
        try {
          resp = await fetch(upload.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
          })
        } catch {
          setErrorMsg('Upload заблоковано. Перевір CORS у R2.')
          continue
        }
        if (!resp.ok) {
          setErrorMsg(`R2 помилка: ${resp.status}`)
          continue
        }
        const reg = await registerAnimalPhotoAction({
          animalId,
          r2Key: upload.r2Key,
          publicUrl: upload.publicUrl,
          alt: `${animalName} фото`,
        })
        if (!reg.ok) {
          setErrorMsg(reg.error)
          continue
        }
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
    startTransition(async () => {
      const r = await setMainAnimalPhotoAction(animalId, photoId)
      if (!r.ok) {
        setErrorMsg(r.error)
        return
      }
      setPhotos((c) => c.map((p) => ({ ...p, is_main: p.id === photoId })))
      router.refresh()
    })
  }

  function deletePhoto(photoId: string) {
    if (!animalId) return
    startTransition(async () => {
      const r = await deleteAnimalPhotoAction(animalId, photoId)
      if (!r.ok) {
        setErrorMsg(r.error)
        return
      }
      setPhotos((c) =>
        c
          .filter((p) => p.id !== r.deletedPhotoId)
          .map((p) => ({ ...p, is_main: r.nextMainPhotoId ? p.id === r.nextMainPhotoId : p.is_main }))
      )
      if (!r.r2Deleted) setErrorMsg('Фото прибрано, але файл у R2 не видалився.')
      router.refresh()
    })
  }

  function publish() {
    if (!animalId) return
    const fd = new FormData()
    fd.set('animalId', animalId)
    startTransition(async () => {
      const r = await publishAnimalAction(fd)
      if (!r.ok) {
        setErrorMsg(r.error)
        return
      }
      setDetails((d) => ({ ...d, status: 'available' }))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      router.refresh()
    })
  }

  function changeStatus(nextStatus: AnimalRow['status']) {
    if (!animalId) return
    setErrorMsg('')
    const nextDetails = { ...details, status: nextStatus }
    const fd = getAnimalFormData(nextDetails)
    startTransition(async () => {
      const r = await updateAnimalDraftAction(animalId, fd)
      if (!r.ok) {
        setErrorMsg(r.error)
        return
      }
      setDetails(nextDetails)
      setDetailsSaved(true)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      router.refresh()
    })
  }

  async function handleDelete() {
    if (!animalId) return
    if (!confirm(`Видалити «${animalName || 'тварину'}»? Всі фото також будуть видалені з R2. Цю дію не можна скасувати.`)) return
    startTransition(async () => {
      const r = await deleteAnimalAction(animalId)
      if (!r.ok) {
        setErrorMsg(r.error)
        return
      }
      router.push('/admin/animals')
    })
  }

  const navSections = [
    { id: 'identification', label: 'Ідентифікація', icon: <Hash className="h-3.5 w-3.5" />, done: Boolean(details.name.trim()) },
    {
      id: 'characteristics',
      label: 'Характеристика',
      icon: <ClipboardList className="h-3.5 w-3.5" />,
      done: Boolean(details.approximate_age_label.trim()),
    },
    {
      id: 'health',
      label: "Здоров'я",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      done: details.vaccination_count > 0 || details.is_neutered,
    },
    {
      id: 'description',
      label: 'Опис',
      icon: <Heart className="h-3.5 w-3.5" />,
      done: Boolean(details.short_description.trim() && details.full_story.trim()),
    },
    { id: 'character', label: 'Характер', icon: <Sparkles className="h-3.5 w-3.5" />, done: details.character_traits.length > 0 },
    { id: 'photos', label: 'Фото', icon: <ImageIcon className="h-3.5 w-3.5" />, done: Boolean(mainPhoto), locked: !canUsePhotos },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* WordPress-style sticky editor header */}
      <header className="sticky top-0 z-40 flex h-14 items-center border-b rounded border-slate-200 bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-6">
        {/* Left: back + breadcrumb */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/admin/animals"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Тварини</span>
          </Link>

          <span className="text-slate-300">/</span>

          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-primary">
              <PawPrint className="h-3.5 w-3.5" />
            </span>
            <span className="truncate text-sm font-bold text-slate-800">{animalName || (isEditing ? 'Без імені' : 'Нова тварина')}</span>
          </div>
        </div>

        {/* Right: status selector + save indicator + save + site link */}
        <div className="flex shrink-0 items-center gap-2">
          {saveSuccess ? (
            <span className="hidden h-9 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-bold text-emerald-700 sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Збережено
            </span>
          ) : null}

          {!detailsSaved && detailsComplete ? <span className="hidden text-xs text-slate-400 sm:block">Незбережені зміни</span> : null}

          {/* Publication date */}
          <input
            type="datetime-local"
            value={details.published_at}
            onChange={(e) => upd('published_at', e.target.value)}
            className="hidden h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-orange-200 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:block"
          />

          {/* Status selector */}
          <Select
            wrapperClassName="hidden sm:block"
            className="h-9 min-w-[148px] rounded-lg py-0 pl-3 pr-1 text-xs font-bold"
            value={details.status}
            disabled={isPending}
            onChange={(e) => {
              const s = e.target.value as AnimalRow['status']
              if (animalId) {
                if (s === 'available' && details.status !== 'available') {
                  publish()
                } else {
                  changeStatus(s)
                }
              } else {
                upd('status', s)
              }
            }}
          >
            <option value="draft">Чернетка</option>
            <option value="available">Опублікована</option>
            <option value="adopted">Прилаштована</option>
          </Select>

          <Button onClick={handleSave} disabled={isPending || !detailsComplete} size="sm" showIcon={false}>
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isEditing ? 'Зберегти' : 'Створити'}</span>
          </Button>

          {isEditing && initialAnimal?.slug && details.status === 'available' ? (
            <Link
              href={`/animals/${initialAnimal.slug}`}
              target="_blank"
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:flex"
            >
              <Globe className="h-3 w-3" />
              Переглянути на сайті ↗
            </Link>
          ) : null}

          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              title="Видалити тварину"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>

      {/* ── Error banner ── */}
      {errorMsg ? (
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 sm:mx-6">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <p className="text-sm font-semibold text-rose-700">{errorMsg}</p>
        </div>
      ) : null}

      {/* ── Two-column layout ── */}
      <div className="flex flex-1 gap-6 py-5">
        {/* ── Left Sidebar ─────────────────────────────────── */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-[72px] space-y-4">
            {/* Animal preview card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-slate-100">
                {mainPhoto?.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mainPhoto.public_url} alt={animalName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 text-slate-300">
                    <PawPrint className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="px-4 py-3">
                <p className="truncate text-sm font-extrabold text-slate-900">
                  {animalName || <span className="italic text-slate-400">Без імені</span>}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {details.approximate_age_label ? formatAge(details.approximate_age_label, 'Вік не вказано') : 'Вік не вказано'} ·{' '}
                  {details.gender === 'male' ? '♂' : '♀'}
                </p>
              </div>
            </div>

            {/* Key data preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Дані запису</p>
              <div className="space-y-1.5">
                <PreviewRow label="Вік" value={details.approximate_age_label ? formatAge(details.approximate_age_label, '—') : '—'} />
                <PreviewRow label="Стать" value={details.gender === 'male' ? '♂ Хлопчик' : '♀ Дівчинка'} />
                <PreviewRow
                  label="Розмір"
                  value={details.size === 'small' ? 'Малий' : details.size === 'medium' ? 'Середній' : 'Великий'}
                />
                {details.color ? (
                  <PreviewRow label="Колір" value={details.color} dot={COLOR_OPTIONS.find((c) => c.value === details.color)?.hex} />
                ) : null}
                <PreviewRow label="Вакцинація" value={details.vaccination_count > 0 ? `✓ (${details.vaccination_count})` : '—'} />
                <PreviewRow label={details.gender === 'female' ? 'Стерилізація' : 'Кастрація'} value={details.is_neutered ? '✓' : '—'} />
                {details.adoption_status ? (
                  <PreviewRow label="Бейдж" value={details.adoption_status === 'ready' ? 'Готовий до адопції' : 'Потребує турботи'} />
                ) : null}
                <PreviewRow label="Фото" value={photos.length > 0 ? String(photos.length) : '—'} />
              </div>
            </div>

            {/* Section nav */}
            <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <p className="mb-1 px-2 pt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Розділи</p>
              {navSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-semibold transition',
                    activeSection === s.id ? 'bg-orange-50 text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-lg',
                      activeSection === s.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {s.locked ? <Lock className="h-2.5 w-2.5" /> : s.icon}
                  </span>
                  <span className="flex-1 truncate">{s.label}</span>
                  {!s.locked && s.done ? <Check className="h-2.5 w-2.5 text-emerald-500" /> : null}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="min-w-0 flex-1 space-y-4">
          {/* Mobile section nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 xl:hidden">
            {navSections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition',
                  activeSection === s.id ? 'border-primary bg-orange-50 text-primary' : 'border-slate-200 bg-white text-slate-500'
                )}
              >
                {s.locked ? <Lock className="h-2.5 w-2.5" /> : s.icon}
                {s.label}
              </button>
            ))}
          </div>

          {/* ═══ ІДЕНТИФІКАЦІЯ ═══════════════════════════════ */}
          <EditorSection id="identification" icon={<Hash className="h-4 w-4" />} title="Ідентифікація">
            <div className="grid gap-4 sm:grid-cols-2">
              <FL label="Ім'я тварини">
                <Input name="name" placeholder="Ім'я відсутнє" value={details.name} onChange={(e) => upd('name', e.target.value)} />
              </FL>
              <FL label="Номер тварини">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">#</span>
                  <Input
                    name="animal_number"
                    placeholder="0932187"
                    value={details.animal_number}
                    className="pl-7"
                    onChange={(e) => upd('animal_number', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <FieldHint>Тільки цифри</FieldHint>
              </FL>
            </div>
          </EditorSection>

          {/* ═══ ХАРАКТЕРИСТИКА ══════════════════════════════ */}
          <EditorSection id="characteristics" icon={<ClipboardList className="h-4 w-4" />} title="Характеристика">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <FL label="Стать">
                <Select name="gender" value={details.gender} onChange={(e) => upd('gender', e.target.value as AnimalDetails['gender'])}>
                  <option value="male">♂ Хлопчик</option>
                  <option value="female">♀ Дівчинка</option>
                </Select>
              </FL>
              <FL label="Розмір">
                <Select name="size" value={details.size} onChange={(e) => upd('size', e.target.value as AnimalDetails['size'])}>
                  <option value="small">Малий</option>
                  <option value="medium">Середній</option>
                  <option value="large">Великий</option>
                </Select>
              </FL>
              <FL label="Вік *">
                <Input
                  name="approximate_age_label"
                  placeholder="1.6"
                  value={details.approximate_age_label}
                  onChange={(e) => upd('approximate_age_label', e.target.value.replace(/[^\d.]/g, ''))}
                />
                <FieldHint>1.6 = 1 рік 6 місяців</FieldHint>
              </FL>
            </div>

            <div className="mt-4">
              <p className="mb-3 text-xs font-extrabold text-slate-500">Забарвлення</p>
              <ColorPicker value={details.color} onChange={(c) => upd('color', c)} />
            </div>
          </EditorSection>

          {/* ═══ ЗДОРОВ'Я ════════════════════════════════════ */}
          <EditorSection id="health" icon={<ShieldCheck className="h-4 w-4" />} title="Здоров'я">
            <div className="grid gap-4 sm:grid-cols-2">
              <VaccinationField
                count={details.vaccination_count}
                onChange={(n) => {
                  upd('vaccination_count', n)
                  upd('is_vaccinated', n > 0)
                }}
              />
              <NeuterField gender={details.gender} checked={details.is_neutered} onChange={(v) => upd('is_neutered', v)} />
            </div>
            <div className="mt-4">
              <FL label="Бейдж і фільтр у каталозі">
                <Select
                  name="adoption_status"
                  value={details.adoption_status ?? ''}
                  onChange={(e) => upd('adoption_status', e.target.value as AnimalDetails['adoption_status'])}
                >
                  <option value="">Без бейджа</option>
                  <option value="ready">Готовий до адопції</option>
                  <option value="needs_care">Потребує турботи</option>
                </Select>
              </FL>
            </div>
          </EditorSection>

          {/* ═══ ОПИС ════════════════════════════════════════ */}
          <EditorSection id="description" icon={<Heart className="h-4 w-4" />} title="Опис" required>
            <div className="space-y-4">
              <FL label="Короткий опис *">
                <Textarea
                  name="short_description"
                  className="min-h-20"
                  placeholder="2–3 речення для картки тварини в каталозі..."
                  value={details.short_description}
                  onChange={(e) => upd('short_description', e.target.value)}
                />
              </FL>
              <FL label="Повна історія *">
                <Textarea
                  name="full_story"
                  className="min-h-65"
                  placeholder="Докладна розповідь — де знайшли, як поводиться, що любить..."
                  value={details.full_story}
                  onChange={(e) => upd('full_story', e.target.value)}
                />
              </FL>
            </div>
          </EditorSection>

          {/* ═══ ХАРАКТЕР ════════════════════════════════════ */}
          <EditorSection id="character" icon={<Sparkles className="h-4 w-4" />} title="Характер та звички">
            <CharacterTraitsField selected={details.character_traits} onChange={(t) => upd('character_traits', t)} />
          </EditorSection>

          {/* ═══ ФОТО ════════════════════════════════════════ */}
          <EditorSection id="photos" icon={<ImageIcon className="h-4 w-4" />} title="Фотографії">
            {canUsePhotos ? (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => uploadPhotos(e.target.files)}
                />

                {photos.length > 0 ? (
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
                      >
                        {photo.public_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo.public_url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
                        ) : null}
                        {photo.is_main ? (
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-white shadow">
                            <Star className="h-2.5 w-2.5 fill-current" /> Головне
                          </div>
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setMainPhoto(photo.id)}
                            disabled={isPending || photo.is_main}
                            title="Зробити головним"
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-lg border bg-white/95 shadow-sm transition',
                              photo.is_main ? 'border-amber-300 text-amber-500' : 'border-slate-200 text-slate-500 hover:text-amber-500'
                            )}
                          >
                            <Star className={cn('h-3 w-3', photo.is_main && 'fill-current')} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePhoto(photo.id)}
                            disabled={isPending}
                            title="Видалити"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-rose-500 shadow-sm transition hover:bg-rose-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add more tile */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300 transition hover:border-slate-300 hover:bg-white hover:text-slate-400"
                    >
                      {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-slate-400 transition hover:border-primary/30 hover:bg-orange-50/30 hover:text-primary"
                  >
                    <ImagePlus className="h-9 w-9" />
                    <div className="text-center">
                      <p className="text-sm font-bold">Натисни або перетягни фото сюди</p>
                      <p className="mt-0.5 text-xs">JPEG, PNG, WebP — декілька файлів одночасно</p>
                    </div>
                  </button>
                )}

                {isUploading ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Завантаження фото...
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-600">Фото доступні після збереження</p>
                  <p className="mx-auto mt-1 max-w-xs text-xs text-slate-400">
                    Зображення додаються лише коли тварина збережена в базі даних.
                  </p>
                </div>
                {!detailsComplete ? (
                  <p className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Заповни вік, короткий та повний опис
                  </p>
                ) : !detailsSaved ? (
                  <p className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Натисни «Зберегти» щоб розблокувати
                  </p>
                ) : null}
              </div>
            )}
          </EditorSection>

          {/* Bottom spacer */}
          <div className="h-16" />
        </main>
      </div>
    </div>
  )
}

// ─── EditorSection ────────────────────────────────────────────────────────────

function EditorSection({
  id,
  icon,
  title,
  required,
  children,
}: {
  id: string
  icon: React.ReactNode
  title: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-50 text-primary">{icon}</span>
        <h2 className="text-sm font-extrabold text-slate-900">
          {title}
          {required ? <span className="ml-1 text-rose-400">*</span> : null}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

// ─── FL (Field Label) ─────────────────────────────────────────────────────────

function FL({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold text-slate-600">{label}</span>
      {children}
    </label>
  )
}

// Hint shown BELOW the field
function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[11px] text-slate-400">{children}</p>
}

// Sidebar data preview row
function PreviewRow({ label, value, dot }: { label: string; value: string; dot?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-[11px] text-slate-400">{label}</span>
      <span className="flex min-w-0 items-center gap-1 text-[11px] font-semibold text-slate-700">
        {dot ? <span className="h-2 w-2 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: dot }} /> : null}
        <span className="truncate">{value}</span>
      </span>
    </div>
  )
}

// ─── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.value}
            onClick={() => onChange(active ? '' : opt.value)}
            className={cn(
              'flex h-7 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold transition',
              active
                ? 'border-primary bg-orange-50 text-primary ring-1 ring-primary/20'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            <span className="h-3 w-3 shrink-0 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: opt.hex }} />
            {opt.value}
            {active ? <Check className="h-2.5 w-2.5" /> : null}
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
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
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                'h-7 w-7 rounded-lg border text-xs font-extrabold transition',
                count === n ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40'
              )}
            >
              {n}
            </button>
          ))}
          <input
            type="number"
            min={1}
            max={20}
            placeholder="7+"
            value={count > 6 ? count : ''}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10)
              if (Number.isFinite(n) && n >= 1 && n <= 20) onChange(n)
            }}
            className="h-7 w-12 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-primary"
          />
        </div>
      ) : null}
    </div>
  )
}

// ─── Neuter ───────────────────────────────────────────────────────────────────

function NeuterField({ gender, checked, onChange }: { gender: AnimalDetails['gender']; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <p className="text-xs font-extrabold text-slate-700">{gender === 'female' ? 'Стерилізація' : 'Кастрація'}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">{checked ? 'Проведена' : 'Не проведена'}</p>
      </div>
      <Toggle active={checked} onToggle={() => onChange(!checked)} />
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', active ? 'bg-primary' : 'bg-slate-200')}
    >
      <span
        className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', active && 'translate-x-5')}
      />
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
      <div className="flex flex-wrap gap-1.5">
        {CHARACTER_TRAITS.map((trait) => {
          const active = selected.includes(trait)
          const disabled = !active && selected.length >= 5
          return (
            <button
              key={trait}
              type="button"
              disabled={disabled}
              onClick={() => toggle(trait)}
              className={cn(
                'flex h-7 items-center gap-1 rounded-full border px-3 text-xs font-semibold transition',
                active
                  ? 'border-primary bg-orange-50 text-primary'
                  : disabled
                    ? 'cursor-not-allowed border-slate-100 text-slate-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {active ? <Check className="h-2.5 w-2.5" /> : null}
              {trait}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        {selected.length > 0 ? `Обрано: ${selected.join(', ')}` : 'Оберіть до 5 рис характеру'}
      </p>
    </div>
  )
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function StatusPill({ status, className }: { status: AnimalRow['status']; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold',
        status === 'available' && 'bg-emerald-50 text-emerald-700',
        status === 'reserved' && 'bg-amber-50 text-amber-700',
        (status === 'adopted' || status === 'hidden') && 'bg-rose-50 text-rose-700',
        status === 'draft' && 'bg-slate-100 text-slate-600',
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateDisplay(value: string) {
  if (!value) return ''
  const [date, time] = value.split('T')
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}${time ? `, ${time}` : ''}`
}

function getTodayDatetimeLocal() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function isAnimalDetailsComplete(d: AnimalDetails) {
  return Boolean(d.approximate_age_label.trim() && d.short_description.trim() && d.full_story.trim())
}

function getStatusLabel(status: AnimalRow['status']) {
  const labels: Record<AnimalRow['status'], string> = {
    draft: 'Чернетка', available: 'Опублікована', reserved: 'Резерв', adopted: 'Прилаштована', hidden: 'Прихована',
  }
  return labels[status]
}


function getAnimalDetails(a?: AnimalRow): AnimalDetails {
  return {
    name: a?.name ?? '',
    gender: a?.gender ?? 'male',
    size: a?.size ?? 'medium',
    status: a?.status ?? 'draft',
    short_description: a?.short_description ?? '',
    full_story: a?.full_story ?? '',
    approximate_age_label: a?.approximate_age_label ?? '',
    adoption_status: a?.adoption_status ?? '',
    is_vaccinated: Boolean(a?.is_vaccinated),
    is_neutered: Boolean(a?.is_neutered),
    published_at: toDatetimeLocal(a?.published_at) || getTodayDatetimeLocal(),
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
  fd.set('adoption_status', d.adoption_status ?? '')
  fd.set('is_vaccinated', d.is_vaccinated ? 'on' : 'off')
  fd.set('is_neutered', d.is_neutered ? 'on' : 'off')
  fd.set('published_at', d.published_at)
  fd.set('animal_number', d.animal_number)
  fd.set('color', d.color)
  fd.set('vaccination_count', String(d.vaccination_count))
  d.character_traits.forEach((t) => fd.append('character_traits', t))
  return fd
}
