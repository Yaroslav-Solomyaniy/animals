import {
  ArrowRight,
  Clock3,
  Facebook,
  Footprints,
  Globe2,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Stethoscope,
} from 'lucide-react'

import BorderGlow from '@/components/ui/BorderGlow'
import SectionFrame from '@/components/ui/SectionFrame'
import {LinkButton} from '@/components/ui/Button'
import {getPublicAnimals} from '@/lib/animals'
import {SITE_CONTACTS, SITE_SOCIAL_LINKS} from '@/lib/site-config'
import ContactForm from './ContactForm'

const contactGuideItems = [
  {
    icon: HeartHandshake,
    title: 'Якщо хочете усиновити',
    text: 'Напишіть, кого шукаєте: розмір, вік, характер, умови проживання та чи є інші тварини вдома.',
    tone: 'bg-orange-400/15 text-orange-300',
  },
  {
    icon: Footprints,
    title: 'Якщо плануєте прогулянку',
    text: 'Уточніть день, кількість людей і чи маєте досвід прогулянок із собаками.',
    tone: 'bg-sky-400/15 text-sky-300',
  },
  {
    icon: Stethoscope,
    title: 'Якщо потрібні послуги',
    text: 'Опишіть тварину, бажану послугу та зручний час для візиту або консультації.',
    tone: 'bg-emerald-400/15 text-emerald-300',
  },
]

const quickContacts = [
  {
    icon: Phone,
    label: 'Телефон',
    value: SITE_CONTACTS.phoneDisplay,
    hint: 'Натисніть, щоб зателефонувати',
    href: SITE_CONTACTS.phoneHref,
    tone: 'bg-orange-400/15 text-orange-300',
  },
  {
    icon: Mail,
    label: 'Email',
    value: SITE_CONTACTS.email,
    hint: 'Натисніть, щоб написати листа',
    href: SITE_CONTACTS.emailHref,
    tone: 'bg-sky-400/15 text-sky-300',
  },
  {
    icon: MapPin,
    label: 'Адреса',
    value: SITE_CONTACTS.addressFull,
    hint: 'Відкрити маршрут на карті',
    href: SITE_CONTACTS.mapHref,
    external: true,
    tone: 'bg-emerald-400/15 text-emerald-300',
  },
  {
    icon: Clock3,
    label: 'Години роботи',
    value: 'Пн-Чт, Сб-Нд 8:00-17:00 · Пт 8:00-16:00',
    hint: 'У вихідні зустрічаємо за розкладом прогулянок',
    tone: 'bg-violet-400/15 text-violet-300',
  },
]

const sectionClassName = 'px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6'
const contactGradientClassNames = {
  honey: 'contacts-gradient-honey',
  river: 'contacts-gradient-river',
  sunrise: 'contacts-gradient-sunrise',
} as const

export default async function ContactsPage() {
  const animals = await getPublicAnimals()

  return (
    <main className="storybook-bg text-text-main">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,#3b2a52_0%,#1f2937_46%,#163129_100%)] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="storybook-float pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
        <div className="storybook-spark pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="storybook-wiggle pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative mx-auto max-w-336">
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
            <div className="flex h-full flex-col rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-200">
                <MessageCircle className="h-4 w-4" />
                Контакти центру
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Раді знайомству!{' '}
                <span className="bg-[linear-gradient(90deg,#fdba74,#fef3c7,#6ee7b7)] bg-clip-text text-transparent">
                  Напишіть нам
                </span>{' '}
                або просто зайдіть у гості
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
                Відповімо на питання про усиновлення, прогулянки чи послуги і підкажемо, як зручніше домовитись про візит.
              </p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
                <span className="storybook-spark h-2 w-2 rounded-full bg-emerald-400" />
                Команда на зв&#39;язку щодня
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {quickContacts.map((item, index) => {
                const Icon = item.icon
                const tilt = index % 2 === 0 ? '-rotate-1' : 'rotate-1'
                const content = (
                  <>
                    <Icon className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 text-white/[0.04]" strokeWidth={1} />
                    <div className="relative flex items-center justify-between">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {item.href ? (
                        <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70" />
                      ) : null}
                    </div>
                    <p className="relative mt-4 max-w-[14rem] text-sm leading-6 text-white/55">
                      {item.hint}
                    </p>
                    <div className="relative mt-auto">
                      <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/45">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm font-extrabold leading-snug text-white">
                        {item.value}
                      </span>
                    </div>
                  </>
                )

                if (!item.href) {
                  return (
                    <div
                      key={item.label}
                      className={`group relative flex flex-col overflow-hidden aspect-square rounded-t-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-xl transition hover:bg-white/14 ${tilt} hover:rotate-0`}
                    >
                      {content}
                    </div>
                  )
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className={`group relative flex flex-col overflow-hidden aspect-square rounded-t-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/14 ${tilt} hover:rotate-0`}
                  >
                    {content}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <div className={`mx-auto max-w-336 rounded-[28px] border border-orange-100 p-4 shadow-[0_22px_75px_rgba(249,115,22,0.10)] sm:rounded-4xl sm:p-6 lg:p-7 xl:p-8 ${contactGradientClassNames.honey}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Перед зверненням
              </p>
              <h2 className="mt-3 max-w-xl text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl lg:text-4xl">
                Щоб ми швидше допомогли
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Коротко опишіть тему звернення і додайте кілька деталей. Так команда одразу зрозуміє, кому передати питання і що підготувати до відповіді.
              </p>
            </div>
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm sm:h-14 sm:w-14">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-7 md:grid-cols-3">
            {contactGuideItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-[22px] border border-orange-100/80 bg-white/78 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)] ring-1 ring-white/70 sm:gap-4 sm:rounded-3xl sm:p-5"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold leading-tight text-text-main">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-gray-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className={sectionClassName}>
        <SectionFrame className={`mx-auto max-w-336 p-3 sm:p-5 xl:p-6 ${contactGradientClassNames.sunrise}`}>
          <BorderGlow
            className="w-full"
            borderRadius={32}
            glowRadius={22}
            colors={['#fb923c', '#f59e0b', '#38bdf8']}
            glowColor="249 115 22"
            fillOpacity={0.08}
          >
            <ContactForm animals={animals.animals} />
          </BorderGlow>
        </SectionFrame>
      </section>

      <section className="px-4 pb-14 pt-4 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8 lg:pb-20 lg:pt-6">
        <SectionFrame className={`mx-auto grid max-w-336 gap-4 p-3 sm:gap-5 sm:p-5 xl:grid-cols-[1fr_1.25fr] xl:gap-6 xl:p-6 ${contactGradientClassNames.river}`}>
          <div className="rounded-3xl border border-orange-100 bg-white/86 p-4 shadow-sm sm:rounded-[28px] sm:p-7">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Соціальні мережі
              </p>
              <h2 className="mt-4 text-2xl font-extrabold text-text-main sm:text-3xl">
                Дізнавайтесь більше про нас
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Публікуємо історії тварин, оголошення про прогулянки, потреби та
                новини Центру надання допомоги безпритульним тваринам м.Черкаси
              </p>
            </div>
            <div className="mt-8 grid gap-3">
              <LinkButton
                href={SITE_SOCIAL_LINKS.instagram.href}
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                showIcon={false}
                className="h-auto min-h-14 justify-between rounded-2xl border-rose-100 bg-rose-50/70 px-4 py-3 text-left text-base text-gray-900 hover:border-rose-500 sm:min-h-16 sm:px-5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-transparent text-rose-600">
                    <Instagram className="h-5 w-5" />
                  </span>
                  Instagram
                </span>
                <ArrowRight className="h-4 w-4 text-rose-500 transition group-hover:translate-x-1" />
              </LinkButton>
              <LinkButton
                href={SITE_SOCIAL_LINKS.facebook.href}
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                showIcon={false}
                className="h-auto min-h-14 justify-between rounded-2xl border-sky-100 bg-sky-50/70 px-4 py-3 text-left text-base text-gray-900 hover:border-sky-500 sm:min-h-16 sm:px-5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-transparent text-sky-600">
                    <Facebook className="h-5 w-5" />
                  </span>
                  Facebook
                </span>
                <ArrowRight className="h-4 w-4 text-sky-500 transition group-hover:translate-x-1" />
              </LinkButton>
              <LinkButton
                href={SITE_SOCIAL_LINKS.chystota.href}
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                showIcon={false}
                className="h-auto min-h-14 justify-between rounded-2xl border-emerald-100 bg-emerald-50/70 px-4 py-3 text-left text-base text-gray-900 hover:border-emerald-500 sm:min-h-16 sm:px-5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-transparent text-emerald-600">
                    <Globe2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 leading-tight">Черкаська служба чистоти</span>
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-500 transition group-hover:translate-x-1" />
              </LinkButton>
            </div>
          </div>

          <div className="rounded-[24px] border border-orange-100 bg-white/86 p-4 shadow-sm sm:rounded-[28px] sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Як нас знайти?
            </p>
            <h2 className="mt-4 text-2xl font-extrabold text-text-main sm:text-3xl">
              Ми на карті
            </h2>
            <iframe
              title="Мапа розташування центру допомоги тваринам"
              src={`${SITE_CONTACTS.mapHref}&output=embed`}
              className="mt-5 h-[18rem] w-full rounded-2xl sm:h-[22rem] lg:h-105"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
