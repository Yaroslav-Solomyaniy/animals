'use client'

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  MessageCircle,
  Microscope,
  PawPrint,
  Phone,
  Receipt,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { BorderBeam } from '@/components/ui/border-beam'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import Stack from '@/components/ui/Stack'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import NeedService from '@/components/need-service'
import { cn } from '@/lib/utils'

const services = [
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
    tone: 'border-sky-100 bg-sky-50/70 text-sky-700',
    beamFrom: '#38bdf8',
    beamTo: '#f97316',
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
    tone: 'border-violet-100 bg-violet-50/70 text-violet-700',
    beamFrom: '#a78bfa',
    beamTo: '#38bdf8',
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
    tone: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
    beamFrom: '#22c55e',
    beamTo: '#38bdf8',
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
    tone: 'border-orange-100 bg-orange-50/70 text-orange-700',
    beamFrom: '#fb923c',
    beamTo: '#f43f5e',
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
    tone: 'border-rose-100 bg-rose-50/70 text-rose-700',
    beamFrom: '#fb7185',
    beamTo: '#f97316',
  },
  {
    icon: Shield,
    title: 'Гуманний відлов і транспортування',
    description: 'Безпечна робота з безпритульними тваринами, транспортування до центру та первинний ветогляд.',
    features: ['Гуманні методи відлову', 'Безпечна фіксація тварини', 'Транспортування до центру', 'Оцінка стану після прибуття'],
    tone: 'border-cyan-100 bg-cyan-50/70 text-cyan-700',
    beamFrom: '#06b6d4',
    beamTo: '#22c55e',
  },
]

const heroSteps = [
  {
    icon: Stethoscope,
    label: 'Огляд',
    title: 'Уважний прийом',
    text: 'Починаємо з детального клінічного огляду, збору анамнезу та аналізу ваших скарг. Пояснюємо кожен крок і одразу даємо зрозумілі, практичні рекомендації без складних термінів.',
    className: 'lg:rotate-[2deg] lg:translate-y-8',
    color: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    icon: Microscope,
    label: 'Діагностика',
    title: 'Сучасне обладнання',
    text: 'Використовуємо сучасні методи діагностики для точного визначення стану. Контролюємо динаміку, за потреби призначаємо додаткові обстеження та готуємо до процедур.',
    className: 'lg:rotate-[3deg]',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    icon: HeartPulse,
    label: 'Лікування',
    title: 'План і супровід',
    text: 'Формуємо індивідуальний план лікування та супроводжуємо на кожному етапі. Пояснюємо, що саме робимо, навіщо це потрібно і як правильно відновлюватись після процедур.',
    className: 'lg:rotate-[4deg] lg:translate-y-12',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    icon: MessageCircle,
    label: 'Підтримка',
    title: 'Завжди на звʼязку',
    text: 'Ми поруч не лише під час прийому, а й після нього. Відповідаємо на запитання, допомагаємо розібратись із рекомендаціями та коригуємо лікування за потреби. Ви завжди можете звернутись і отримати підтримку.',
    className: 'lg:rotate-[20deg] lg:translate-y-1',
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

type PriceItem = {
  name: string
  price: string
  unit?: string
  note?: string
}

type PriceCategory = {
  icon: LucideIcon
  title: string
  tone: string
  priceClass: string
  items: Array<PriceItem>
}

const priceCategories: Array<PriceCategory> = [
  {
    icon: Stethoscope,
    title: 'Огляд та лікування',
    tone: 'border-sky-100 bg-sky-50 text-sky-700',
    priceClass: 'text-sky-600',
    items: [
      { name: 'Огляд ветеринарного лікаря', price: '200 ₴' },
      { name: 'Стерилізація, до 5 кг', price: '500 ₴' },
      { name: 'Стерилізація, до 10 кг', price: '600 ₴' },
      { name: 'Стерилізація, до 20 кг', price: '650 ₴' },
      { name: 'Стерилізація, до 30 кг', price: '850 ₴' },
      { name: 'Стерилізація, до 40 кг', price: '1000 ₴' },
      { name: 'Стерилізація, від 41 кг', price: '1100 ₴' },
      { name: 'УЗД-діагностика', price: '250 ₴' },
      { name: 'Вакцинація', price: '20 ₴', note: 'без вартості вакцини' },
      { name: 'Ін’єкція', price: '5 ₴' },
      { name: 'Лікувальні препарати', price: '20 ₴', note: 'без вартості препаратів' },
      { name: 'Вимушена евтаназія', price: 'від 500 ₴' },
    ],
  },
  {
    icon: BedDouble,
    title: 'Проживання та харчування',
    tone: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    priceClass: 'text-emerald-600',
    items: [
      { name: 'Проживання у стаціонарі, до 20 кг', price: '80 ₴', unit: '/ день' },
      { name: 'Проживання у стаціонарі, понад 20 кг', price: '120 ₴', unit: '/ день' },
      { name: 'Харчування, до 20 кг', price: '120 ₴', unit: '/ день' },
      { name: 'Лікувальне харчування, до 20 кг', price: '150 ₴', unit: '/ день' },
      { name: 'Харчування, понад 20 кг', price: '150 ₴', unit: '/ день' },
      { name: 'Лікувальне харчування, понад 20 кг', price: '180 ₴', unit: '/ день' },
    ],
  },
  {
    icon: Sparkles,
    title: 'Додаткові послуги',
    tone: 'border-violet-100 bg-violet-50 text-violet-700',
    priceClass: 'text-violet-600',
    items: [
      { name: 'Доставка автомобілем по місту', price: '30 ₴', unit: '/ км' },
      { name: 'Чіпування тварини', price: '300 ₴' },
    ],
  },
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'directions' | 'prices'>('directions')
  const priceItemsCount = priceCategories.reduce((total, category) => total + category.items.length, 0)

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

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="relative mx-auto max-w-336 overflow-hidden p-4 sm:p-6 lg:p-8">
          <BorderBeam size={280} duration={12} colorFrom="#f97316" colorTo="#22d3ee" borderWidth={1.5} />

          <div className="relative mb-10 border-b border-orange-100/70 pb-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-700">
              <Sparkles className="h-4 w-4" />
              Послуги та вартість
            </span>
            <h2 className="max-w-3xl text-3xl font-black text-gray-950 sm:text-4xl">Що ми робимо і скільки це коштує</h2>
            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
              У центрі можна отримати ветеринарну допомогу для безпритульних тварин і комерційні послуги для домашніх улюбленців:
              огляд, профілактику, вакцинацію, стерилізацію, чіпування та супровід після процедур. Нижче — напрямки роботи та
              актуальний прайс-лист.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                <PawPrint className="h-4 w-4 text-primary" />
                {services.length} напрямків роботи
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                <Receipt className="h-4 w-4 text-primary" />
                {priceItemsCount} позицій у прайсі
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                <CalendarCheck className="h-4 w-4 text-primary" />
                Ціни з ПДВ, діють з 01.01.2026
              </span>
              <LinkButton href={SITE_ROUTES.contacts} size="lg" className="ml-auto rounded-2xl">
                Записатися на послугу
                <ArrowRight className="h-5 w-5" />
              </LinkButton>
            </div>
          </div>

          <div className="relative mb-8 inline-flex gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('directions')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition',
                activeTab === 'directions' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-800',
              )}
            >
              <PawPrint className="h-4 w-4" />
              Напрямки роботи
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prices')}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition',
                activeTab === 'prices' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-800',
              )}
            >
              <Receipt className="h-4 w-4" />
              Вартість послуг
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'directions' ? (
              <motion.div
                key="directions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="grid gap-6 lg:grid-cols-3"
              >
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <article
                      key={service.title}
                      className="group relative flex overflow-hidden rounded-[32px] border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8"
                    >
                      <BorderBeam
                        size={150}
                        duration={8}
                        delay={index * 0.8}
                        colorFrom={service.beamFrom}
                        colorTo={service.beamTo}
                        borderWidth={2}
                      />
                      <div className="relative z-10 flex w-full flex-col">
                        <span className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${service.tone}`}>
                          <Icon className="h-8 w-8" />
                        </span>
                        <h2 className="text-2xl font-black text-gray-950">{service.title}</h2>
                        <p className="mt-3 leading-7 text-gray-600">{service.description}</p>
                        <div className="mt-7 space-y-3">
                          {service.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="prices"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {priceCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.title} className="rounded-[28px] border border-gray-100 bg-[#fffaf4] p-5 sm:p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${category.tone}`}>
                          <Icon className="h-6 w-6" />
                        </span>
                        <h3 className="text-xl font-black text-gray-950">{category.title}</h3>
                      </div>
                      <div
                        className={cn(
                          'grid gap-3',
                          category.items.length <= 2 ? 'max-w-md grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
                        )}
                      >
                        {category.items.map((item) => (
                          <div
                            key={item.name}
                            className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
                          >
                            <p className={`text-2xl font-black ${category.priceClass}`}>
                              {item.price}
                              {item.unit && <span className="text-sm font-bold text-gray-400"> {item.unit}</span>}
                            </p>
                            <p className="mt-2 text-sm font-bold leading-snug text-gray-700">{item.name}</p>
                            {item.note && <p className="mt-1 text-xs italic text-gray-400">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </SectionFrame>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="orange-neon mx-auto max-w-336 rounded-[36px] bg-gray-950 p-6 text-white sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">
                <Activity className="h-4 w-4" />
                Більше, ніж базовий огляд
              </span>
              <h2 className="text-3xl font-black sm:text-4xl">Працюємо з профілактикою, лікуванням і відновленням</h2>
              <p className="mt-4 leading-7 text-white/70">
                Ви можете звернутися не лише в екстреній ситуації. Регулярний огляд, вакцинація, контроль паразитів і своєчасна діагностика
                часто дешевші та спокійніші, ніж лікування ускладнень.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {vetDirections.map((direction) => (
                <span
                  key={direction}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85"
                >
                  {direction}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <NeedService />
    </main>
  )
}
