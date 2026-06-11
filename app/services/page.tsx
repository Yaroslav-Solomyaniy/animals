'use client'

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CalendarCheck,
  ClipboardCheck,
  HeartPulse,
  type LucideIcon,
  MessageCircle,
  Microscope,
  PawPrint,
  Phone,
  Receipt,
  Shield,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { motion } from 'motion/react'

import PageHero from '@/components/ui/PageHero'
import Stack from '@/components/ui/Stack'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import { cn } from '@/lib/utils'

type PriceItem = {
  name: string
  price: string
  unit?: string
  note?: string
}

type ServiceCategory = {
  icon: LucideIcon
  title: string
  description: string
  features: Array<string>
  tone: string
  priceClass: string
  glow: string
  pricePanel: string
  beamFrom: string
  beamTo: string
  prices: Array<PriceItem>
}

const serviceCategories: Array<ServiceCategory> = [
  {
    icon: Stethoscope,
    title: 'Первинний прийом і терапія',
    description: 'Клінічний огляд, збір анамнезу, оцінка загального стану та складання плану лікування.',
    features: [
      'Аускультація серця та легень',
      'Оцінка слизових, шкіри, шерсті та лімфовузлів',
      'Вимірювання температури і базових показників',
      'Призначення терапії та контроль динаміки',
    ],
    tone: 'border-sky-200/80 bg-sky-500/10 text-sky-700',
    priceClass: 'text-sky-600',
    glow: 'bg-sky-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(224,242,254,0.95)_0%,rgba(255,255,255,0.88)_48%,rgba(255,247,237,0.75)_100%)]',
    beamFrom: '#38bdf8',
    beamTo: '#f97316',
    prices: [
      { name: 'Огляд ветеринарного лікаря', price: '200 ₴' },
      { name: 'Ін’єкція', price: '5 ₴' },
      { name: 'Лікувальні препарати', price: '20 ₴', note: 'без вартості препаратів' },
    ],
  },
  {
    icon: Microscope,
    title: 'Діагностика та обстеження',
    description: 'Сучасний підхід до діагностики: від первинного огляду до інструментальних і лабораторних досліджень.',
    features: [
      'Базова лабораторна діагностика',
      'Оцінка стану перед операціями',
      'Контроль після лікування',
      'Підбір подальшого маршруту обстеження',
    ],
    tone: 'border-violet-200/80 bg-violet-500/10 text-violet-700',
    priceClass: 'text-violet-600',
    glow: 'bg-violet-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(237,233,254,0.95)_0%,rgba(255,255,255,0.9)_55%,rgba(224,242,254,0.7)_100%)]',
    beamFrom: '#a78bfa',
    beamTo: '#38bdf8',
    prices: [{ name: 'УЗД-діагностика', price: '250 ₴' }],
  },
  {
    icon: Syringe,
    title: 'Вакцинація і профілактика',
    description: 'Профілактичні щеплення, обробки від паразитів і формування індивідуального графіка догляду.',
    features: [
      'Вакцинація від сказу та інфекцій',
      'Дегельмінтизація та протипаразитарний захист',
      'Підбір графіка ревакцинації',
      'Консультація щодо домашнього догляду',
    ],
    tone: 'border-emerald-200/80 bg-emerald-500/10 text-emerald-700',
    priceClass: 'text-emerald-600',
    glow: 'bg-emerald-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(209,250,229,0.95)_0%,rgba(255,255,255,0.9)_52%,rgba(224,242,254,0.65)_100%)]',
    beamFrom: '#22c55e',
    beamTo: '#38bdf8',
    prices: [{ name: 'Вакцинація', price: '20 ₴', note: 'без вартості вакцини' }],
  },
  {
    icon: HeartPulse,
    title: 'Хірургія та стерилізація',
    description: 'Планові оперативні втручання, стерилізація, кастрація та післяопераційний супровід.',
    features: [
      'Передопераційний огляд',
      'Стерильні умови та сучасний інструментарій',
      'Контроль стану після наркозу',
      'Рекомендації з реабілітації вдома',
    ],
    tone: 'border-orange-200/80 bg-orange-500/10 text-orange-700',
    priceClass: 'text-orange-600',
    glow: 'bg-orange-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(255,237,213,0.96)_0%,rgba(255,255,255,0.9)_42%,rgba(254,226,226,0.72)_100%)]',
    beamFrom: '#fb923c',
    beamTo: '#f43f5e',
    prices: [
      { name: 'Стерилізація, до 5 кг', price: '500 ₴' },
      { name: 'Стерилізація, до 10 кг', price: '600 ₴' },
      { name: 'Стерилізація, до 20 кг', price: '650 ₴' },
      { name: 'Стерилізація, до 30 кг', price: '850 ₴' },
      { name: 'Стерилізація, до 40 кг', price: '1000 ₴' },
      { name: 'Стерилізація, від 41 кг', price: '1100 ₴' },
      { name: 'Вимушена евтаназія', price: 'від 500 ₴' },
    ],
  },
  {
    icon: BedDouble,
    title: 'Проживання та харчування',
    description: 'Стаціонарний догляд після операцій, лікування та реабілітації з індивідуальним харчуванням.',
    features: [
      'Проживання у стаціонарі під наглядом',
      'Звичайне та лікувальне харчування',
      'Контроль стану під час відновлення',
      'Догляд після хірургічних втручань',
    ],
    tone: 'border-amber-200/80 bg-amber-500/10 text-amber-700',
    priceClass: 'text-amber-600',
    glow: 'bg-amber-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(254,243,199,0.96)_0%,rgba(255,255,255,0.9)_50%,rgba(209,250,229,0.68)_100%)]',
    beamFrom: '#f59e0b',
    beamTo: '#22c55e',
    prices: [
      { name: 'Проживання у стаціонарі, до 20 кг', price: '80 ₴', unit: '/ день' },
      { name: 'Проживання у стаціонарі, понад 20 кг', price: '120 ₴', unit: '/ день' },
      { name: 'Харчування, до 20 кг', price: '120 ₴', unit: '/ день' },
      { name: 'Лікувальне харчування, до 20 кг', price: '150 ₴', unit: '/ день' },
      { name: 'Харчування, понад 20 кг', price: '150 ₴', unit: '/ день' },
      { name: 'Лікувальне харчування, понад 20 кг', price: '180 ₴', unit: '/ день' },
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Документи і супровід',
    description: 'Допомога з ветеринарними записами, консультаціями після усиновлення та планом профілактики.',
    features: [
      'Ветеринарні рекомендації після прийому',
      'Пам’ятка з догляду за твариною',
      'Підготовка до вакцинації або операції',
      'Пояснення діагнозу людською мовою',
    ],
    tone: 'border-rose-200/80 bg-rose-500/10 text-rose-700',
    priceClass: 'text-rose-600',
    glow: 'bg-rose-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(255,228,230,0.95)_0%,rgba(255,255,255,0.92)_55%,rgba(255,247,237,0.7)_100%)]',
    beamFrom: '#fb7185',
    beamTo: '#f97316',
    prices: [],
  },
  {
    icon: Shield,
    title: 'Гуманний відлов і транспортування',
    description: 'Безпечна робота з безпритульними тваринами, транспортування до центру та первинний ветогляд.',
    features: ['Гуманні методи відлову', 'Безпечна фіксація тварини', 'Транспортування до центру', 'Оцінка стану після прибуття'],
    tone: 'border-cyan-200/80 bg-cyan-500/10 text-cyan-700',
    priceClass: 'text-cyan-600',
    glow: 'bg-cyan-400',
    pricePanel: 'bg-[linear-gradient(145deg,rgba(207,250,254,0.96)_0%,rgba(255,255,255,0.9)_52%,rgba(209,250,229,0.68)_100%)]',
    beamFrom: '#06b6d4',
    beamTo: '#22c55e',
    prices: [
      { name: 'Доставка автомобілем по місту', price: '30 ₴', unit: '/ км' },
      { name: 'Чіпування тварини', price: '300 ₴' },
    ],
  },
]

const heroSteps = [
  {
    icon: Stethoscope,
    label: 'Огляд',
    title: 'Уважний прийом',
    text: 'Починаємо з детального клінічного огляду, збору анамнезу та аналізу ваших скарг. Пояснюємо кожен крок і одразу даємо зрозумілі, практичні рекомендації без складних термінів.',
    color: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    icon: Microscope,
    label: 'Діагностика',
    title: 'Сучасне обладнання',
    text: 'Використовуємо сучасні методи діагностики для точного визначення стану. Контролюємо динаміку, за потреби призначаємо додаткові обстеження та готуємо до процедур.',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    icon: HeartPulse,
    label: 'Лікування',
    title: 'План і супровід',
    text: 'Формуємо індивідуальний план лікування та супроводжуємо на кожному етапі. Пояснюємо, що саме робимо, навіщо це потрібно і як правильно відновлюватись після процедур.',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    icon: MessageCircle,
    label: 'Підтримка',
    title: 'Завжди на звʼязку',
    text: 'Ми поруч не лише під час прийому, а й після нього. Відповідаємо на запитання, допомагаємо розібратись із рекомендаціями та коригуємо лікування за потреби. Ви завжди можете звернутись і отримати підтримку.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
]

const vetDirections = [
  'Клінічний огляд',
  'Терапевтичне лікування',
  'Лабораторна діагностика',
  'Вакцинація',
  'Стерилізація',
  'Кастрація',
  'Обробка від паразитів',
  'Чіпування',
  'Післяопераційний догляд',
  'Реабілітація після травм',
  'Консультація з харчування',
  'Підготовка до усиновлення',
]

const statPills = [
  { icon: PawPrint, label: 'напрямків', getValue: () => serviceCategories.length },
  { icon: Receipt, label: 'позицій у прайсі', getValue: () => serviceCategories.reduce((t, c) => t + c.prices.length, 0) },
  { icon: CalendarCheck, label: 'з ПДВ', getValue: () => '01.2026' },
] as const

function ServicePricePanel({ service, stacked }: { service: ServiceCategory; stacked: boolean }) {
  if (service.prices.length === 0) {
    return (
      <div className={cn('relative flex min-h-full flex-col justify-center p-6 sm:p-8', service.pricePanel)}>
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-primary shadow-sm">
          <MessageCircle className="h-5 w-5" />
        </span>
        <p className="text-lg font-black text-gray-950">Індивідуальний супровід</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
          Вартість залежить від обсягу допомоги — уточнюйте при записі або за телефоном.
        </p>
        <LinkButton href={SITE_ROUTES.contacts} size="lg" className="mt-5 w-fit justify-center rounded-2xl !h-auto min-h-12 px-6 py-3">
          Уточнити вартість
          <ArrowRight className="h-5 w-5" />
        </LinkButton>
      </div>
    )
  }

  const priceGridClass = stacked
    ? service.prices.length > 3
      ? 'grid gap-2 sm:grid-cols-2'
      : 'grid gap-2 sm:grid-cols-2 lg:max-w-xl'
    : service.prices.length > 4
      ? 'grid gap-2 sm:grid-cols-2'
      : 'space-y-2'

  return (
    <div className={cn('relative flex min-h-full flex-col p-6 sm:p-8', service.pricePanel)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-gray-400" />
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Вартість</p>
        </div>
        <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-bold text-gray-500 backdrop-blur-sm">
          {service.prices.length} {service.prices.length === 1 ? 'позиція' : 'позицій'}
        </span>
      </div>

      <div className={priceGridClass}>
        {service.prices.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-white/50 bg-white/60 px-4 py-3.5 backdrop-blur-sm transition duration-300 hover:border-orange-200/80 hover:bg-white/90 hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
          >
            <p className="hyphens-none text-sm font-bold leading-relaxed text-gray-700">{item.name}</p>
            <p className={cn('mt-2 text-xl font-black tabular-nums', service.priceClass)}>
              {item.price}
              {item.unit && <span className="ml-1.5 text-sm font-bold text-gray-400">{item.unit}</span>}
            </p>
            {item.note && <p className="mt-1.5 text-xs font-medium text-gray-400">{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceCard({ service, index }: { service: ServiceCategory; index: number }) {
  const Icon = service.icon
  const isFeatured = index === 0
  const useSideBySide = isFeatured

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25) }}
      className={cn(
        'group relative overflow-hidden rounded-[40px] border border-white/80 bg-white/75 shadow-[0_32px_90px_-42px_rgba(15,23,42,0.22)] backdrop-blur-md transition duration-500 hover:border-orange-200/70 hover:shadow-[0_42px_110px_-36px_rgba(242,116,56,0.18)]',
        isFeatured ? 'lg:col-span-2' : ''
      )}
    >
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl', service.glow)}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage: 'url(/noise.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
        }}
      />

      <div className={cn('relative grid', useSideBySide ? 'lg:grid-cols-[1.15fr_minmax(300px,0.85fr)]' : 'grid-cols-1')}>
        <div className="relative p-7 sm:p-9 lg:p-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <span
              className={cn('flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[22px] border backdrop-blur-sm', service.tone)}
            >
              <Icon className="h-8 w-8" />
            </span>
            <span className="rounded-full border border-gray-100 bg-gray-50/90 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-gray-950 sm:text-[1.75rem]">{service.title}</h3>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-gray-600">{service.description}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            {service.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-gray-100/90 bg-gray-50/80 px-3.5 py-2 text-xs font-bold text-gray-600 backdrop-blur-sm transition group-hover:border-orange-100 group-hover:bg-orange-50/70 group-hover:text-orange-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className={cn('border-t border-white/70', useSideBySide ? 'lg:border-l lg:border-t-0' : '')}>
          <ServicePricePanel service={service} stacked={!useSideBySide} />
        </div>
      </div>
    </motion.article>
  )
}

export default function ServicesPage() {
  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />
      <PageHero
        eyebrow="Ветеринарні та комерційні послуги"
        title="Професійна допомога для ваших тварин"
        description="У центрі можна отримати не лише допомогу для безпритульних тварин, а й комерційні ветеринарні послуги для домашніх улюбленців: огляд, профілактику, вакцинацію, стерилізацію, чіпування та супровід після процедур."
        icon={BadgeCheck}
        actions={
          <>
            <LinkButton href={SITE_ROUTES.contacts} size="lg">
              Записатися на послугу
              <ArrowRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton href={SITE_CONTACTS.phoneHref} variant="outline" size="lg">
              <Phone className="h-5 w-5" />
              {SITE_CONTACTS.phoneDisplay}
            </LinkButton>
          </>
        }
      >
        <Stack
          className="max-lg:mt-8 max-lg:max-w-[360px] sm:max-lg:max-w-[430px] lg:min-h-93 lg:-translate-x-36 xl:-translate-x-52 2xl:-translate-x-44"
          items={heroSteps.map((step) => {
            const Icon = step.icon
            return {
              id: step.title,
              content: (
                <>
                  <span className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border ${step.color}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-300">{step.label}</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">{step.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{step.text}</p>
                </>
              ),
            }
          })}
        />
      </PageHero>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="orange-neon relative mx-auto max-w-336 overflow-hidden rounded-[40px] bg-gray-950 p-6 text-white sm:p-8 lg:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200 backdrop-blur-sm">
                <Activity className="h-4 w-4" />
                Більше, ніж базовий огляд
              </span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Працюємо з профілактикою, лікуванням і відновленням</h2>
              <p className="mt-4 leading-7 text-white/70">
                Ви можете звернутися не лише в екстреній ситуації. Регулярний огляд, вакцинація, контроль паразитів і своєчасна діагностика
                часто дешевші та спокійніші, ніж лікування ускладнень.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {vetDirections.map((direction, index) => (
                <motion.span
                  key={direction}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-center text-sm font-semibold text-white/88 backdrop-blur-sm transition hover:border-orange-300/30 hover:bg-white/14"
                >
                  {direction}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[min(92vw,1100px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,116,56,0.12)_0%,transparent_68%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(45,106,79,0.1)_0%,transparent_70%)] blur-3xl"
        />

        <div className="relative mx-auto max-w-336">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="mb-14 lg:mb-16"
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Прайс-лист</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]">
              Прозорі ціни.{' '}
              <span className="bg-linear-to-r from-primary via-orange-500 to-emerald-600 bg-clip-text text-transparent">
                Чесна допомога.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Кожен напрямок — це опис послуги та актуальна вартість в одній картці. Без прихованих доплат і зайвих перемикань між
              розділами.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {statPills.map((pill) => {
                const Icon = pill.icon
                const value = pill.getValue()
                return (
                  <div
                    key={pill.label}
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-lg font-black leading-none text-gray-950">{value}</p>
                      <p className="mt-1 text-xs font-bold text-gray-500">{pill.label}</p>
                    </div>
                  </div>
                )
              })}
              <LinkButton href={SITE_ROUTES.contacts} size="lg" className="ml-auto rounded-2xl">
                Записатися на послугу
                <ArrowRight className="h-5 w-5" />
              </LinkButton>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {serviceCategories.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
