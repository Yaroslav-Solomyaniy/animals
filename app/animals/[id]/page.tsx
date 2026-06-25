import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AnimalProfileClient from './AnimalProfileClient'
import { getPublicAnimalBySlugOrId, getRelatedPublicAnimals } from '@/lib/animals'
import { getSiteSettings } from '@/lib/site-settings'

type AnimalPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: AnimalPageProps): Promise<Metadata> {
  const { id } = await params
  const animal = await getPublicAnimalBySlugOrId(id)

  return {
    title: animal ? animal.name : 'Тварину не знайдено',
  }
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = await params
  const [animal, settings] = await Promise.all([
    getPublicAnimalBySlugOrId(id),
    getSiteSettings(),
  ])

  if (!animal) {
    notFound()
  }

  const galleryImages = animal.galleryImages ?? [animal.imageUrl]
  const relatedAnimals = await getRelatedPublicAnimals(animal, 15)

  return (
    <AnimalProfileClient
      animal={animal}
      galleryImages={galleryImages}
      relatedAnimals={relatedAnimals}
      donationsEnabled={settings.donationsEnabled}
      donationAmounts={settings.donationAmounts}
      donationDescription={settings.donationDescription}
    />
  )
}
