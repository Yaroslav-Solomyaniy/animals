import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs'

export const publicAnimalGenderValues = ['all', 'male', 'female'] as const
export const publicAnimalSizeValues = ['all', 'small', 'medium', 'large'] as const
export const publicAnimalCareValues = ['all', 'ready', 'needs_care'] as const
export const publicAnimalSortValues = ['newest', 'name'] as const
export const publicAnimalSortOrderValues = ['asc', 'desc'] as const

export const publicAnimalFilterParsers = {
  q: parseAsString.withDefault(''),
  gender: parseAsStringLiteral(publicAnimalGenderValues).withDefault('all'),
  size: parseAsStringLiteral(publicAnimalSizeValues).withDefault('all'),
  care: parseAsStringLiteral(publicAnimalCareValues).withDefault('all'),
  sort: parseAsStringLiteral(publicAnimalSortValues).withDefault('newest'),
  order: parseAsStringLiteral(publicAnimalSortOrderValues).withDefault('asc'),
  page: parseAsInteger.withDefault(1),
}

export type PublicAnimalFilters = inferParserType<typeof publicAnimalFilterParsers>
export type PublicAnimalGenderFilter = PublicAnimalFilters['gender']
export type PublicAnimalSizeFilter = PublicAnimalFilters['size']
export type PublicAnimalCareFilter = PublicAnimalFilters['care']
export type PublicAnimalSort = PublicAnimalFilters['sort']
export type PublicAnimalSortOrder = PublicAnimalFilters['order']
