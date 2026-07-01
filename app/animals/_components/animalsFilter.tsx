'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type AnimalAgeFilter,
  type AnimalCareFilter,
  type AnimalColorFilter,
  type AnimalGenderFilter,
  type AnimalNeuterFilter,
  type AnimalSizeFilter,
  type AnimalSort,
  type AnimalVaccinationFilter,
} from '@/lib/animal-filter-parsers'
import dynamic from 'next/dynamic'
import type { SingleValue, StylesConfig } from 'react-select'
import { ChevronDown, ListFilter, Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useAnimalUrlFilters } from '@/hooks/useAnimalUrlFilters'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { buildSelectStyles } from '@/lib/selectStyles'

type SelectOption<T extends string> = {
  label: string
  value: T
}

const SELECT_HEIGHT = '3rem' // 48px — matches the h-12 selects below the search field

const genderOptions: SelectOption<AnimalGenderFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Самці', value: 'male' },
  { label: 'Самки', value: 'female' },
]

const sizeOptions: SelectOption<AnimalSizeFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Малий', value: 'small' },
  { label: 'Середній', value: 'medium' },
  { label: 'Великий', value: 'large' },
]

const careOptions: SelectOption<AnimalCareFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Готові до дому', value: 'ready' },
  { label: 'Потребують турботи', value: 'needs_care' },
]

const colorOptions: SelectOption<AnimalColorFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Чорний', value: 'Чорний' },
  { label: 'Білий', value: 'Білий' },
  { label: 'Сірий', value: 'Сірий' },
  { label: 'Рудий', value: 'Рудий' },
  { label: 'Коричневий', value: 'Коричневий' },
  { label: 'Палевий', value: 'Палевий' },
  { label: 'Кремовий', value: 'Кремовий' },
  { label: 'Тигровий', value: 'Тигровий' },
  { label: 'Плямистий', value: 'Плямистий' },
  { label: 'Чорно-білий', value: 'Чорно-білий' },
  { label: 'Рудо-білий', value: 'Рудо-білий' },
  { label: 'Сіро-білий', value: 'Сіро-білий' },
  { label: 'Трьохколірний', value: 'Трьохколірний' },
]

const ageOptions: SelectOption<AnimalAgeFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'До 1 року', value: 'under1' },
  { label: 'Від 1 до 2 років', value: '1to2' },
  { label: 'Від 2 до 3 років', value: '2to3' },
  { label: 'Від 3 до 4 років', value: '3to4' },
  { label: 'Більше 5 років', value: 'over5' },
]

const sortOptions: SelectOption<AnimalSort>[] = [
  { label: 'Нещодавно додані', value: 'newest' },
  { label: 'Давно додані', value: 'oldest' },
  { label: 'Сортування від А до Я', value: 'name_asc' },
  { label: 'Сортування від Я до А', value: 'name_desc' },
]

const vaccinationOptions: SelectOption<AnimalVaccinationFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Вакциновані', value: 'yes' },
  { label: 'Не вакциновані', value: 'no' },
]

const neuterOptions: SelectOption<AnimalNeuterFilter>[] = [
  { label: 'Усі', value: 'all' },
  { label: 'Присутня', value: 'yes' },
  { label: 'Відсутня', value: 'no' },
]

const Select = dynamic(() => import('react-select'), {
  ssr: false,
}) as typeof import('react-select').default

function withSelectHeight<Option>(isActive: boolean): StylesConfig<Option> {
  const base = buildSelectStyles<Option>(isActive)

  return {
    ...base,
    control: (styles, state) => ({
      ...base.control?.(styles, state),
      minHeight: SELECT_HEIGHT,
    }),
    valueContainer: (styles) => ({
      ...styles,
      height: SELECT_HEIGHT,
      padding: '0 0.875rem',
    }),
    input: (styles) => ({ ...styles, margin: 0, padding: 0 }),
    indicatorsContainer: (styles) => ({ ...styles, height: SELECT_HEIGHT }),
  }
}

export default function AnimalsFilter() {
  const { filters, updateFilter, resetFilters } = useAnimalUrlFilters()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [measuredHeight, setMeasuredHeight] = useState(0)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = filtersRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setMeasuredHeight(el.scrollHeight)
    })
    ro.observe(el)
    setMeasuredHeight(el.scrollHeight)
    return () => ro.disconnect()
  }, [])
  const [nameQuery, setNameQuery] = useState(filters.q)

  useEffect(() => {
    setNameQuery(filters.q)
  }, [filters.q])

  useEffect(() => {
    if (nameQuery === filters.q) {
      return
    }

    const timeout = setTimeout(() => {
      updateFilter('q', nameQuery)
    }, 400)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameQuery])

  const genderSelectStyles = withSelectHeight<SelectOption<AnimalGenderFilter>>(filters.gender !== 'all')
  const sizeSelectStyles = withSelectHeight<SelectOption<AnimalSizeFilter>>(filters.size !== 'all')
  const careSelectStyles = withSelectHeight<SelectOption<AnimalCareFilter>>(filters.care !== 'all')
  const sortSelectStyles = withSelectHeight<SelectOption<AnimalSort>>(filters.sort !== 'newest')
  const ageSelectStyles = withSelectHeight<SelectOption<AnimalAgeFilter>>(filters.age !== 'all')
  const colorSelectStyles = withSelectHeight<SelectOption<AnimalColorFilter>>(filters.color !== 'all')
  const vaccinationSelectStyles = withSelectHeight<SelectOption<AnimalVaccinationFilter>>(filters.vaccination !== 'all')
  const neuterSelectStyles = withSelectHeight<SelectOption<AnimalNeuterFilter>>(filters.neuter !== 'all')

  const selectedGender = genderOptions.find((option) => option.value === filters.gender) ?? genderOptions[0]

  const selectedSize = sizeOptions.find((option) => option.value === filters.size) ?? sizeOptions[0]

  const selectedCare = careOptions.find((option) => option.value === filters.care) ?? careOptions[0]

  const selectedSort = sortOptions.find((option) => option.value === filters.sort) ?? sortOptions[0]

  const selectedAge = ageOptions.find((option) => option.value === filters.age) ?? ageOptions[0]

  const selectedColor = colorOptions.find((option) => option.value === filters.color) ?? colorOptions[0]

  const selectedVaccination = vaccinationOptions.find((option) => option.value === filters.vaccination) ?? vaccinationOptions[0]

  const selectedNeuter = neuterOptions.find((option) => option.value === filters.neuter) ?? neuterOptions[0]

  function updateGenderSelect(option: SingleValue<SelectOption<AnimalGenderFilter>>) {
    if (!option) {
      return
    }
    updateFilter('gender', option.value)
  }

  function updateSizeSelect(option: SingleValue<SelectOption<AnimalSizeFilter>>) {
    if (!option) {
      return
    }
    updateFilter('size', option.value)
  }

  function updateCareSelect(option: SingleValue<SelectOption<AnimalCareFilter>>) {
    if (!option) {
      return
    }
    updateFilter('care', option.value)
  }

  function updateSortSelect(option: SingleValue<SelectOption<AnimalSort>>) {
    if (!option) {
      return
    }
    updateFilter('sort', option.value)
  }

  function updateAgeSelect(option: SingleValue<SelectOption<AnimalAgeFilter>>) {
    if (!option) {
      return
    }
    updateFilter('age', option.value)
  }

  function updateColorSelect(option: SingleValue<SelectOption<AnimalColorFilter>>) {
    if (!option) {
      return
    }
    updateFilter('color', option.value)
  }

  function updateVaccinationSelect(option: SingleValue<SelectOption<AnimalVaccinationFilter>>) {
    if (!option) {
      return
    }
    updateFilter('vaccination', option.value)
  }

  function updateNeuterSelect(option: SingleValue<SelectOption<AnimalNeuterFilter>>) {
    if (!option) {
      return
    }
    updateFilter('neuter', option.value)
  }

  const activeFilters = useMemo(() => {
    const active: { key: string; label: string; onRemove: () => void }[] = []

    if (filters.q.trim()) {
      active.push({
        key: 'q',
        label: `Імʼя: «${filters.q.trim()}»`,
        onRemove: () => {
          setNameQuery('')
          updateFilter('q', '')
        },
      })
    }

    if (filters.gender !== 'all') {
      active.push({
        key: 'gender',
        label: `Стать: ${genderOptions.find((o) => o.value === filters.gender)?.label}`,
        onRemove: () => updateFilter('gender', 'all'),
      })
    }

    if (filters.size !== 'all') {
      active.push({
        key: 'size',
        label: `Розмір: ${sizeOptions.find((o) => o.value === filters.size)?.label}`,
        onRemove: () => updateFilter('size', 'all'),
      })
    }

    if (filters.care !== 'all') {
      active.push({
        key: 'care',
        label: `Готовність: ${careOptions.find((o) => o.value === filters.care)?.label}`,
        onRemove: () => updateFilter('care', 'all'),
      })
    }

    if (filters.age !== 'all') {
      active.push({
        key: 'age',
        label: `Вік: ${ageOptions.find((o) => o.value === filters.age)?.label}`,
        onRemove: () => updateFilter('age', 'all'),
      })
    }

    if (filters.color !== 'all') {
      active.push({
        key: 'color',
        label: `Колір: ${filters.color}`,
        onRemove: () => updateFilter('color', 'all'),
      })
    }

    if (filters.vaccination !== 'all') {
      active.push({
        key: 'vaccination',
        label: `Вакцинація: ${vaccinationOptions.find((o) => o.value === filters.vaccination)?.label ?? ''}`,
        onRemove: () => updateFilter('vaccination', 'all'),
      })
    }

    if (filters.neuter !== 'all') {
      active.push({
        key: 'neuter',
        label: `Кастрація/стерилізація: ${neuterOptions.find((o) => o.value === filters.neuter)?.label ?? ''}`,
        onRemove: () => updateFilter('neuter', 'all'),
      })
    }

    if (filters.sort !== 'newest') {
      active.push({
        key: 'sort',
        label: sortOptions.find((o) => o.value === filters.sort)?.label ?? '',
        onRemove: () => updateFilter('sort', 'newest'),
      })
    }

    return active
  }, [filters, updateFilter])

  const hasActiveFilters = activeFilters.length > 0

  function handleResetAll() {
    setNameQuery('')
    resetFilters()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="animal-name-input"
            type="search"
            placeholder="Пошук за іменем"
            value={nameQuery}
            onChange={(event) => setNameQuery(event.target.value)}
            className="h-14 pl-12 text-base shadow-none"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          showIcon={false}
          onClick={() => {
            if (filtersOpen) {
              setContentVisible(false)
              setTimeout(() => setFiltersOpen(false), 200)
            } else {
              setFiltersOpen(true)
            }
          }}
          className="h-14 w-full shrink-0 gap-2 rounded-xl px-4 text-sm font-bold sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {filtersOpen ? 'Сховати фільтри' : 'Показати фільтри'}
          {!filtersOpen && hasActiveFilters && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-black tabular-nums text-white">
              {activeFilters.length}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <motion.div
        animate={{ height: filtersOpen ? measuredHeight : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationComplete={() => {
          if (filtersOpen) setContentVisible(true)
        }}
        onUpdate={({ height }) => {
          if (!filtersOpen && Number(height) === 0) setContentVisible(false)
        }}
        initial={false}
        style={{ overflow: 'hidden' }}
      >
        <motion.div ref={filtersRef} animate={{ opacity: contentVisible ? 1 : 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
          <div className="grid gap-4 pt-1 pb-1 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Стать" htmlFor="animal-gender-select-input">
              <Select<SelectOption<AnimalGenderFilter>, false>
                instanceId="animal-gender-select"
                inputId="animal-gender-select-input"
                value={selectedGender}
                onChange={updateGenderSelect}
                options={genderOptions}
                isSearchable={false}
                placeholder="Оберіть стать"
                styles={genderSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Розмір" htmlFor="animal-size-select-input">
              <Select<SelectOption<AnimalSizeFilter>, false>
                instanceId="animal-size-select"
                inputId="animal-size-select-input"
                value={selectedSize}
                onChange={updateSizeSelect}
                options={sizeOptions}
                isSearchable={false}
                placeholder="Оберіть розмір"
                styles={sizeSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Готовність" htmlFor="animal-care-select-input">
              <Select<SelectOption<AnimalCareFilter>, false>
                instanceId="animal-care-select"
                inputId="animal-care-select-input"
                value={selectedCare}
                onChange={updateCareSelect}
                options={careOptions}
                isSearchable={false}
                placeholder="Оберіть готовність"
                styles={careSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Вік" htmlFor="animal-age-select-input">
              <Select<SelectOption<AnimalAgeFilter>, false>
                instanceId="animal-age-select"
                inputId="animal-age-select-input"
                value={selectedAge}
                onChange={updateAgeSelect}
                options={ageOptions}
                isSearchable={false}
                placeholder="Оберіть вік"
                styles={ageSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Забарвлення" htmlFor="animal-color-select-input">
              <Select<SelectOption<AnimalColorFilter>, false>
                instanceId="animal-color-select"
                inputId="animal-color-select-input"
                value={selectedColor}
                onChange={updateColorSelect}
                options={colorOptions}
                isSearchable={false}
                placeholder="Оберіть колір"
                styles={colorSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Вакцинація" htmlFor="animal-vaccination-select-input">
              <Select<SelectOption<AnimalVaccinationFilter>, false>
                instanceId="animal-vaccination-select"
                inputId="animal-vaccination-select-input"
                value={selectedVaccination}
                onChange={updateVaccinationSelect}
                options={vaccinationOptions}
                isSearchable={false}
                placeholder="Вакцинація"
                styles={vaccinationSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Кастрація / Стерилізація" htmlFor="animal-neuter-select-input">
              <Select<SelectOption<AnimalNeuterFilter>, false>
                instanceId="animal-neuter-select"
                inputId="animal-neuter-select-input"
                value={selectedNeuter}
                onChange={updateNeuterSelect}
                options={neuterOptions}
                isSearchable={false}
                placeholder="Кастрація"
                styles={neuterSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>

            <Field label="Сортування" htmlFor="animal-sort-select-input">
              <Select<SelectOption<AnimalSort>, false>
                instanceId="animal-sort-select"
                inputId="animal-sort-select-input"
                value={selectedSort}
                onChange={updateSortSelect}
                options={sortOptions}
                isSearchable={false}
                placeholder="Сортування"
                styles={sortSelectStyles}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
            </Field>
          </div>
        </motion.div>
      </motion.div>

      {hasActiveFilters && (
        <div className="flex items-start justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <ListFilter className="h-3.5 w-3.5" />
              Активні фільтри:
            </span>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-orange-50 px-3 py-1.5 text-xs font-bold text-primary transition hover:border-primary hover:bg-orange-100"
              >
                {filter.label}
                <X className="h-3.5 w-3.5 text-primary/60 transition group-hover:text-primary" />
              </button>
            ))}
          </div>
          <Button type="button" variant="ghost" size="sm" showIcon={false} onClick={handleResetAll} className="shrink-0 whitespace-nowrap rounded-xl">
            <X className="h-4 w-4" />
            Скинути всі
          </Button>
        </div>
      )}
    </div>
  )
}

function Field({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}
