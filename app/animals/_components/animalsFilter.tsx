'use client'

import {
    type AnimalCareFilter,
    type AnimalGenderFilter,
    type AnimalSizeFilter,
    type AnimalSortOrder,
} from '@/lib/animal-filter-parsers'
import dynamic from "next/dynamic";
import {SingleValue} from "react-select";
import {useAnimalUrlFilters} from "@/hooks/useAnimalUrlFilters";
import {Button} from "@/components/ui/Button";

type SelectOption<T extends string> = {
    label: string
    value: T
}

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

const sortOrderOptions: SelectOption<AnimalSortOrder>[] = [
    { label: 'А-Я', value: 'asc' },
    { label: 'Я-А', value: 'desc' },
]

const Select = dynamic(() => import('react-select'), {
    ssr: false,
}) as typeof import('react-select').default

export default function AnimalsFilter() {

    const {filters, updateFilter, resetFilters} = useAnimalUrlFilters()

    const selectedGender =
        genderOptions.find((option) => option.value === filters.gender) ??
        genderOptions[0]

    const selectedSize =
        sizeOptions.find((option) => option.value === filters.size) ??
        sizeOptions[0]

    const selectedCare =
        careOptions.find((option) => option.value === filters.care) ??
        careOptions[0]

    const selectedSortOrder =
        sortOrderOptions.find((option) => option.value === filters.order) ??
        sortOrderOptions[0]

    function updateGenderSelect(option: SingleValue<SelectOption<AnimalGenderFilter>>) {
        if (!option) return
        updateFilter('gender', option.value)
    }

    function updateSizeSelect(option: SingleValue<SelectOption<AnimalSizeFilter>>) {
        if (!option) return
        updateFilter('size', option.value)
    }

    function updateCareSelect(option: SingleValue<SelectOption<AnimalCareFilter>>) {
        if (!option) return
        updateFilter('care', option.value)
    }

    function updateSortOrderSelect(option: SingleValue<SelectOption<AnimalSortOrder>>) {
        if (!option) return
        updateFilter('order', option.value)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Select<SelectOption<AnimalGenderFilter>, false>
                instanceId="animal-gender-select"
                inputId="animal-gender-select-input"
                value={selectedGender}
                onChange={updateGenderSelect}
                options={genderOptions}
                isSearchable={false}
                placeholder="Оберіть стать"
            />

            <Select<SelectOption<AnimalSizeFilter>, false>
                instanceId="animal-size-select"
                inputId="animal-size-select-input"
                value={selectedSize}
                onChange={updateSizeSelect}
                options={sizeOptions}
                isSearchable={false}
                placeholder="Оберіть розмір"
            />

            <Select<SelectOption<AnimalCareFilter>, false>
                instanceId="animal-care-select"
                inputId="animal-care-select-input"
                value={selectedCare}
                onChange={updateCareSelect}
                options={careOptions}
                isSearchable={false}
                placeholder="Оберіть готовність"
            />

            <Select<SelectOption<AnimalSortOrder>, false>
                instanceId="animal-sort-order-select"
                inputId="animal-sort-order-select-input"
                value={selectedSortOrder}
                onChange={updateSortOrderSelect}
                options={sortOrderOptions}
                isSearchable={false}
                placeholder="Порядок"
            />

            <Button
                type={'reset'}
                onClick={resetFilters}
            >
                Скинути фільтри
            </Button>
        </div>
    )
}