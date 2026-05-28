import AnimalsCatalogClient from './AnimalsCatalogClient'
import { getPublicAnimals } from '@/lib/animals'

export default async function AnimalsPage() {
  const animals = await getPublicAnimals()

  return <AnimalsCatalogClient animals={animals} />
}
