import { notFound } from 'next/navigation'
import AnimalProfileClient from './AnimalProfileClient'
import { getPublicAnimalBySlugOrId, getRelatedPublicAnimals } from '@/lib/animals'

type AnimalPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: AnimalPageProps) {
  const { id } = await params
  const animal = await getPublicAnimalBySlugOrId(id)

  return {
    title: animal ? animal.name : 'Тварину не знайдено',
  }
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = await params
  const animal = await getPublicAnimalBySlugOrId(id)

  if (!animal) {
    notFound()
  }

  const galleryImages = animal.galleryImages ?? [animal.imageUrl]
  const relatedAnimals = await getRelatedPublicAnimals(animal, 3)

  return (
    <AnimalProfileClient
      animal={animal}
      galleryImages={galleryImages}
      relatedAnimals={relatedAnimals}
    />
  )
}
