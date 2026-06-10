'use client'

import {
    type AnimalCareFilter,
    type AnimalGenderFilter,
    type AnimalSizeFilter,
    type AnimalSort,
} from '@/lib/animal-filter-parsers'
import dynamic from "next/dynamic";
import {SingleValue} from "react-select";
import {useAnimalUrlFilters} from "@/hooks/useAnimalUrlFilters";
import {Button, LinkButton} from "@/components/ui/Button";
import {buildSelectStyles} from "@/lib/selectStyles";

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

const sortOptions: SelectOption<AnimalSort>[] = [
    { label: 'Нещодавно додані', value: 'newest' },
    { label: 'Давно додані', value: 'oldest' },
    { label: 'Сортування від А до Я', value: 'name_asc' },
    { label: 'Сортування від Я до А', value: 'name_desc' },
]

const Select = dynamic(() => import('react-select'), {
    ssr: false,
}) as typeof import('react-select').default


export default function AnimalsFilter() {

    const {filters, updateFilter, resetFilters} = useAnimalUrlFilters()

    const genderSelectStyles = buildSelectStyles<SelectOption<AnimalGenderFilter>>(filters.gender !== 'all')
    const sizeSelectStyles = buildSelectStyles<SelectOption<AnimalSizeFilter>>(filters.size !== 'all')
    const careSelectStyles = buildSelectStyles<SelectOption<AnimalCareFilter>>(filters.care !== 'all')
    const sortSelectStyles = buildSelectStyles<SelectOption<AnimalSort>>(filters.sort !== 'newest')

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


    function updateSortSelect(option: SingleValue<SelectOption<AnimalSort>>) {
        if (!option) return
        updateFilter('sort', option.value)
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
                styles={genderSelectStyles}
            />

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

            {/*<Select<SelectOption<AnimalSortOrder>, false>*/}
            {/*    instanceId="animal-sort-order-select"*/}
            {/*    inputId="animal-sort-order-select-input"*/}
            {/*    value={selectedSortOrder}*/}
            {/*    onChange={updateSortOrderSelect}*/}
            {/*    options={sortOrderOptions}*/}
            {/*    isSearchable={false}*/}
            {/*    placeholder="Порядок"*/}
            {/*/>*/}

            <Button
                type={'reset'}
                onClick={resetFilters}
            >
                Скинути фільтри
            </Button>
        </div>
    )
}