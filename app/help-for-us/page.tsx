import {
  Bone,
  CalendarCheck,
  Clock,
  Droplets,
  Heart,
  HeartHandshake,
  Layers,
  Link2,
  Package,
  PawPrint,
  Phone,
  Pill,
  ScrollText,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  WalletIcon,
} from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import Section from '@/components/ui/Section'
import { LinkButton } from '@/components/ui/Button'
import { BorderBeam } from '@/components/ui/border-beam'
import helpDogsImage from '@/public/DogHelp.png'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import { getSiteSettings } from '@/lib/site-settings'
import { getPublishedReports } from '@/lib/public-reports'
import { getPublicAnimals } from '@/lib/animals'
import { buildDonateHref } from '@/lib/donate-search-params'
import DonationBanner from '@/components/DonationBanner'

const helpWays = [
  {
    icon: WalletIcon,
    title: 'Фінансова допомога',
    text: 'Донати закривають корм, лікування, вакцинацію, стерилізацію та щоденний догляд.',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    bar: 'bg-gradient-to-r from-orange-400 to-amber-300',
    iconColor: 'text-orange-500',
  },
  {
    icon: Users,
    title: 'Волонтерство',
    text: 'Вигул, соціалізація, фото, допомога на подіях і підтримка тварин поруч.',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    bar: 'bg-gradient-to-r from-sky-400 to-blue-300',
    iconColor: 'text-sky-500',
  },
  {
    icon: Package,
    title: 'Матеріальна допомога',
    text: 'Корм, підстилки, іграшки, амуніція, засоби гігієни та ветеринарні препарати.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bar: 'bg-gradient-to-r from-emerald-400 to-teal-300',
    iconColor: 'text-emerald-500',
  },
]

const supplies = [
  { name: 'Сухий корм для собак та котів', icon: Bone, color: 'bg-orange-50 text-orange-500 border-orange-100' },
  { name: 'Консерви та вологий корм', icon: Package, color: 'bg-amber-50 text-amber-500 border-amber-100' },
  { name: 'Миски для їжі та води', icon: Droplets, color: 'bg-sky-50 text-sky-500 border-sky-100' },
  { name: 'Лежанки та підстилки', icon: Layers, color: 'bg-violet-50 text-violet-500 border-violet-100' },
  { name: 'Іграшки для тварин', icon: Star, color: 'bg-yellow-50 text-yellow-500 border-yellow-100' },
  { name: 'Ветеринарні препарати', icon: Pill, color: 'bg-rose-50 text-rose-500 border-rose-100' },
  { name: 'Засоби гігієни та догляду', icon: Sparkles, color: 'bg-teal-50 text-teal-500 border-teal-100' },
  { name: 'Повідці, нашийники, шлеї', icon: Link2, color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
]

const volunteerRoles = [
  {
    title: 'Прогулянки з собаками',
    description: `${SITE_CONTACTS.walkSchedule} за попереднім записом.`,
    time: SITE_CONTACTS.walkSchedule,
    icon: PawPrint,
    accent: 'bg-orange-50 text-orange-500',
  },
  {
    title: 'Соціалізація тварин',
    description: 'Спокійне спілкування, ігри та допомога тваринам звикати до людей.',
    time: 'Гнучко',
    icon: Heart,
    accent: 'bg-rose-50 text-rose-500',
  },
  {
    title: 'Фото та відео',
    description: 'Контент для соцмереж, щоб тварини швидше знаходили родини.',
    time: 'За домовленістю',
    icon: Star,
    accent: 'bg-yellow-50 text-yellow-500',
  },
  {
    title: 'Транспортна допомога',
    description: 'Перевезення тварин або необхідних речей у межах міста.',
    time: 'За потреби',
    icon: CalendarCheck,
    accent: 'bg-sky-50 text-sky-500',
  },
]

const joinSteps = [
  {
    icon: Phone,
    title: "Зв'яжіться з нами",
    description: 'Зателефонуйте або напишіть — ми розповімо все про формати участі.',
    accent: 'bg-orange-500',
  },
  {
    icon: CalendarCheck,
    title: 'Узгодьте деталі',
    description: 'Оберіть зручний день, формат допомоги та пройдіть короткий інструктаж.',
    accent: 'bg-sky-500',
  },
  {
    icon: HeartHandshake,
    title: 'Допомагайте разом',
    description: 'Приходьте у зручний час і приєднуйтесь до нашої команди.',
    accent: 'bg-emerald-500',
  },
]

export default async function HelpForUsPage() {
  const [settings, reports, { animals: featuredAnimals }] = await Promise.all([
    getSiteSettings(),
    getPublishedReports(),
    getPublicAnimals({ from: 0, to: 6 }),
  ])

  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />

      {/* ── Hero ── */}
      <PageHero
        eyebrow="Кожна допомога має значення"
        title="Як ви можете допомогти центру"
        description="Кожен внесок допомагає тваринам отримувати необхідний догляд, лікування, харчування та шанс знайти нову родину. Ви можете підтримати центр фінансово, стати волонтером або передати необхідні речі для щоденної турботи."
        icon={Heart}
      >
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white p-3 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <div className="relative min-h-105 overflow-hidden rounded-[26px] border border-orange-100 bg-gray-950">
            <img src={helpDogsImage.src} alt="Допомога тваринам" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-gray-950/10 to-transparent" />
            <div className="absolute right-5 bottom-5 left-5">
              <p className="max-w-sm text-3xl font-black leading-tight text-white drop-shadow">Вони потребують, ми допомагаємо</p>
            </div>
          </div>
        </div>
      </PageHero>

      <Section className="mt-14">
        {/* ── 3 Help Ways ── */}
        <div className={`grid gap-5 ${settings.donationsEnabled ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {helpWays
            .filter((w) => w.title !== 'Фінансова допомога' || settings.donationsEnabled)
            .map((way) => {
              const Icon = way.icon
              return (
                <article
                  key={way.title}
                  className={`group relative overflow-hidden rounded-4xl border ${way.bg} ${way.border} p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(15,23,42,0.10)]`}
                >
                  {/* Top accent bar */}
                  <div className={`absolute inset-x-0 top-0 h-[3px] ${way.bar}`} />

                  <Icon className={`mb-6 h-11 w-11 ${way.iconColor}`} />

                  <h2 className="text-2xl font-black text-gray-950">{way.title}</h2>
                  <p className="mt-3 leading-7 text-gray-600">{way.text}</p>

                  {/* Bottom accent line */}
                  <div
                    className={`mt-8 h-[3px] w-10 rounded-full ${way.bar} opacity-70 transition-all duration-300 group-hover:w-16 group-hover:opacity-100`}
                  />
                </article>
              )
            })}
        </div>

        {/* ── Financial Support + Reports ── */}
        {(settings.donationsEnabled || (settings.reportsBlockEnabled && reports.length > 0)) && (
          <DonationBanner
            donationsEnabled={settings.donationsEnabled}
            amounts={settings.donationAmounts}
            description={settings.donationDescription}
            animals={featuredAnimals.map((a) => ({
              id: a.id,
              name: a.name,
              imageUrl: a.imageUrl,
              donateHref: buildDonateHref({ animalId: a.id, gift: 'treat', amount: 150 }),
            }))}
            reports={settings.reportsBlockEnabled ? reports : []}
          />
        )}

        {/* ── Volunteer Section ── */}
        <SectionFrame as="section" className="mt-14 grid gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:p-8">
          {/* Volunteer roles */}
          <div className="rounded-[36px] border border-gray-100 bg-white p-6 sm:p-8">
            <div className="mb-8 max-w-2xl">
              <Users className="mb-4 h-10 w-10 text-orange-500" />
              <h2 className="text-3xl font-black text-gray-950">Станьте волонтером</h2>
              <p className="mt-4 leading-7 text-gray-600">
                Найпростіший формат для старту — записатися на вихідні прогулянки. Це допомагає тваринам залишатися активними, спокійнішими
                та краще соціалізованими.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {volunteerRoles.map((role) => {
                const Icon = role.icon
                return (
                  <article
                    key={role.title}
                    className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
                  >
                    <div className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl ${role.accent}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-950">{role.title}</h3>
                    <p className="mt-2 leading-7 text-gray-600">{role.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
                      <Clock className="h-4 w-4" />
                      {role.time}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* How to join — timeline */}
          <div className="overflow-hidden rounded-[36px] border border-orange-100 bg-orange-50/70">
            <div className="relative h-52">
              <img src="/dogs.png" alt="Собаки" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/30 to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-black text-gray-950">Як долучитися</h2>
              <p className="mt-2 text-gray-500">Три кроки, що займуть не більше хвилини</p>

              <ol className="relative mt-8 space-y-0">
                {joinSteps.map((step, index) => {
                  const Icon = step.icon
                  const isLast = index === joinSteps.length - 1
                  return (
                    <li key={step.title} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md ${step.accent}`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        {!isLast && <span className="my-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-gray-300 to-transparent" />}
                      </div>
                      <div className={isLast ? 'pb-0' : 'pb-8'}>
                        <h3 className="pt-2 text-lg font-extrabold text-gray-950">{step.title}</h3>
                        <p className="mt-1 leading-7 text-gray-600">{step.description}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <LinkButton href={SITE_ROUTES.contacts} size="lg" className="mt-8 w-full">
                Перейти до контактів
              </LinkButton>
            </div>
          </div>
        </SectionFrame>

        {/* ── Supplies ── */}
        <SectionFrame as="section" className="mt-14 p-6 sm:p-8">
          <div id="necessary-things" className="scroll-mt-24" />
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <Package className="mx-auto mb-4 h-11 w-11 text-orange-500" />
            <h2 className="text-3xl font-black text-gray-950">Необхідні речі</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Ці речі потрібні центру постійно. Їх можна передати особисто або погодити доставку телефоном.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supplies.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.name}
                  className="group flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-100 hover:shadow-md"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium leading-5 text-gray-700">{item.name}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl">
            <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center">
              <BorderBeam size={200} duration={10} colorFrom="#f27438" colorTo="#fbbf24" borderWidth={1.5} />
              <p className="font-extrabold text-gray-800">Адреса для передачі допомоги: м. Черкаси, вул. Івана Мазепи, 117</p>
              <p className="mt-2 text-gray-600">Перед візитом краще зателефонувати, щоб узгодити час.</p>
            </div>
          </div>
        </SectionFrame>
      </Section>

      {/* CTA */}
      <Section className="py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: PawPrint,
              iconColor: 'text-orange-500',
              iconBg: 'bg-orange-50',
              title: 'Книга хвостиків',
              description: 'Понад 500 тварин чекають на свою родину. Можливо, твій майбутній друг вже тут.',
              href: SITE_ROUTES.animals,
              label: 'Переглянути тварин',
              glow: 'rgba(242,116,56,0.12)',
              border: 'border-orange-100',
            },
            {
              icon: Users,
              iconColor: 'text-sky-500',
              iconBg: 'bg-sky-50',
              title: 'Прогулянки',
              description: 'Вихідні прогулянки з собаками — найпростіший спосіб допомогти та провести час з користю.',
              href: SITE_ROUTES.walks,
              label: 'Записатися',
              glow: 'rgba(14,165,233,0.12)',
              border: 'border-sky-100',
            },
            {
              icon: Phone,
              iconColor: 'text-emerald-500',
              iconBg: 'bg-emerald-50',
              title: "Зв'яжіться з нами",
              description: "Маєте питання щодо допомоги або послуг? Ми завжди на зв'язку та раді відповісти.",
              href: SITE_ROUTES.contacts,
              label: 'Контакти',
              glow: 'rgba(16,185,129,0.12)',
              border: 'border-emerald-100',
            },
            {
              icon: Stethoscope,
              iconColor: 'text-violet-500',
              iconBg: 'bg-violet-50',
              title: 'Послуги центру',
              description: 'Ветеринарна допомога, стерилізація, вакцинація та догляд для ваших тварин.',
              href: SITE_ROUTES.services,
              label: 'Переглянути послуги',
              glow: 'rgba(139,92,246,0.12)',
              border: 'border-violet-100',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className={`relative flex flex-col overflow-hidden rounded-4xl border bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(15,23,42,0.10)] ${item.border}`}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 180% 140% at 90% -20%, ${item.glow}, transparent 60%)` }}
                />
                <span className={`relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg}`}>
                  <Icon className={`h-6 w-6 ${item.iconColor}`} />
                </span>
                <h3 className="relative text-2xl font-black text-gray-950">{item.title}</h3>
                <p className="relative mt-3 leading-7 text-gray-500">{item.description}</p>
                <div className="relative mt-auto pt-8">
                  <LinkButton href={item.href} size="lg" className="w-full">
                    {item.label}
                  </LinkButton>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </main>
  )
}
