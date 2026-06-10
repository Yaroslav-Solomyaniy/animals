'use client'

import {useQueryStates} from 'nuqs'
import {AnimalFilterParsers, type AnimalFilters} from '@/lib/animal-filter-parsers'

export function useAnimalUrlFilters() {

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

    function resetFilters() {
        void setFilters({
            q: '',
            gender: 'all',
            size: 'all',
            care: 'all',
            sort: 'newest',
            page: 1,
        })
    }

    return {
        filters,
        updateFilter,
        resetFilters,
    }
}