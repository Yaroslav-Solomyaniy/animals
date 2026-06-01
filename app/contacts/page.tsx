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
  PawPrint,
  Phone,
  Send,
  Stethoscope,
} from 'lucide-react'

import BorderGlow from '@/components/ui/BorderGlow'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import {LinkButton} from '@/components/ui/Button'
import {getPublicAnimals} from '@/lib/animals'
import {SITE_CONTACTS, SITE_ROUTES, SITE_SOCIAL_LINKS} from '@/lib/site-config'
import ContactForm from './ContactForm'


const reasons = [
  {
    icon: Footprints,
    title: 'Волонтерські прогулянки',
    text: 'Щовихідних з 11:00 до 14:00 за попереднім записом.',
    color: 'border-sky-100 bg-sky-50/70 text-sky-700',
  },
  {
    icon: HeartHandshake,
    title: 'Усиновлення або знайомство',
    text: 'Допоможемо підібрати собаку за характером і темпом життя.',
    color: 'border-rose-100 bg-rose-50/70 text-rose-700',
  },
  {
    icon: Stethoscope,
    title: 'Комерційні послуги',
    text: 'Для домашніх тварин також доступні окремі послуги центру.',
    color: 'border-violet-100 bg-violet-50/70 text-violet-700',
  },
]

const schedule = [
  ['Понеділок - Четвер', '8:00 - 17:00'],
  ['П’ятниця', '8:00 - 16:00'],
  ['Субота - Неділя', '8:00 - 17:00'],
]

const contactGuideItems = [
  {
    icon: HeartHandshake,
    title: 'Якщо хочете усиновити',
    text: 'Напишіть, кого шукаєте: розмір, вік, характер, умови проживання та чи є інші тварини вдома.',
    tone: 'bg-orange-50 text-primary',
  },
  {
    icon: Footprints,
    title: 'Якщо плануєте прогулянку',
    text: 'Уточніть день, кількість людей і чи маєте досвід прогулянок із собаками.',
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Stethoscope,
    title: 'Якщо потрібні послуги',
    text: 'Опишіть тварину, бажану послугу та зручний час для візиту або консультації.',
    tone: 'bg-emerald-50 text-emerald-600',
  },
]

const sectionClassName = 'px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6'
const contactGradientClassNames = {
  coral: 'contacts-gradient-coral',
  honey: 'contacts-gradient-honey',
  meadow: 'contacts-gradient-meadow',
  river: 'contacts-gradient-river',
  sunrise: 'contacts-gradient-sunrise',
} as const

export default async function ContactsPage() {
  const animals = await getPublicAnimals()

  return (
    <main className="storybook-bg text-text-main">
      <StorybookDecorations />
      <PageHero
        eyebrow="Контакти центру"
        title="Подзвоніть, напишіть нам чи завітайте в гості до улюбленця"
        description="Ми поруч, якщо ви хочете усиновити тварину, записатися на волонтерську прогулянку, підтримати центр або дізнатися про послуги для домашніх улюбленців."
        icon={MessageCircle}
        spacing="compact"
      >
        <div className={`rounded-3xl border border-orange-200/70 p-4 text-text-main shadow-[0_26px_90px_rgba(249,115,22,0.13)] backdrop-blur sm:rounded-[28px] sm:p-6 lg:p-8 ${contactGradientClassNames.sunrise}`}>
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary sm:h-14 sm:w-14">
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
            Швидкий зв’язок
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl lg:text-4xl">
            Обирайте для себе зручний спосіб зв&#39;язатись з нами
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Узгодьте візит, прогулянку, питання щодо послуг або допомоги телефоном. Якщо зручніше письмово - напишіть на пошту підприємства.
          </p>
          <LinkButton
            href={SITE_CONTACTS.phoneHref}
            variant="primary"
            size="lg"
            showIcon={false}
            className="mt-7 h-auto min-h-13 w-full justify-between rounded-2xl px-4 py-3 text-left sm:px-5"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/18 text-white transition-colors duration-300 group-hover:bg-white/25">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-white/75">
                  Зателефонувати
                </span>
                <span className="block truncate text-sm font-black text-white sm:text-base">{SITE_CONTACTS.phoneDisplay}</span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-white" />
          </LinkButton>
          <a
            href={SITE_CONTACTS.emailHref}
            className="group mt-3 flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white/78 px-4 py-3 text-left shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-[0_18px_55px_rgba(249,115,22,0.10)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 sm:px-5"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  Написати нам
                </span>
                <span className="mt-1 block truncate text-base font-extrabold text-text-main">
                  {SITE_CONTACTS.email}
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <div className="mt-3 grid gap-3 text-sm font-semibold sm:grid-cols-2">
            <LinkButton
              href={SITE_ROUTES.animals}
              variant="secondary"
              size="md"
              showIcon={false}
              className="h-auto min-h-12 flex-row justify-start gap-2 rounded-2xl border-orange-100 bg-orange-50/70 px-4 py-3 text-left text-text-main hover:bg-orange-50 sm:min-h-14 sm:flex-col sm:items-start sm:gap-1.5"
            >
              <PawPrint className="h-4 w-4 text-primary" />
              Каталог тварин
            </LinkButton>
            <LinkButton
              href={SITE_ROUTES.services}
              variant="secondary"
              size="md"
              showIcon={false}
              className="h-auto min-h-12 flex-row justify-start gap-2 rounded-2xl border-sky-100 bg-sky-50/70 px-4 py-3 text-left text-text-main hover:bg-sky-50 sm:min-h-14 sm:flex-col sm:items-start sm:gap-1.5"
            >
              <Stethoscope className="h-4 w-4 text-sky-600" />
              Комерційні послуги
            </LinkButton>
            <LinkButton
              href="#contact-form"
              variant="secondary"
              size="md"
              showIcon={false}
              className="h-auto min-h-12 flex-row justify-start gap-2 rounded-2xl border-emerald-100 bg-emerald-50/70 px-4 py-3 text-left text-text-main hover:bg-emerald-50 sm:col-span-2"
            >
              <Send className="h-4 w-4 text-emerald-600" />
              Заповнити форму зворотного зв&#39;язку
            </LinkButton>
          </div>
        </div>
      </PageHero>

      <section className={sectionClassName}>
        <div className="mx-auto grid max-w-336 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:items-stretch">
          <div className={`rounded-[28px] border border-orange-100 p-4 shadow-[0_22px_75px_rgba(249,115,22,0.10)] sm:rounded-4xl sm:p-6 lg:p-7 xl:p-8 ${contactGradientClassNames.honey}`}>
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

            <div className="mt-6 grid gap-3 sm:mt-7">
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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <a
              href={SITE_CONTACTS.mapHref}
              className={`group rounded-[26px] border border-sky-100 p-4 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 sm:rounded-[30px] sm:p-6 ${contactGradientClassNames.river}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-gray-400">
                Адреса
              </p>
              <h3 className="mt-2 text-xl font-extrabold leading-snug text-text-main">
                {SITE_CONTACTS.addressFull}
              </h3>
              <p className="mt-3 leading-7 text-gray-600">
                Перед візитом краще зателефонувати, щоб узгодити зручний час.
              </p>
            </a>

            <a
              id="schedule"
              href="#schedule"
              className={`rounded-[26px] border border-emerald-100 p-4 shadow-sm sm:rounded-[30px] sm:p-6 ${contactGradientClassNames.meadow}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Clock3 className="h-5 w-5" />
              </span>
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-gray-400">
                Години роботи
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-text-main">
                Графік роботи підприємства
              </h3>
              <div className="mt-4 space-y-2">
                {schedule.map(([days, time]) => (
                  <div
                    key={days}
                    className="flex flex-col gap-1 rounded-2xl border border-emerald-100/80 bg-white/82 px-3 py-2 text-sm font-bold sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <span className="min-w-0 text-gray-600">{days}</span>
                    <span className="shrink-0 text-emerald-700">{time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 leading-7 text-gray-600">
                Плануйте візит у зручний час та попередньо узгодьте деталі.
              </p>
            </a>
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
