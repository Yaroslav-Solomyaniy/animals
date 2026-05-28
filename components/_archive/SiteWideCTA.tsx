import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  MapPin,
  Phone,
  Stethoscope,
} from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'

const contactItems = [
  {
    icon: Phone,
    label: 'Телефон',
    value: SITE_CONTACTS.phoneDisplay,
    href: SITE_CONTACTS.phoneHref,
    tone: 'bg-orange-50 text-primary',
  },
  {
    icon: Clock3,
    label: 'Прогулянки',
    value: SITE_CONTACTS.walkSchedule,
    href: SITE_ROUTES.contactsSchedule,
    tone: 'bg-emerald-50 text-secondary',
  },
  {
    icon: MapPin,
    label: 'Адреса',
    value: `${SITE_CONTACTS.city}, ${SITE_CONTACTS.addressShort}`,
    href: SITE_CONTACTS.mapHref,
    tone: 'bg-sky-50 text-sky-600',
  },
]

export default function SiteWideCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-336 overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1fr_420px]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#22543d_0%,#1f6f50_58%,#f27438_150%)] p-6 text-white sm:p-8 lg:p-10">
            <span className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/12 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-100">
                <HeartHandshake className="h-4 w-4" />
                Готові змінити чиєсь життя?
              </p>
              <h2 className="mt-6 max-w-2xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Оберіть простий наступний крок
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                Познайомтесь із тваринами, запишіться на прогулянку, підтримайте центр або уточніть послуги для домашнього улюбленця.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={SITE_ROUTES.animals} size="lg" className="w-full sm:w-auto">
                  Знайти друга
                </LinkButton>
                <LinkButton
                  href={SITE_ROUTES.help}
                  variant="light"
                  size="lg"
                  className="w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-gray-950 sm:w-auto"
                >
                  Підтримати центр
                </LinkButton>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:p-5 lg:p-6">
            {contactItems.map((item) => {
              const Icon = item.icon

              return (
                <LinkButton
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  variant="secondary"
                  className="h-auto min-h-20 w-full justify-start rounded-2xl border-gray-100 bg-gray-50 p-4 text-left text-gray-950 hover:bg-white"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-gray-400">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm font-black leading-tight sm:text-base">
                      {item.value}
                    </span>
                  </span>
                </LinkButton>
              )
            })}

            <LinkButton
              href={SITE_ROUTES.services}
              variant="outline"
              className="h-auto min-h-14 w-full justify-between rounded-2xl"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Послуги центру
              </span>
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
