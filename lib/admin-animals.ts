import {
  createLoader,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs/server'
import { createClient } from '@/lib/supabase/server'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'

const statusValues = ['all', 'draft', 'available', 'reserved', 'adopted', 'hidden'] as const
const genderValues = ['all', 'male', 'female'] as const
const sizeValues = ['all', 'small', 'medium', 'large'] as const
const photoValues = ['all', 'with-main', 'without-main'] as const
const sortValues = ['updated', 'published', 'name'] as const

export const adminAnimalFilterParsers = {
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(statusValues).withDefault('all'),
  gender: parseAsStringLiteral(genderValues).withDefault('all'),
  size: parseAsStringLiteral(sizeValues).withDefault('all'),
  photo: parseAsStringLiteral(photoValues).withDefault('all'),
  sort: parseAsStringLiteral(sortValues).withDefault('updated'),
}

export const loadAdminAnimalFilters = createLoader(adminAnimalFilterParsers)

export type AdminAnimalFilters = inferParserType<typeof adminAnimalFilterParsers>
export type AdminAnimalStatusFilter = AdminAnimalFilters['status']
export type AdminAnimalGenderFilter = AdminAnimalFilters['gender']
export type AdminAnimalSizeFilter = AdminAnimalFilters['size']
export type AdminAnimalPhotoFilter = AdminAnimalFilters['photo']
export type AdminAnimalSort = AdminAnimalFilters['sort']

export type AdminAnimalCardData = AnimalRow & {
  photos: AnimalPhotoRow[]
}

export type AdminAnimalsPageData = {
  animals: AdminAnimalCardData[]
  totalCount: number
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

  if (mainPhotoAnimalIds.error) {
    return {
      animals: [],
      totalCount: 0,
      animalError: null,
      photosError: mainPhotoAnimalIds.error,
    }
  }

  if (filters.photo === 'with-main' && mainPhotoAnimalIds.ids.length === 0) {
    return {
      animals: [],
      totalCount: 0,
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

  const { data, error, count } = await query

  const animals = (data ?? []) as AnimalRow[]

  if (error || animals.length === 0) {
    return {
      animals: animals.map((animal) => ({ ...animal, photos: [] })),
      totalCount: count ?? animals.length,
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
    totalCount: count ?? animals.length,
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
