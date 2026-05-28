import {type inferParserType, parseAsInteger, parseAsString, parseAsStringLiteral,} from 'nuqs'

export const AnimalGenderValues = ['all', 'male', 'female'] as const
export const AnimalSizeValues = ['all', 'small', 'medium', 'large'] as const
export const AnimalCareValues = ['all', 'ready', 'needs_care'] as const
export const AnimalSortValues = ['newest', 'name'] as const
export const AnimalSortOrderValues = ['asc', 'desc'] as const

export const AnimalFilterParsers = {
  q: parseAsString.withDefault(''),
  gender: parseAsStringLiteral(AnimalGenderValues).withDefault('all'),
  size: parseAsStringLiteral(AnimalSizeValues).withDefault('all'),
  care: parseAsStringLiteral(AnimalCareValues).withDefault('all'),
  sort: parseAsStringLiteral(AnimalSortValues).withDefault('newest'),
  order: parseAsStringLiteral(AnimalSortOrderValues).withDefault('asc'),
  page: parseAsInteger.withDefault(1),
}

export type AnimalFilters = inferParserType<typeof AnimalFilterParsers>
export type AnimalGenderFilter = AnimalFilters['gender']
export type AnimalSizeFilter = AnimalFilters['size']
export type AnimalCareFilter = AnimalFilters['care']
export type AnimalSort = AnimalFilters['sort']
export type AnimalSortOrder = AnimalFilters['order']
