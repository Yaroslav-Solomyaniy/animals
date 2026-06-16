'use client'

import {useEffect, useMemo, useState} from 'react'
import {
    type AnimalCareFilter,
    type AnimalGenderFilter,
    type AnimalSizeFilter,
    type AnimalSort,
} from '@/lib/animal-filter-parsers'
import dynamic from "next/dynamic";
import type {StylesConfig, SingleValue} from "react-select";
import {ListFilter, Search, SlidersHorizontal, X} from 'lucide-react'
import {useAnimalUrlFilters} from "@/hooks/useAnimalUrlFilters";
import {Button} from "@/components/ui/Button";
import {Input} from "@/components/ui/FormControls";
import {buildSelectStyles} from "@/lib/selectStyles";

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

const sortOptions: SelectOption<AnimalSort>[] = [
    { label: 'Нещодавно додані', value: 'newest' },
    { label: 'Давно додані', value: 'oldest' },
    { label: 'Сортування від А до Я', value: 'name_asc' },
    { label: 'Сортування від Я до А', value: 'name_desc' },
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

    const {filters, updateFilter, resetFilters} = useAnimalUrlFilters()

    const [nameQuery, setNameQuery] = useState(filters.q)

    useEffect(() => {
        setNameQuery(filters.q)
    }, [filters.q])

    useEffect(() => {
        if (nameQuery === filters.q) {return}

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

    const selectedGender =
        genderOptions.find((option) => option.value === filters.gender) ??
        genderOptions[0]

    const selectedSize =
        sizeOptions.find((option) => option.value === filters.size) ??
        sizeOptions[0]

    const selectedCare =
        careOptions.find((option) => option.value === filters.care) ??
        careOptions[0]

    const selectedSort =
        sortOptions.find((option) => option.value === filters.sort) ?? sortOptions[0]

    function updateGenderSelect(option: SingleValue<SelectOption<AnimalGenderFilter>>) {
        if (!option) {return}
        updateFilter('gender', option.value)
    }

    function updateSizeSelect(option: SingleValue<SelectOption<AnimalSizeFilter>>) {
        if (!option) {return}
        updateFilter('size', option.value)
    }

    function updateCareSelect(option: SingleValue<SelectOption<AnimalCareFilter>>) {
        if (!option) {return}
        updateFilter('care', option.value)
    }

    function updateSortSelect(option: SingleValue<SelectOption<AnimalSort>>) {
        if (!option) {return}
        updateFilter('sort', option.value)
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
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-text-main">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Фільтри
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        showIcon={false}
                        onClick={handleResetAll}
                        className="h-9"
                    >
                        <X className="h-4 w-4" />
                        Скинути всі
                    </Button>
                )}
            </div>

            <Field label="Пошук за іменем" htmlFor="animal-name-input">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        id="animal-name-input"
                        type="search"
                        placeholder="Наприклад, Рекс або Мурка"
                        value={nameQuery}
                        onChange={(event) => setNameQuery(event.target.value)}
                        className="h-14 pl-12 text-base"
                    />
                </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    />
                </Field>
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
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
            )}
        </div>
    )
}

function Field({label, htmlFor, children}: { label: string; htmlFor: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {label}
            </label>
            {children}
        </div>
    )
}
