import 'server-only'

import type {Animal} from '@/types'
import type {AnimalPhotoRow, AnimalRow} from '@/lib/admin-types'
import {createClient} from '@/lib/supabase/server'
import {AnimalFilters} from "@/lib/animal-filter-parsers";

const fallbackAnimalImage = '/dog.png'
const fallbackAnimalName = "Ім'я відсутнє"


type GetPublicAnimalsResult = {
  animals: Animal[]
  count: number
}

type PaginationRange = {
    from: number
    to: number
}

export async function getPublicAnimals( pagination: PaginationRange = {from: 0, to: 10000}, limit?: number, filters?: Partial<AnimalFilters>): Promise<GetPublicAnimalsResult> {
    const supabase = await createClient()

    let query = supabase
        .from('animals')
        .select('*', {count: 'exact'})
        .eq('status', 'available')

    if (filters?.gender && filters.gender !== 'all') {
        query = query.eq('gender', filters.gender)
    }

    if (filters?.size && filters.size !== 'all') {
        query = query.eq('size', filters.size)
    }

    if (filters?.care && filters.care !== 'all') {
        query = query.eq('care', filters.care)
    }

    if (filters?.q) {
        query = query.ilike('name', `%${filters.q}%`)
    }

    if (filters?.sort === 'name_asc') {
        query = query.order('name', { ascending: true })
    } else if (filters?.sort === 'name_desc') {
        query = query.order('name', { ascending: false })
    } else if (filters?.sort === 'oldest') {
        query = query
            .order('published_at', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: true })
    } else {
        query = query
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
    }

    query = query.range(pagination.from, pagination.to)

    if (limit) {
        query = query.limit(limit)
    }

    const {data: animals, count, error} = await query

  if (error || !animals?.length) {
    return {
      animals: [],
      count: count ?? 0,
    }
  }
    const photos = await getPhotosForAnimals(animals.map((animal) => animal.id))

  return {
    animals: animals.map((animal) =>
        mapAnimalRow(animal as AnimalRow, photos.get(animal.id) ?? []),
    ),
    count: count ?? 0,
  }
}

export async function getPublicAnimalBySlugOrId(slugOrId: string): Promise<Animal | null> {
    const supabase = await createClient()
    const {data: animalBySlug, error: slugError} = await supabase
        .from('animals')
        .select('*')
        .eq('status', 'available')
        .eq('slug', slugOrId)
        .maybeSingle()

    if (slugError) {
        return null
    }

    let animal = animalBySlug as AnimalRow | null

    if (!animal && isUuid(slugOrId)) {
        const {data: animalById, error: idError} = await supabase
            .from('animals')
            .select('*')
            .eq('status', 'available')
            .eq('id', slugOrId)
            .maybeSingle()

        if (idError) {
            return null
        }

        animal = animalById as AnimalRow | null
    }

    if (!animal) {
        return null
    }

    const photos = await getPhotosForAnimals([animal.id])
    return mapAnimalRow(animal, photos.get(animal.id) ?? [])
}

export async function getRelatedPublicAnimals(animal: Animal, limit = 3): Promise<Animal[]> {
    const {animals} = await getPublicAnimals({from: 0, to: 1000}, 3)

    return animals
        .filter((item) => item.id !== animal.id)
        .filter((item) => item.size === animal.size || item.gender === animal.gender)
        .slice(0, limit)
}

async function getPhotosForAnimals(animalIds: string[]) {
    const grouped = new Map<string, AnimalPhotoRow[]>()

    if (!animalIds.length) {
        return grouped
    }

    const supabase = await createClient()
    const {data} = await supabase
        .from('animal_photos')
        .select('*')
        .in('animal_id', animalIds)
        .order('is_main', {ascending: false})
        .order('sort_order', {ascending: true})
        .order('created_at', {ascending: true})

    for (const photo of (data ?? []) as AnimalPhotoRow[]) {
        const current = grouped.get(photo.animal_id) ?? []
        current.push(photo)
        grouped.set(photo.animal_id, current)
    }

    return grouped
}

function isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function mapAnimalRow(row: AnimalRow, photos: AnimalPhotoRow[]): Animal {
    const galleryImages = photos
        .map((photo) => photo.public_url)
        .filter((url): url is string => Boolean(url))
    const mainPhoto = photos.find((photo) => photo.is_main && photo.public_url) ?? photos.find((photo) => photo.public_url)
    const gender = mapGender(row.gender)
    const name = row.name?.trim() || fallbackAnimalName
    const publicBadges = row.public_badges?.filter(Boolean) ?? []
    const adoptionStatusLabel = getAdoptionStatusLabel(row.adoption_status)
    const character = adoptionStatusLabel
        ? [adoptionStatusLabel, ...publicBadges.filter((badge) => badge !== adoptionStatusLabel)]
        : publicBadges

    return {
        id: row.slug || row.id,
        databaseId: row.id,
        slug: row.slug,
        name,
        age: row.approximate_age_label || 'Вік уточнюється',
        gender,
        size: mapSize(row.size),
        stayDuration: getCatalogDuration(row.published_at ?? row.created_at),
        badge: adoptionStatusLabel ?? publicBadges[0],
        adoptionStatus: row.adoption_status,
        imageUrl: mainPhoto?.public_url ?? fallbackAnimalImage,
        galleryImages: galleryImages.length ? galleryImages : [fallbackAnimalImage],
        character,
        isVaccinated: Boolean(row.is_vaccinated),
        isNeutered: Boolean(row.is_neutered),
        description: row.short_description || row.full_story || `${name} шукає люблячу родину.`,
        fullStory: row.full_story ?? undefined,
        publishedAt: row.published_at,
        createdAt: row.created_at,
    }
}

function getAdoptionStatusLabel(status: AnimalRow['adoption_status']) {
    if (status === 'ready') return 'Готовий до адопції'
    if (status === 'needs_care') return 'Потребує турботи'
    return null
}

function mapGender(gender: AnimalRow['gender']): Animal['gender'] {
    return gender === 'female' ? 'Самка' : 'Самець'
}

function mapSize(size: AnimalRow['size']): Animal['size'] {
    if (size === 'small') return 'Малий'
    if (size === 'large') return 'Великий'
    return 'Середній'
}

function getCatalogDuration(date: string | null) {
    if (!date) return 'Анкета активна'

    const publicationDate = new Date(date)
    const now = new Date()

    if (Number.isNaN(publicationDate.getTime()) || publicationDate > now) {
        return 'Анкета активна'
    }

    const days = Math.max(0, Math.floor((now.getTime() - publicationDate.getTime()) / 86_400_000))

    if (days < 1) return 'Опубліковано сьогодні'

    if (days < 7) return formatCount(days, ['день', 'дні', 'днів'])

    const weeks = Math.floor(days / 7)
    if (weeks < 5) return formatCount(weeks, ['тиждень', 'тижні', 'тижнів'])

    const months = Math.max(1, monthDiff(publicationDate, now))
    if (months < 12) return formatCount(months, ['місяць', 'місяці', 'місяців'])

    const years = Math.floor(months / 12)
    return formatCount(years, ['рік', 'роки', 'років'])
}

function monthDiff(from: Date, to: Date) {
    let months = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth()

    if (to.getDate() < from.getDate()) {
        months -= 1
    }

    return months
}

function formatCount(value: number, forms: [string, string, string]) {
    const absolute = Math.abs(value)
    const lastTwo = absolute % 100
    const last = absolute % 10

    if (lastTwo > 10 && lastTwo < 20) return `${value} ${forms[2]}`
    if (last === 1) return `${value} ${forms[0]}`
    if (last >= 2 && last <= 4) return `${value} ${forms[1]}`
    return `${value} ${forms[2]}`
}
