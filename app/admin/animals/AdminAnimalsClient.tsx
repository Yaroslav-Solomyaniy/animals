import Link from 'next/link'
import AdminAnimalsFilters from '@/app/admin/animals/AdminAnimalsFilters'
import { DeleteAnimalButton } from '@/components/admin/DeleteAnimalButton'
import {
  CheckCircle2,
  CircleOff,
  ImageOff,
  Images,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { LinkButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { formatAge } from '@/lib/formatAge'
import {
  type AdminAnimalCardData,
} from '@/lib/admin-animals'
import type { AnimalRow } from '@/lib/admin-types'

type Props = {
  animals: AdminAnimalCardData[]
  totalCount: number
  currentPage: number
  totalPages: number
  animalError: string | null
  photosError: string | null
}

export default function AdminAnimalsClient({animals,
  totalCount,
  currentPage,
  totalPages,
  animalError,
  photosError,}: Props) {
  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Тварини"
        title="Каталог тварин"
        description="Керуйте інформацією про тварин, переглядайте статуси, редагуйте дані та використовуйте серверні фільтри для швидкого пошуку потрібних записів."
        actions={
          <LinkButton href="/admin/animals/new" size="sm" showIcon={false}>
            <Plus className="h-4 w-4" />
            Додати тварину
          </LinkButton>
        }
      />

      <div className="space-y-4">
        {animalError ? <AdminNotice>{animalError}</AdminNotice> : null}
        {photosError ? <AdminNotice>{photosError}</AdminNotice> : null}
      </div>

      <AdminAnimalsFilters totalCount={totalCount} />

      {animals.length ? (
        <>
          <section className="mt-6 grid gap-4">
            {animals.map((animal) => (
              <AdminAnimalCard key={animal.id} animal={animal} />
            ))}
          </section>
          <AdminPagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.04)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-primary">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-950">Нічого не знайдено</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Змініть параметри фільтра і застосуйте пошук ще раз.
          </p>
        </section>
      )}
    </AdminAuthGate>
  )
}

function AdminAnimalCard({ animal }: { animal: AdminAnimalCardData }) {
  const mainPhoto = getMainPhoto(animal)
  const hasMainPhoto = animal.photos.some((photo) => photo.is_main)
  const detailsComplete = isAdminAnimalDetailsComplete(animal)

  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <DeleteAnimalButton id={animal.id} name={animal.name} />
      </div>
    <Link
      href={`/admin/animals/${animal.id}`}
      className="group grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-primary/30 hover:shadow-[0_12px_35px_rgba(242,116,56,0.08)] md:grid-cols-[180px_minmax(0,1fr)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 md:aspect-auto md:h-full">
        {mainPhoto?.public_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mainPhoto.public_url} alt={mainPhoto.alt ?? animal.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-36 flex-col items-center justify-center gap-2 text-slate-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs font-bold">Без фото</span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={animal.status} />
        </div>

        <h2 className="mt-3 truncate text-2xl font-extrabold text-slate-950">{animal.name}</h2>
        <p className="mt-1 truncate text-xs font-bold text-slate-400">{animal.slug}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          {animal.short_description || 'Короткий опис ще не додано.'}
        </p>

        <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
          <Meta label="Стать" value={getGenderLabel(animal.gender)} />
          <Meta label="Розмір" value={getSizeLabel(animal.size)} />
          <Meta label="Вік" value={formatAge(animal.approximate_age_label, 'Не вказано')} />
          <Meta label="Оновлено" value={formatDate(animal.updated_at)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <CareBadge active={Boolean(animal.is_vaccinated)}>Вакцинація</CareBadge>
          <CareBadge active={Boolean(animal.is_neutered)}>Стерилізація</CareBadge>
          {animal.adoption_status ? (
            <CareBadge active>{getAdoptionStatusLabel(animal.adoption_status)}</CareBadge>
          ) : null}
          <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
            <Images className="h-3.5 w-3.5" />
            {animal.photos.length} фото
          </span>
        </div>
      </div>

    </Link>
    </div>
  )
}

function FilterSelect({name,
  value,
  options,}: {
  name: string
  value: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function StatusBadge({ status }: { status: AnimalRow['status'] }) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-xs font-extrabold',
        status === 'available' && 'bg-emerald-50 text-emerald-700',
        status === 'reserved' && 'bg-amber-50 text-amber-700',
        (status === 'adopted' || status === 'hidden') && 'bg-rose-50 text-rose-700',
        status === 'draft' && 'bg-slate-100 text-slate-600'
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-extrabold uppercase text-slate-400">{label}</p>
      <p className="mt-1 truncate">{value}</p>
    </div>
  )
}

function CareBadge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold',
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
      )}
    >
      {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleOff className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}

function getMainPhoto(animal: AdminAnimalCardData) {
  return animal.photos.find((photo) => photo.is_main) ?? animal.photos[0] ?? null
}

function isAdminAnimalDetailsComplete(animal: AdminAnimalCardData) {
  return Boolean(
    animal.name?.trim() &&
    animal.approximate_age_label?.trim() &&
    animal.short_description?.trim() &&
    animal.full_story?.trim()
  )
}

function getStatusLabel(status: AnimalRow['status']) {
  const labels: Record<AnimalRow['status'], string> = {
    draft: 'Чернетка',
    available: 'Доступна',
    reserved: 'Резерв',
    adopted: 'Прилаштована',
    hidden: 'Прихована',
  }

  return labels[status]
}

function getGenderLabel(gender: AnimalRow['gender']) {
  return gender === 'male' ? 'Хлопчик' : 'Дівчинка'
}

function getSizeLabel(size: AnimalRow['size']) {
  const labels: Record<AnimalRow['size'], string> = {
    small: 'Малий',
    medium: 'Середній',
    large: 'Великий',
  }

  return labels[size]
}

function getAdoptionStatusLabel(status: NonNullable<AnimalRow['adoption_status']>) {
  return status === 'ready' ? 'Готовий до адопції' : 'Потребує турботи'
}

function AdminPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null

  function pageHref(page: number) {
    if (typeof window === 'undefined') return `?page=${page}`
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Link
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary',
          currentPage === 1 && 'pointer-events-none opacity-30'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-extrabold transition',
            page === currentPage
              ? 'border-primary bg-primary text-white shadow-[0_4px_14px_rgba(242,116,56,0.30)]'
              : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary'
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-primary/40 hover:text-primary',
          currentPage === totalPages && 'pointer-events-none opacity-30'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function formatDate(value: string | null) {
  if (!value) {return 'Не вказано'}
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
