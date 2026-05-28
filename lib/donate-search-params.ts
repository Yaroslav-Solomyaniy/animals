import {
  createLoader,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs/server'

import { SITE_ROUTES } from '@/lib/site-config'

export const donateGiftValues = ['general', 'treat'] as const

export const donateSearchParsers = {
  animalId: parseAsString.withDefault(''),
  gift: parseAsStringLiteral(donateGiftValues).withDefault('general'),
  amount: parseAsString.withDefault(''),
}

export const loadDonateSearchParams = createLoader(donateSearchParsers)
export const serializeDonateSearchParams = createSerializer(donateSearchParsers)

export type DonateSearchParams = inferParserType<typeof donateSearchParsers>

type BuildDonateHrefParams = Omit<Partial<DonateSearchParams>, 'amount'> & {
  amount?: string | number | null
}

export function sanitizeDonationAmount(value: string | number | null | undefined) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 7)
}

export function buildDonateHref(params: BuildDonateHrefParams = {}) {
  const amount = sanitizeDonationAmount(params.amount)

  return serializeDonateSearchParams(SITE_ROUTES.donate, {
    animalId: params.animalId || null,
    gift: params.gift,
    amount: amount || null,
  })
}
