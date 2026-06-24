'use client'

import { useQueryStates } from 'nuqs'
import { adminAnimalFilterParsers, type AdminAnimalFilters } from '@/lib/admin-animals-parsers'

export function useAdminAnimalUrlFilters() {
  const [filters, setFilters] = useQueryStates(adminAnimalFilterParsers, {
    history: 'push',
    shallow: false,
  })

  function updateFilter<Key extends keyof AdminAnimalFilters>(key: Key, value: AdminAnimalFilters[Key]) {
    void setFilters({ [key]: value } as Partial<AdminAnimalFilters>)
  }

  function resetFilters() {
    void setFilters({
      q: '',
      status: 'all',
      gender: 'all',
      size: 'all',
      photo: 'all',
      sort: 'updated',
      vaccination: 'all',
      neuter: 'all',
      adoption: 'all',
      color: 'all',
      age: 'all',
    })
  }

  const hasFilters =
    filters.q !== '' ||
    filters.status !== 'all' ||
    filters.gender !== 'all' ||
    filters.size !== 'all' ||
    filters.photo !== 'all' ||
    filters.sort !== 'updated' ||
    filters.vaccination !== 'all' ||
    filters.neuter !== 'all' ||
    filters.adoption !== 'all' ||
    filters.color !== 'all' ||
    filters.age !== 'all'

  return { filters, updateFilter, resetFilters, hasFilters }
}
