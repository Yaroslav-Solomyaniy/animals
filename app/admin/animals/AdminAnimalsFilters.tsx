'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Select } from '@/components/ui/FormControls'
import { useAdminAnimalUrlFilters } from '@/hooks/useAdminAnimalUrlFilters'
import type {
  AdminAnimalStatusFilter,
  AdminAnimalGenderFilter,
  AdminAnimalSizeFilter,
  AdminAnimalPhotoFilter,
  AdminAnimalSort,
  AdminAnimalVaccinationFilter,
  AdminAnimalNeuterFilter,
  AdminAnimalAdoptionFilter,
  AdminAnimalColorFilter,
  AdminAnimalAgeFilter,
} from '@/lib/admin-animals-parsers'

const statusOptions: Array<{ value: AdminAnimalStatusFilter; label: string }> = [
  { value: 'all', label: 'Усі статуси' },
  { value: 'draft', label: 'Чернетки' },
  { value: 'available', label: 'Опубліковані' },
  { value: 'adopted', label: 'Прилаштовані' },
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
  { value: 'without-main', label: 'Без головного' },
]

const sortOptions: Array<{ value: AdminAnimalSort; label: string }> = [
  { value: 'updated', label: 'Останні зміни' },
  { value: 'published', label: 'Дата публікації' },
  { value: 'name', label: 'Імʼя' },
]

const vaccinationOptions: Array<{ value: AdminAnimalVaccinationFilter; label: string }> = [
  { value: 'all', label: 'Вакцинація: всі' },
  { value: 'yes', label: 'Вакциновані' },
  { value: 'no', label: 'Не вакциновані' },
]

const neuterOptions: Array<{ value: AdminAnimalNeuterFilter; label: string }> = [
  { value: 'all', label: 'Кастрація: всі' },
  { value: 'yes', label: 'Кастровані' },
  { value: 'no', label: 'Не кастровані' },
]

const adoptionOptions: Array<{ value: AdminAnimalAdoptionFilter; label: string }> = [
  { value: 'all', label: 'Бейдж: всі' },
  { value: 'ready', label: 'Готові до адопції' },
  { value: 'needs_care', label: 'Потребують турботи' },
  { value: 'none', label: 'Без бейджа' },
]

const colorOptions: Array<{ value: AdminAnimalColorFilter; label: string }> = [
  { value: 'all', label: 'Будь-який колір' },
  { value: 'Чорний', label: 'Чорний' },
  { value: 'Білий', label: 'Білий' },
  { value: 'Сірий', label: 'Сірий' },
  { value: 'Рудий', label: 'Рудий' },
  { value: 'Коричневий', label: 'Коричневий' },
  { value: 'Палевий', label: 'Палевий' },
  { value: 'Кремовий', label: 'Кремовий' },
  { value: 'Тигровий', label: 'Тигровий' },
  { value: 'Плямистий', label: 'Плямистий' },
  { value: 'Чорно-білий', label: 'Чорно-білий' },
  { value: 'Рудо-білий', label: 'Рудо-білий' },
  { value: 'Сіро-білий', label: 'Сіро-білий' },
  { value: 'Трьохколірний', label: 'Трьохколірний' },
]

const ageOptions: Array<{ value: AdminAnimalAgeFilter; label: string }> = [
  { value: 'all', label: 'Будь-який вік' },
  { value: 'under1', label: 'До 1 року' },
  { value: '1to2', label: 'Від 1 до 2 років' },
  { value: '2to3', label: 'Від 2 до 3 років' },
  { value: '3to4', label: 'Від 3 до 4 років' },
  { value: 'over5', label: 'Більше 5 років' },
]

export default function AdminAnimalsFilters({ totalCount }: { totalCount: number }) {
  const { filters, updateFilter, resetFilters, hasFilters } = useAdminAnimalUrlFilters()
  const [q, setQ] = useState(filters.q)

  useEffect(() => { setQ(filters.q) }, [filters.q])

  useEffect(() => {
    if (q === filters.q) return
    const t = setTimeout(() => updateFilter('q', q), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      {/* Row 1 */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.8fr))]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Пошук за імʼям, slug або описом"
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </label>
        <AdminSelect value={filters.status} options={statusOptions} onChange={(v) => updateFilter('status', v as AdminAnimalStatusFilter)} />
        <AdminSelect value={filters.gender} options={genderOptions} onChange={(v) => updateFilter('gender', v as AdminAnimalGenderFilter)} />
        <AdminSelect value={filters.size} options={sizeOptions} onChange={(v) => updateFilter('size', v as AdminAnimalSizeFilter)} />
        <AdminSelect value={filters.photo} options={photoOptions} onChange={(v) => updateFilter('photo', v as AdminAnimalPhotoFilter)} />
        <AdminSelect value={filters.sort} options={sortOptions} onChange={(v) => updateFilter('sort', v as AdminAnimalSort)} />
      </div>

      {/* Row 2 */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <AdminSelect value={filters.vaccination} options={vaccinationOptions} onChange={(v) => updateFilter('vaccination', v as AdminAnimalVaccinationFilter)} />
        <AdminSelect value={filters.neuter} options={neuterOptions} onChange={(v) => updateFilter('neuter', v as AdminAnimalNeuterFilter)} />
        <AdminSelect value={filters.adoption} options={adoptionOptions} onChange={(v) => updateFilter('adoption', v as AdminAnimalAdoptionFilter)} />
        <AdminSelect value={filters.color} options={colorOptions} onChange={(v) => updateFilter('color', v as AdminAnimalColorFilter)} />
        <AdminSelect value={filters.age} options={ageOptions} onChange={(v) => updateFilter('age', v as AdminAnimalAgeFilter)} />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">Знайдено {totalCount} записів</p>
        {hasFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3.5 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" />
            Скинути
          </button>
        ) : null}
      </div>
    </div>
  )
}

function AdminSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 py-0"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Select>
  )
}
