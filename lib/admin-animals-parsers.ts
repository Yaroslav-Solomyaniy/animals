import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs/server'

const statusValues = ['all', 'draft', 'available', 'adopted'] as const
const genderValues = ['all', 'male', 'female'] as const
const sizeValues = ['all', 'small', 'medium', 'large'] as const
const photoValues = ['all', 'with-main', 'without-main'] as const
const sortValues = ['updated', 'published', 'name'] as const
const vaccinationValues = ['all', 'yes', 'no'] as const
const neuterValues = ['all', 'yes', 'no'] as const
const adoptionValues = ['all', 'ready', 'needs_care', 'none'] as const
const ageValues = ['all', 'under1', '1to2', '2to3', '3to4', 'over5'] as const
export const colorValues = [
  'all', 'Чорний', 'Білий', 'Сірий', 'Рудий', 'Коричневий', 'Палевий',
  'Кремовий', 'Тигровий', 'Плямистий', 'Чорно-білий', 'Рудо-білий',
  'Сіро-білий', 'Трьохколірний',
] as const

export const ADMIN_ANIMALS_PER_PAGE = 10

export const adminAnimalFilterParsers = {
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(statusValues).withDefault('all'),
  gender: parseAsStringLiteral(genderValues).withDefault('all'),
  size: parseAsStringLiteral(sizeValues).withDefault('all'),
  photo: parseAsStringLiteral(photoValues).withDefault('all'),
  sort: parseAsStringLiteral(sortValues).withDefault('updated'),
  vaccination: parseAsStringLiteral(vaccinationValues).withDefault('all'),
  neuter: parseAsStringLiteral(neuterValues).withDefault('all'),
  adoption: parseAsStringLiteral(adoptionValues).withDefault('all'),
  color: parseAsStringLiteral(colorValues).withDefault('all'),
  age: parseAsStringLiteral(ageValues).withDefault('all'),
  page: parseAsInteger.withDefault(1),
}

export type AdminAnimalFilters = inferParserType<typeof adminAnimalFilterParsers>
export type AdminAnimalStatusFilter = AdminAnimalFilters['status']
export type AdminAnimalGenderFilter = AdminAnimalFilters['gender']
export type AdminAnimalSizeFilter = AdminAnimalFilters['size']
export type AdminAnimalPhotoFilter = AdminAnimalFilters['photo']
export type AdminAnimalSort = AdminAnimalFilters['sort']
export type AdminAnimalVaccinationFilter = AdminAnimalFilters['vaccination']
export type AdminAnimalNeuterFilter = AdminAnimalFilters['neuter']
export type AdminAnimalAdoptionFilter = AdminAnimalFilters['adoption']
export type AdminAnimalColorFilter = AdminAnimalFilters['color']
export type AdminAnimalAgeFilter = AdminAnimalFilters['age']
