import Link from 'next/link'
import { ChevronRight, Clock3, Phone, Stethoscope } from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import Section from '@/components/ui/Section'

const QuickContactCTA = () => {
  return (
    <Section id="quick_contacts" className="pb-12 sm:pb-16 lg:pb-24">
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
            <LinkButton
              href={SITE_CONTACTS.phoneHref}
              variant="light"
              className="h-auto min-h-20 justify-start gap-3 rounded-2xl border-gray-100 bg-white p-4 text-left text-text-main sm:min-h-24 sm:gap-4 sm:rounded-3xl sm:p-5 lg:min-h-26"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary sm:h-12 sm:w-12 sm:rounded-2xl">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-gray-400 sm:text-xs">
                  Телефон
                </span>
                <span className="mt-1 block break-words text-base font-extrabold leading-tight sm:text-lg lg:text-xl">
                  {SITE_CONTACTS.phoneDisplay}
                </span>
              </span>
            </LinkButton>

            <div className="flex min-h-20 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-text-main sm:min-h-24 sm:gap-4 sm:rounded-3xl sm:p-5 lg:min-h-26">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1FFF8] text-secondary sm:h-12 sm:w-12 sm:rounded-2xl">
                <Clock3 className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-gray-400 sm:text-xs">
                  Прогулянки
                </span>
                <span className="mt-1 block text-base font-extrabold leading-tight sm:text-lg">
                  Вихідні, 11:00-14:00
                </span>
              </span>
            </div>
          </div>

          <Link
            href={SITE_ROUTES.services}
            className="group relative overflow-hidden rounded-3xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-white p-4 text-left text-text-main shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-300/60 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:rounded-4xl sm:p-6 md:p-8"
          >
            <span className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-100/60 transition-transform group-hover:scale-110" />

            <span className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white sm:h-14 sm:w-14 md:h-16 md:w-16 md:rounded-3xl">
                <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
              </span>
              <span className="min-w-0">
                <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary sm:text-xs">
                  Для власників тварин
                </span>
                <span className="block text-2xl font-black leading-tight text-text-main sm:text-3xl lg:text-4xl">
                  Комерційні послуги центру
                </span>
                <span className="mt-3 block max-w-2xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                  Якщо вас цікавлять послуги для вашої тварини, ми також їх
                  надаємо. Деталі та умови дивіться на сторінці послуг.
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition-colors group-hover:text-secondary sm:text-base">
                  Перейти до послуг
                  <ChevronRight className="h-4 w-4" />
                </span>
              </span>
            </span>
          </Link>
        </div>
    </Section>
  )
}

export default QuickContactCTA
