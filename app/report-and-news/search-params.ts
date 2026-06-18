import { createSearchParamsCache, parseAsInteger, parseAsStringLiteral } from 'nuqs/server'

export const orderValues = ['desc', 'asc'] as const

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  order: parseAsStringLiteral(orderValues).withDefault('desc'),
})
