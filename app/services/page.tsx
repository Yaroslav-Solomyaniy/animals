'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  Microscope,
  Phone,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { motion } from 'motion/react'

import { BorderBeam } from '@/components/ui/border-beam'
import PageHero from '@/components/PageHero'
import SectionFrame from '@/components/SectionFrame'
import Stack from '@/components/Stack'
import StorybookDecorations from '@/components/StorybookDecorations'
import { WobbleCard } from '@/components/ui/wobble-card'


const services = [
  {
    icon: Stethoscope,
    title: 'Первинний прийом і терапія',
    description:
      'Клінічний огляд, збір анамнезу, оцінка загального стану та складання плану лікування.',
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
    description:
      'Сучасний підхід до діагностики: від первинного огляду до інструментальних і лабораторних досліджень.',
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
    description:
      'Профілактичні щеплення, обробки від паразитів і формування індивідуального графіка догляду.',
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
    description:
      'Планові оперативні втручання, стерилізація, кастрація та післяопераційний супровід.',
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
    description:
      'Допомога з ветеринарними записами, консультаціями після усиновлення та планом профілактики.',
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
    description:
      'Безпечна робота з безпритульними тваринами, транспортування до центру та первинний ветогляд.',
    features: [
      'Гуманні методи відлову',
      'Безпечна фіксація тварини',
      'Транспортування до центру',
      'Оцінка стану після прибуття',
    ],
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
    text: 'Починаємо з клінічного огляду, анамнезу та зрозумілих рекомендацій.',
    className: 'lg:rotate-[-5deg] lg:translate-y-8',
    color: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    icon: Microscope,
    label: 'Діагностика',
    title: 'Сучасне обладнання',
    text: 'Працюємо з діагностикою, контролем стану та підготовкою до процедур.',
    className: 'lg:rotate-[3deg]',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    icon: HeartPulse,
    label: 'Лікування',
    title: 'План і супровід',
    text: 'Пояснюємо, що робимо, навіщо це потрібно і як доглядати після.',
    className: 'lg:rotate-[-2deg] lg:translate-y-12',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
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

const additionalServices = [
  {
    title: 'Для домашніх тварин',
    text: 'Комерційні ветеринарні послуги для собак і котів: огляд, профілактика, вакцинація, чіпування та консультації.',
    items: ['Собаки', 'Коти', 'Плановий догляд'],
  },
  {
    title: 'Перед операцією',
    text: 'Оцінюємо стан тварини, пояснюємо ризики, готуємо до процедури та даємо рекомендації власнику.',
    items: ['Огляд', 'Підготовка', 'Рекомендації'],
  },
  {
    title: 'Після лікування',
    text: 'Допомагаємо пройти відновлення: контроль динаміки, корекція терапії, догляд за швами та режимом.',
    items: ['Контроль', 'Реабілітація', 'Супровід'],
  },
  {
    title: 'Профілактика',
    text: 'Підбираємо графік вакцинації, обробок від паразитів і план регулярного догляду за твариною.',
    items: ['Вакцини', 'Паразити', 'План догляду'],
  },
]

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
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
            >
              Записатися на послугу
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="tel:+380932966097"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-100 bg-white px-6 py-4 font-bold text-gray-950 transition hover:border-orange-300"
            >
              <Phone className="h-5 w-5 text-orange-500" />
              +38 (093) 296-60-97
            </a>
          </>
        }
      >
        <Stack
          className="lg:min-h-[370px]"
          items={heroSteps.map((step) => {
            const Icon = step.icon
            return {
              id: step.title,
              content: (
                <>
                  <span
                    className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border ${step.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-300">
                    {step.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">
                    {step.title}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {step.text}
                  </p>
                </>
              ),
            }
          })}
        />
      </PageHero>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-10 border-b border-orange-100/70 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Напрямки роботи
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black text-gray-950 sm:text-4xl">
              Ветпослуги, які закривають щоденні потреби тварини
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
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
                    <span
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${service.tone}`}
                    >
                      <Icon className="h-8 w-8" />
                    </span>
                    <h2 className="text-2xl font-black text-gray-950">
                      {service.title}
                    </h2>
                    <p className="mt-3 leading-7 text-gray-600">
                      {service.description}
                    </p>
                    <div className="mt-7 space-y-3">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </SectionFrame>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="orange-neon mx-auto max-w-7xl rounded-[36px] bg-gray-950 p-6 text-white sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">
                <Activity className="h-4 w-4" />
                Більше, ніж базовий огляд
              </span>
              <h2 className="text-3xl font-black sm:text-4xl">
                Працюємо з профілактикою, лікуванням і відновленням
              </h2>
              <p className="mt-4 leading-7 text-white/70">
                Ви можете звернутися не лише в екстреній ситуації. Регулярний
                огляд, вакцинація, контроль паразитів і своєчасна діагностика
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

      <section className="bg-linear-to-br from-orange-500 to-orange-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Потрібна ветеринарна послуга?
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/90">
            Зв’яжіться з нами, опишіть симптоми або потрібну процедуру, і ми
            підкажемо зручний формат запису.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+380932966097"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-orange-600 transition hover:bg-orange-50"
            >
              <Phone className="h-5 w-5" />
              Зателефонувати зараз
            </a>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Написати повідомлення
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <WobbleCard
            containerClassName="bg-white"
            className="px-6 py-8 sm:px-10 lg:px-12"
            beamColorFrom="#f97316"
            beamColorTo="#38bdf8"
            beamSize={220}
            beamDuration={9}
          >
            <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  Комерційні послуги
                </span>
                <h2 className="text-3xl font-black text-gray-950 sm:text-4xl">
                  Для власників собак і котів
                </h2>
                <p className="mt-4 leading-7 text-gray-600">
                  Записуйтеся на планові процедури, профілактику та
                  консультації. Ми пояснюємо діагноз, не лякаємо складними
                  словами і допомагаємо власнику зрозуміти, що саме потрібно
                  тварині.
                </p>
                <Link
                  href="/contacts"
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                >
                  Уточнити послугу
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {additionalServices.map((service) => (
                  <article
                    key={service.title}
                    className="rounded-[24px] border border-gray-100 bg-white/85 p-5 backdrop-blur"
                  >
                    <h3 className="text-xl font-bold text-gray-950">
                      {service.title}
                    </h3>
                    <p className="mt-3 leading-7 text-gray-600">
                      {service.text}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {service.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </WobbleCard>
        </SectionFrame>
      </section>
    </main>
  )
}
