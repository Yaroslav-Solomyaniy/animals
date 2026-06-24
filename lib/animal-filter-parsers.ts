import {type inferParserType, parseAsInteger, parseAsString, parseAsStringLiteral,} from 'nuqs'

export const AnimalGenderValues = ['all', 'male', 'female'] as const
export const AnimalSizeValues = ['all', 'small', 'medium', 'large'] as const
export const AnimalCareValues = ['all', 'ready', 'needs_care'] as const
export const AnimalSortValues = ['newest', 'oldest', 'name_asc', 'name_desc'] as const
export const AnimalAgeValues = ['all', 'under1', '1to2', '2to3', '3to4', 'over5'] as const
export const AnimalColorValues = [
  'all', 'Чорний', 'Білий', 'Сірий', 'Рудий', 'Коричневий', 'Палевий',
  'Кремовий', 'Тигровий', 'Плямистий', 'Чорно-білий', 'Рудо-білий',
  'Сіро-білий', 'Трьохколірний',
] as const

export const AnimalVaccinationValues = ['all', 'yes', 'no'] as const
export const AnimalNeuterValues = ['all', 'yes', 'no'] as const

export const AnimalFilterParsers = {
  q: parseAsString.withDefault(''),
  gender: parseAsStringLiteral(AnimalGenderValues).withDefault('all'),
  size: parseAsStringLiteral(AnimalSizeValues).withDefault('all'),
  care: parseAsStringLiteral(AnimalCareValues).withDefault('all'),
  sort: parseAsStringLiteral(AnimalSortValues).withDefault('newest'),
  age: parseAsStringLiteral(AnimalAgeValues).withDefault('all'),
  color: parseAsStringLiteral(AnimalColorValues).withDefault('all'),
  vaccination: parseAsStringLiteral(AnimalVaccinationValues).withDefault('all'),
  neuter: parseAsStringLiteral(AnimalNeuterValues).withDefault('all'),
  page: parseAsInteger.withDefault(1),
}

export type AnimalFilters = inferParserType<typeof AnimalFilterParsers>
export type AnimalGenderFilter = AnimalFilters['gender']
export type AnimalSizeFilter = AnimalFilters['size']
export type AnimalCareFilter = AnimalFilters['care']
export type AnimalSort = AnimalFilters['sort']
export type AnimalAgeFilter = AnimalFilters['age']
export type AnimalColorFilter = AnimalFilters['color']
export type AnimalVaccinationFilter = AnimalFilters['vaccination']
export type AnimalNeuterFilter = AnimalFilters['neuter']
