import { ArrowLeft, Heart } from 'lucide-react'
import type { Metadata } from 'next'

import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { LinkButton } from '@/components/ui/Button'
import SectionFrame from '@/components/ui/SectionFrame'
import { DonateClient } from '@/app/donate/DonateClient'
import { getPublicAnimalBySlugOrId } from '@/lib/animals'
import { loadDonateSearchParams, sanitizeDonationAmount } from '@/lib/donate-search-params'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_ROUTES } from '@/lib/site-config'
import Section from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'Підтримати центр | Донат',
}

type DonatePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const [settings, { animalId, gift, amount }] = await Promise.all([
    getSiteSettings(),
    loadDonateSearchParams(searchParams),
  ])

  const animal = animalId ? await getPublicAnimalBySlugOrId(animalId) : null

  return (
    <main className="storybook-bg min-h-screen text-text-main">
      <StorybookDecorations />

      <Section contained={false} className="relative z-10 py-5 sm:py-6 lg:py-14">
        <LinkButton
          href={SITE_ROUTES.animals}
          variant="light"
          size="sm"
          className="mb-6 w-fit backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
          До каталогу
        </LinkButton>

        {settings.donationsEnabled ? (
          <DonateClient
            animal={animal}
            gift={gift}
            initialAmount={sanitizeDonationAmount(amount)}
          />
        ) : (
          <SectionFrame className="mx-auto max-w-xl p-8 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h1 className="text-2xl font-black text-text-main">
              Донати тимчасово недоступні
            </h1>
            <p className="mt-3 leading-7 text-gray-500">
              Ми повернемося до збору донатів найближчим часом. Дякуємо за розуміння!
            </p>
            <LinkButton href={SITE_ROUTES.help} className="mt-6">
              Інші способи допомогти
            </LinkButton>
          </SectionFrame>
        )}
      </Section>
    </main>
  )
}
