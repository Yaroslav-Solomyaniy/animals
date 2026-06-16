import { ArrowLeft } from 'lucide-react'

import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { LinkButton } from '@/components/ui/Button'
import { DonateClient } from '@/app/donate/DonateClient'
import { getPublicAnimalBySlugOrId } from '@/lib/animals'
import {
  loadDonateSearchParams,
  sanitizeDonationAmount,
} from '@/lib/donate-search-params'
import { SITE_ROUTES } from '@/lib/site-config'
import Section from '@/components/ui/Section'

type DonatePageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const { animalId, gift, amount } = await loadDonateSearchParams(searchParams)
  const animal = animalId ? await getPublicAnimalBySlugOrId(animalId) : null

  return (
    <main className="storybook-bg min-h-screen text-text-main">
      <StorybookDecorations />

      <Section contained={false} className="relative z-10 py-10 lg:py-14">
        <LinkButton
          href={SITE_ROUTES.animals}
          variant="light"
          size="sm"
          className="mb-6 w-fit backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
          До каталогу
        </LinkButton>

        <DonateClient
          animal={animal}
          gift={gift}
          initialAmount={sanitizeDonationAmount(amount)}
        />
      </Section>
    </main>
  )
}
