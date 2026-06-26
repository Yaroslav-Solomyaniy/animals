import { createSearchParamsCache, parseAsInteger, parseAsStringLiteral } from 'nuqs/server'

const FILTER_TYPES = ['all', 'contact', 'volunteer', 'service'] as const

export const submissionsSearchParamsCache = createSearchParamsCache({
  type: parseAsStringLiteral(FILTER_TYPES).withDefault('all'),
  page: parseAsInteger.withDefault(0),
})
