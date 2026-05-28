// lib/use-animal-url-filters.ts
'use client'

import {useQueryStates} from 'nuqs'
import {AnimalFilterParsers, type AnimalFilters, AnimalSort,} from '@/lib/animal-filter-parsers'

export function useAnimalUrlFilters() {
   const ITEMS_LIMIT = 1
    const [filters, setFilters] = useQueryStates(AnimalFilterParsers, {
        history: 'push',
        shallow: false,
    })

    function updateFilter<Key extends keyof AnimalFilters>(
        key: Key,
        value: AnimalFilters[Key],
        resetPage = true,
    ) {
        void setFilters({
            [key]: value,
            ...(resetPage ? { page: 1 } : {}),
        } as Partial<AnimalFilters>)
    }

    function updateSort(value: AnimalSort) {
        void setFilters({
            sort: value,
            order: value === 'name' ? filters.order : 'asc',
            page: 1,
        })
    }


    function resetFilters() {
        void setFilters({
            q: '',
            gender: 'all',
            size: 'all',
            care: 'all',
            sort: 'newest',
            order: 'asc',
            page: 1,
        })
    }

    return {
        ITEMS_LIMIT,
        filters,
        updateFilter,
        resetFilters,
    }
}