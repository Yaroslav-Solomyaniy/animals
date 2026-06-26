import { ArrowRight, Clock3, Facebook, Globe2, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import BorderGlow from '@/components/ui/BorderGlow'
import SectionFrame from '@/components/ui/SectionFrame'
import Section from '@/components/ui/Section'
import { DiagonalGrid } from '@/components/ui/background-components'
import { SITE_CONTACTS, SITE_SOCIAL_LINKS } from '@/lib/site-config'
import ContactForm from './ContactForm'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import GoWalks from '@/components/GoWalks'

const quickContacts = [
  {
    icon: Phone,
    label: 'Телефон',
    value: SITE_CONTACTS.phoneDisplay,
    href: SITE_CONTACTS.phoneHref,
    tone: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Mail,
    label: 'Email',
    value: SITE_CONTACTS.email,
    href: SITE_CONTACTS.emailHref,
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    icon: MapPin,
    label: 'Адреса',
    value: SITE_CONTACTS.addressFull,
    href: SITE_CONTACTS.mapHref,
    external: true,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Clock3,
    label: 'Години роботи',
    value: 'Пн–Чт, Сб–Нд · 8:00–17:00\nПт · 8:00–16:00',
    tone: 'bg-violet-50 text-violet-600',
  },
]

const socialLinks = [
  {
    icon: Instagram,
    label: 'Instagram',
    description: 'Фото, відео та сторіз про підопічних',
    href: SITE_SOCIAL_LINKS.instagram.href,
    tone: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    description: 'Новини та анонси прогулянок',
    href: SITE_SOCIAL_LINKS.facebook.href,
    tone: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  },
  {
    icon: Globe2,
    label: 'Черкаська служба чистоти',
    description: 'Партнер центру у м. Черкаси',
    href: SITE_SOCIAL_LINKS.chystota.href,
    tone: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  },
]

const contactGradientClassNames = {
  sunrise: 'contacts-gradient-sunrise',
} as const

export default async function ContactsPage() {
  return (
    <main className="text-text-main relative">
      <DiagonalGrid className="opacity-40 fixed" />
      <StorybookDecorations />
      <Section className="relative isolate overflow-hidden py-10 sm:py-12 lg:py-16" innerClassName="relative">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm">
                <MessageCircle className="h-4 w-4 text-primary" />
                Контакти центру
              </p>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl">
                Раді знайомству!{' '}
                <span className="bg-[linear-gradient(90deg,#f97316,#fb923c)] bg-clip-text text-transparent">Напишіть нам</span> або просто
                зайдіть у гості
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                Відповімо на питання про усиновлення, прогулянки чи послуги і підкажемо, як зручніше домовитись про візит.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <span className="storybook-spark h-2 w-2 rounded-full bg-emerald-500" />
                  Команда на зв&#39;язку щодня
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 shadow-sm">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Відповідаємо якнайшвидше
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
              {/* Dot grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />
              {/* Warm corner accent */}
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-[80px] bg-[linear-gradient(225deg,#fff7ed,transparent)]" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-tr-[60px] bg-[linear-gradient(45deg,#f0fdf4,transparent)]" />

              <div className="relative flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-orange-50/80 to-white px-4 py-4 sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] text-white shadow-sm">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight text-text-main">Швидкий зв&#39;язок</p>
                  <p className="text-sm leading-snug text-gray-500">Оберіть зручний спосіб</p>
                </div>
              </div>

              <dl className="relative divide-y divide-gray-100 p-2 sm:p-3">
                {quickContacts.map((item) => {
                  const Icon = item.icon
                  const inner = (
                    <>
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs font-extrabold uppercase tracking-[0.14em] text-gray-400">{item.label}</dt>
                        <dd className="mt-1 whitespace-pre-line text-sm font-extrabold leading-snug text-text-main">{item.value}</dd>
                      </div>
                      {item.href ? (
                        <ArrowRight className="ml-auto h-4 w-4 shrink-0 self-center text-gray-300 transition group-hover:translate-x-1 group-hover:text-primary" />
                      ) : null}
                    </>
                  )

                  if (!item.href) {
                    return (
                      <div key={item.label} className="flex items-center gap-4 p-3 sm:p-4">
                        {inner}
                      </div>
                    )
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-gray-50 sm:p-4"
                    >
                      {inner}
                    </a>
                  )
                })}
              </dl>
            </div>
          </div>
      </Section>

      <Section className="pb-10 sm:pb-12 lg:pb-16">
          <SectionFrame className={`p-3 sm:p-5 xl:p-6 ${contactGradientClassNames.sunrise}`}>
            <BorderGlow
              className="w-full"
              borderRadius={32}
              glowRadius={22}
              colors={['#fb923c', '#f59e0b', '#38bdf8']}
              glowColor="249 115 22"
              fillOpacity={0.08}
            >
              <ContactForm />
            </BorderGlow>
          </SectionFrame>
      </Section>

      <GoWalks />

      <Section className="pb-10 sm:pb-12 lg:pb-16">
          <SectionFrame className="grid overflow-hidden border border-gray-100 bg-white p-0 shadow-soft lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Соціальні мережі</p>
              <h2 className="mt-4 text-2xl font-extrabold text-text-main sm:text-3xl">Дізнавайтесь більше про нас</h2>
              <p className="mt-4 max-w-md leading-7 text-gray-600">
                Публікуємо історії тварин, оголошення про прогулянки, потреби та новини Центру надання допомоги безпритульним тваринам м.
                Черкаси.
              </p>

              <div className="mt-6 divide-y divide-gray-100 border-t border-gray-100 sm:mt-8">
                {socialLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 py-4 transition"
                    >
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-extrabold leading-tight text-text-main">{item.label}</span>
                        <span className="mt-0.5 block text-sm leading-snug text-gray-500">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-primary" />
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="h-full min-h-[280px] overflow-hidden rounded-2xl">
                <iframe
                  title="Мапа розташування центру допомоги тваринам"
                  src={`${SITE_CONTACTS.mapHref}&output=embed`}
                  className="h-full min-h-[280px] w-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </SectionFrame>
      </Section>
    </main>
  )
}
