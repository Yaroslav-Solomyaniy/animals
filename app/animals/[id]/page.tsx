import { notFound } from 'next/navigation'
import AnimalProfileClient from './AnimalProfileClient'
import { MOCK_ANIMALS } from '@/mockData'

type AnimalPageProps = {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return MOCK_ANIMALS.map((animal) => ({
    id: animal.id,
  }))
}

export async function generateMetadata({ params }: AnimalPageProps) {
  const { id } = await params
  const animal = MOCK_ANIMALS.find((item) => item.id === id)

  return {
    title: animal ? animal.name : 'Тварину не знайдено',
  }
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = await params
  const animal = MOCK_ANIMALS.find((item) => item.id === id)

  if (!animal) {
    notFound()
  }

  const galleryImages = MOCK_ANIMALS.filter((item) => item.id !== animal.id)
    .map((item) => item.imageUrl)
    .slice(0, 4)
  const relatedAnimals = MOCK_ANIMALS.filter((item) => item.id !== animal.id)
    .filter((item) => item.size === animal.size || item.gender === animal.gender)
    .slice(0, 3)

  return (
    <AnimalProfileClient
      animal={animal}
      galleryImages={galleryImages}
      relatedAnimals={relatedAnimals}
    />
  )
}
