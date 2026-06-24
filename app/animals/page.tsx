import {getPublicAnimals} from '@/lib/animals'
import {AnimalsCatalogClient} from "@/app/animals/AnimalsCatalogClient";
import {ANIMALS_PAGE_ITEMS_LIMIT} from "@/contstants/pagination";

interface Props {
  searchParams: Promise<{
    q?: string
    gender?: string
    size?: string
    care?: string
    sort?: string
    age?: string
    color?: string
    vaccination?: string
    neuter?: string
    page?: number
  }>
}

export default async function AnimalsPage({ searchParams }: Props) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params.page ?? 1))

  const from = (currentPage - 1) * ANIMALS_PAGE_ITEMS_LIMIT
  const to = from + ANIMALS_PAGE_ITEMS_LIMIT - 1

  const {animals, count} = await getPublicAnimals({from, to}, ANIMALS_PAGE_ITEMS_LIMIT, {
    q: params.q ?? '',
    gender: (params.gender as any) ?? 'all',
    size: (params.size as any) ?? 'all',
    care: (params.care as any) ?? 'all',
    sort: (params.sort as any) ?? 'newest',
    age: (params.age as any) ?? 'all',
    color: (params.color as any) ?? 'all',
    vaccination: (params.vaccination as any) ?? 'all',
    neuter: (params.neuter as any) ?? 'all',
    page: (params.page as any) ?? 1
  })

  const totalPages = Math.max(1, Math.ceil(count / ANIMALS_PAGE_ITEMS_LIMIT),)

  return (
    <AnimalsCatalogClient
      animals={animals}
      foundCount={count}
      pagination={{currentPage, totalPages}}
    />
  )
}