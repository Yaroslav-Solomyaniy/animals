'use client'

import Section from '@/components/ui/Section'
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { WobbleCard } from '@/components/ui/wobble-card'
import { cardColors } from '@/contstants/colors'
import { SITE_ROUTES } from '@/lib/site-config'
import { useFeatureFlags } from '@/components/FeatureFlagsProvider'

type TrustCard = {
  icon: LucideIcon
  title: string
  text: string
  color: keyof typeof cardColors
  slogan?: string
  featuredOnTablet?: boolean
  desktopVariant?: 'wide' | 'tall'
}

const trustCards: Array<TrustCard> = [
  {
    icon: HeartHandshake,
    title: 'Черкаська служба чистоти підтримує центр щодня',
    text: 'Підприємство забезпечує роботу центру, закупівлю кормів, ветеринарних препаратів, медикаментів і всього необхідного для утримання тварин.',
    color: 'warm',
    featuredOnTablet: true,
    desktopVariant: 'wide',
  },
  {
    icon: Sparkles,
    title: 'Місія і бачення',
    text: 'Рятувати безпритульних тварин, лікувати, створювати комфортні умови та наближувати Черкаси до міста, де кожна тварина має дім.',
    color: 'mint',
    slogan: 'Кожен має право на гідне життя',
    desktopVariant: 'tall',
  },
  {
    icon: ShieldCheck,
    title: 'Міська програма',
    text: 'Стабілізація популяції безпритульних собак без шкоди для людей і тварин.',
    color: 'blue',
  },
  {
    icon: Stethoscope,
    title: 'Професіоналізм',
    text: 'Якісний ветеринарний догляд і відповідальний підхід до кожної тварини.',
    color: 'rose',
  },
  {
    icon: Users,
    title: 'Спільнота',
    text: 'Обʼєднуємо людей, які хочуть допомагати тваринам і місту.',
    color: 'violet',
  },
]

export default function TrustValues() {
  const { donationsEnabled } = useFeatureFlags()
  return (
    <Section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mb-8 max-w-3xl sm:mb-10 md:mb-12 lg:mb-14">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-primary sm:text-sm">
            Відкрита допомога
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-text-main sm:text-4xl md:text-5xl lg:text-6xl">
            Турбота без зайвого шуму
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
            Кілька простих принципів, які тримають роботу центру людяною,
            відкритою та корисною для тварин і міста.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {trustCards.map((card, index) => {
            const colors = cardColors[card.color]
            const Icon = card.icon
            const isWideDesktop = card.desktopVariant === 'wide'
            const isTallDesktop = card.desktopVariant === 'tall'
            const isFeaturedDesktop = isWideDesktop || isTallDesktop

            return (
              <WobbleCard
                key={card.title}
                containerClassName={`min-h-0 border-gray-200 ${card.featuredOnTablet ? 'md:max-lg:col-span-2' : ''} ${isWideDesktop ? 'lg:col-span-2 lg:min-h-[430px]' : ''} ${isTallDesktop ? 'lg:min-h-[430px]' : ''} ${!isFeaturedDesktop ? 'lg:min-h-[260px]' : ''} ${colors.bg}`}
                className={`${isFeaturedDesktop ? 'lg:flex lg:h-full lg:flex-col lg:justify-between lg:!p-10' : 'lg:!p-9'} ${card.featuredOnTablet ? '!p-4 sm:!p-6 md:max-lg:!p-8' : '!p-4 sm:!p-6'}`}
                beamColorFrom={colors.beamFrom}
                beamColorTo={colors.beamTo}
                beamDelay={index * 1.1}
                beamSize={isWideDesktop ? 260 : isTallDesktop ? 190 : card.featuredOnTablet ? 160 : 140}
              >
                <div className={`${card.featuredOnTablet ? 'relative z-10 md:max-lg:max-w-xl' : 'relative z-10'} ${isWideDesktop ? 'lg:max-w-2xl' : ''}`}>
                  <Icon className={`mb-4 h-8 w-8 sm:mb-5 ${card.featuredOnTablet ? 'md:max-lg:h-10 md:max-lg:w-10' : ''} ${isFeaturedDesktop ? 'lg:mb-8 lg:h-12 lg:w-12' : ''} ${colors.icon}`} />
                  <h3 className={`mb-3 text-xl font-extrabold sm:text-2xl ${card.featuredOnTablet ? 'md:max-lg:text-3xl' : ''} ${isFeaturedDesktop ? 'lg:text-3xl' : ''} ${isWideDesktop ? 'lg:text-4xl lg:leading-tight' : ''} ${colors.title}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 ${card.featuredOnTablet ? 'md:max-lg:text-lg md:max-lg:leading-8' : ''} ${isFeaturedDesktop ? 'lg:mt-5 lg:text-lg lg:leading-8' : ''} ${isWideDesktop ? 'lg:max-w-xl' : ''}`}>
                    {card.text}
                  </p>
                </div>

                {isWideDesktop && donationsEnabled ? (
                  <LinkButton
                    href={SITE_ROUTES.donate}
                    className="relative z-10 mt-10 hidden w-fit rounded-2xl px-6 py-3.5 lg:inline-flex"
                  >
                    Підтримати центр
                  </LinkButton>
                ) : null}

                {card.slogan ? (
                  <p className="relative z-10 mt-6 text-xs font-extrabold tracking-[0.14em] text-gray-400 uppercase sm:text-sm lg:mt-10 lg:tracking-wider">
                    {card.slogan}
                  </p>
                ) : null}
              </WobbleCard>
            )
          })}
        </div>
    </Section>
  )
}
