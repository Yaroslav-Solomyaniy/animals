import { createLoader } from 'nuqs/server'
import { createClient } from '@/lib/supabase/server'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'
import {
  adminAnimalFilterParsers,
  ADMIN_ANIMALS_PER_PAGE,
  type AdminAnimalFilters,
  type AdminAnimalPhotoFilter,
} from '@/lib/admin-animals-parsers'

export { adminAnimalFilterParsers } from '@/lib/admin-animals-parsers'
export type {
  AdminAnimalFilters,
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

export const loadAdminAnimalFilters = createLoader(adminAnimalFilterParsers)

export type AdminAnimalCardData = AnimalRow & {
  photos: AnimalPhotoRow[]
}

export type AdminAnimalsPageData = {
  animals: AdminAnimalCardData[]
  totalCount: number
  currentPage: number
  totalPages: number
  animalError: string | null
  photosError: string | null
}

export function hasAdminAnimalFilters(filters: AdminAnimalFilters) {
  return Object.entries(adminAnimalFilterParsers).some(([key, parser]) => {
    const filterKey = key as keyof AdminAnimalFilters
    return filters[filterKey] !== parser.defaultValue
  })
}

export async function getAdminAnimalsPageData(filters: AdminAnimalFilters): Promise<AdminAnimalsPageData> {
  const supabase = await createClient()
  const mainPhotoAnimalIds = await getMainPhotoAnimalIds(filters.photo)

  const currentPage = Math.max(1, filters.page)
  const from = (currentPage - 1) * ADMIN_ANIMALS_PER_PAGE
  const to = from + ADMIN_ANIMALS_PER_PAGE - 1

  if (mainPhotoAnimalIds.error) {
    return {
      animals: [],
      totalCount: 0,
      currentPage,
      totalPages: 1,
      animalError: null,
      photosError: mainPhotoAnimalIds.error,
    }
  }

  if (filters.photo === 'with-main' && mainPhotoAnimalIds.ids.length === 0) {
    return {
      animals: [],
      totalCount: 0,
      currentPage,
      totalPages: 1,
      animalError: null,
      photosError: null,
    }
  }

  let query = supabase.from('animals').select('*', { count: 'exact' })

  if (filters.q) {
    const term = filters.q.replace(/[%,]/g, ' ').trim()

    if (term) {
      query = query.or(
        `name.ilike.%${term}%,slug.ilike.%${term}%,short_description.ilike.%${term}%`
      )
    }
  }

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.gender !== 'all') {
    query = query.eq('gender', filters.gender)
  }

  if (filters.size !== 'all') {
    query = query.eq('size', filters.size)
  }

  if (filters.vaccination === 'yes') {
    query = query.eq('is_vaccinated', true)
  } else if (filters.vaccination === 'no') {
    query = query.eq('is_vaccinated', false)
  }

  if (filters.neuter === 'yes') {
    query = query.eq('is_neutered', true)
  } else if (filters.neuter === 'no') {
    query = query.eq('is_neutered', false)
  }

  if (filters.adoption === 'none') {
    query = query.is('adoption_status', null)
  } else if (filters.adoption !== 'all') {
    query = query.eq('adoption_status', filters.adoption)
  }

  if (filters.color !== 'all') {
    query = query.eq('color', filters.color)
  }

  if (filters.age === 'under1') {
    query = query.not('approximate_age_label', 'is', null).filter('approximate_age_label::numeric', 'lt', 1)
  } else if (filters.age === '1to2') {
    query = query.not('approximate_age_label', 'is', null)
      .filter('approximate_age_label::numeric', 'gte', 1)
      .filter('approximate_age_label::numeric', 'lt', 2)
  } else if (filters.age === '2to3') {
    query = query.not('approximate_age_label', 'is', null)
      .filter('approximate_age_label::numeric', 'gte', 2)
      .filter('approximate_age_label::numeric', 'lt', 3)
  } else if (filters.age === '3to4') {
    query = query.not('approximate_age_label', 'is', null)
      .filter('approximate_age_label::numeric', 'gte', 3)
      .filter('approximate_age_label::numeric', 'lt', 4)
  } else if (filters.age === 'over5') {
    query = query.not('approximate_age_label', 'is', null).filter('approximate_age_label::numeric', 'gte', 5)
  }

  if (filters.photo === 'with-main') {
    query = query.in('id', mainPhotoAnimalIds.ids)
  }

  if (filters.photo === 'without-main' && mainPhotoAnimalIds.ids.length > 0) {
    query = query.not('id', 'in', `(${mainPhotoAnimalIds.ids.join(',')})`)
  }

  if (filters.sort === 'name') {
    query = query.order('name', { ascending: true })
  } else if (filters.sort === 'published') {
    query = query.order('published_at', { ascending: false, nullsFirst: false })
  } else {
    query = query.order('updated_at', { ascending: false, nullsFirst: false })
  }

  const { data, error, count } = await query.range(from, to)

  const animals = (data ?? []) as AnimalRow[]

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_ANIMALS_PER_PAGE))

  if (error || animals.length === 0) {
    return {
      animals: animals.map((animal) => ({ ...animal, photos: [] })),
      totalCount,
      currentPage,
      totalPages,
      animalError: error?.message ?? null,
      photosError: null,
    }
  }

  const { data: photosData, error: photosError } = await supabase
    .from('animal_photos')
    .select('*')
    .in(
      'animal_id',
      animals.map((animal) => animal.id)
    )
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  const photosByAnimal = groupPhotosByAnimal((photosData ?? []) as AnimalPhotoRow[])

  return {
    animals: animals.map((animal) => ({
      ...animal,
      photos: photosByAnimal.get(animal.id) ?? [],
    })),
    totalCount,
    currentPage,
    totalPages,
    animalError: null,
    photosError: photosError?.message ?? null,
  }
}

async function getMainPhotoAnimalIds(photoFilter: AdminAnimalPhotoFilter) {
  if (photoFilter === 'all') {
    return { ids: [] as string[], error: null as string | null }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('animal_photos')
    .select('animal_id')
    .eq('is_main', true)

  return {
    ids: Array.from(new Set((data ?? []).map((photo) => photo.animal_id as string))),
    error: error?.message ?? null,
  }
}

function groupPhotosByAnimal(photos: AnimalPhotoRow[]) {
  const grouped = new Map<string, AnimalPhotoRow[]>()

  for (const photo of photos) {
    const current = grouped.get(photo.animal_id) ?? []
    current.push(photo)
    grouped.set(photo.animal_id, current)
  }

  return grouped
}
