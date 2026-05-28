import {getPublicAnimals} from '@/lib/animals'
import {AnimalsCatalogClient} from "@/app/animals/AnimalsCatalogClient";

interface Props {
  searchParams: Promise<{
    q?: string
    gender?: string
    size?: string
    care?: string
    sort?: string
    order?: string
  }>
}

export default async function AnimalsPage({ searchParams }: Props) {
  const params = await searchParams

  const animals = await getPublicAnimals(undefined, {
    q: params.q ?? '',
    gender: (params.gender as any) ?? 'all',
    size: (params.size as any) ?? 'all',
    care: (params.care as any) ?? 'all',
    sort: (params.sort as any) ?? 'newest',
    order: (params.order as any) ?? 'asc',
  })

  return <AnimalsCatalogClient animals={animals} />
}