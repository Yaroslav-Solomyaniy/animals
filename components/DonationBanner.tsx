import { Heart } from 'lucide-react'
import Section from '@/components/ui/Section'
import SectionFrame from '@/components/ui/SectionFrame'
import DonateForm from '@/components/DonateForm'
import { LinkButton } from '@/components/ui/Button'
import { SITE_ROUTES } from '@/lib/site-config'

type DonationBannerProps = {
  amounts?: number[]
  description?: string | null
}

export default function DonationBanner({ amounts, description }: DonationBannerProps) {
  return (
    <Section className="py-14">
      <SectionFrame className="overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1fr_1fr]">
          {/* Left: CTA text */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/8" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur">
                <Heart className="h-4 w-4" />
                Підтримати центр
              </div>

              <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
                Кожна гривня рятує życie
              </h2>

              <p className="mt-4 max-w-md text-lg leading-7 text-white/85">
                {description ??
                  'Ваш донат іде на корм, ліки, щеплення та щоденний догляд за понад 500 тваринами центру.'}
              </p>

              <LinkButton
                href={SITE_ROUTES.donate}
                variant="light"
                size="lg"
                className="mt-8"
              >
                Детальніше про донати
              </LinkButton>
            </div>
          </div>

          {/* Right: DonateForm */}
          <div className="bg-white p-8 sm:p-10 lg:p-12">
            <h3 className="mb-6 text-2xl font-black text-gray-950">Задонатити зараз</h3>
            <DonateForm amounts={amounts} compact />
          </div>
        </div>
      </SectionFrame>
    </Section>
  )
}
