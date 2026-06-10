import Link from 'next/link'
import {
  CheckCircle2,
  CircleOff,
  ImageOff,
  Images,
  Search,
} from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AnimalCreateModal from '@/components/admin/AnimalCreateModal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  hasAdminAnimalFilters,
  type AdminAnimalCardData,
  type AdminAnimalFilters,
  type AdminAnimalGenderFilter,
  type AdminAnimalPhotoFilter,
  type AdminAnimalSizeFilter,
  type AdminAnimalSort,
  type AdminAnimalStatusFilter,
} from '@/lib/admin-animals'
import type { AnimalRow } from '@/lib/admin-types'

type Props = {
  animals: AdminAnimalCardData[]
  totalCount: number
  animalError: string | null
  photosError: string | null
  filters: AdminAnimalFilters
}

const statusOptions: Array<{ value: AdminAnimalStatusFilter; label: string }> = [
  { value: 'all', label: 'Усі статуси' },
  { value: 'draft', label: 'Чернетки' },
  { value: 'available', label: 'Доступні' },
  { value: 'reserved', label: 'Резерв' },
  { value: 'adopted', label: 'Прилаштовані' },
  { value: 'hidden', label: 'Приховані' },
]

const genderOptions: Array<{ value: AdminAnimalGenderFilter; label: string }> = [
  { value: 'all', label: 'Будь-яка стать' },
  { value: 'male', label: 'Хлопчики' },
  { value: 'female', label: 'Дівчатка' },
]

const sizeOptions: Array<{ value: AdminAnimalSizeFilter; label: string }> = [
  { value: 'all', label: 'Будь-який розмір' },
  { value: 'small', label: 'Малі' },
  { value: 'medium', label: 'Середні' },
  { value: 'large', label: 'Великі' },
]

const photoOptions: Array<{ value: AdminAnimalPhotoFilter; label: string }> = [
  { value: 'all', label: 'Усі фото' },
  { value: 'with-main', label: 'Є головне фото' },
  { value: 'without-main', label: 'Без головного фото' },
]

const sortOptions: Array<{ value: AdminAnimalSort; label: string }> = [
  { value: 'updated', label: 'Останні зміни' },
  { value: 'published', label: 'Дата публікації' },
  { value: 'name', label: 'Імʼя' },
]

export default function AdminAnimalsClient({animals,
  totalCount,
  animalError,
  photosError,
  filters,}: Props) {
  const hasFilters = hasAdminAnimalFilters(filters)

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Тварини"
        title="Каталог тварин"
        description="Керуйте інформацією про тварин, переглядайте статуси, редагуйте дані та використовуйте серверні фільтри для швидкого пошуку потрібних записів."
        actions={<AnimalCreateModal />}
      />

      <div className="space-y-4">
        {animalError ? <AdminNotice>{animalError}</AdminNotice> : null}
        {photosError ? <AdminNotice>{photosError}</AdminNotice> : null}
      </div>

      <form
        action="/admin/animals"
        className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.8fr))]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="Пошук за імʼям, slug або описом"
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <FilterSelect name="status" value={filters.status} options={statusOptions} />
          <FilterSelect name="gender" value={filters.gender} options={genderOptions} />
          <FilterSelect name="size" value={filters.size} options={sizeOptions} />
          <FilterSelect name="photo" value={filters.photo} options={photoOptions} />
          <FilterSelect name="sort" value={filters.sort} options={sortOptions} />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-500">
            Знайдено {totalCount} записів
          </p>

          <div className="flex flex-wrap gap-2">
            {hasFilters ? (
              <Link
                href="/admin/animals"
                className="inline-flex h-9 items-center justify-center rounded-md border border-primary/45 px-3.5 text-sm font-extrabold text-primary transition hover:bg-orange-50"
              >
                Скинути
              </Link>
            ) : null}
            <Button type="submit" size="sm">
              Застосувати
            </Button>
          </div>
        </div>
      </form>

      {animals.length ? (
        <section className="mt-6 grid gap-4">
          {animals.map((animal) => (
            <AdminAnimalCard key={animal.id} animal={animal} />
          ))}
        </section>
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
    <article className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] md:grid-cols-[180px_minmax(0,1fr)_auto]">
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
          <Meta label="Вік" value={animal.approximate_age_label || 'Не вказано'} />
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

      <div className="flex flex-wrap items-start gap-2 md:flex-col md:items-stretch">
        <AnimalCreateModal initialAnimal={animal} initialPhotos={animal.photos} initialStep="details" triggerLabel="Дані" />
        <AnimalCreateModal initialAnimal={animal} initialPhotos={animal.photos} initialStep="photos" triggerLabel="Фото" triggerDisabled={!detailsComplete} />
        <AnimalCreateModal initialAnimal={animal} initialPhotos={animal.photos} initialStep="publish" triggerLabel="Публікація" triggerDisabled={!detailsComplete || !hasMainPhoto} />
      </div>
    </article>
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
