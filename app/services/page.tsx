'use client'

import {
  Activity,
  BadgeCheck,
  BedDouble,
  ClipboardCheck,
  HeartPulse,
  Loader2,
  type LucideIcon,
  Mail,
  MessageCircle,
  Microscope,
  Phone,
  Receipt,
  Shield,
  ShieldCheck,
  SquarePen,
  Stethoscope,
  Syringe,
  Tag,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import PageHero from '@/components/ui/PageHero'
import Stack from '@/components/ui/Stack'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button, LinkButton } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog'
import { SITE_CONTACTS } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import SectionFrame from '@/components/ui/SectionFrame'
import UkrainianPhoneInput from '@/components/ui/UkrainianPhoneInput'
import SuccessApplication from '@/components/SuccessApplication'

type PriceItem = {
  label: string
  price?: string
}

type Accent = {
  icon: string
  price: string
  border: string
  bar: string
  button: string
}

const ACCENTS = {
  sky: {
    icon: 'bg-sky-50 text-sky-600 ring-sky-100',
    price: 'text-sky-700',
    border: 'hover:border-sky-200',
    bar: 'from-sky-400/70',
    button: 'bg-sky-50 text-sky-700 ring-sky-100 hover:bg-sky-100 hover:text-sky-800 hover:ring-sky-200',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600 ring-violet-100',
    price: 'text-violet-700',
    border: 'hover:border-violet-200',
    bar: 'from-violet-400/70',
    button: 'bg-violet-50 text-violet-700 ring-violet-100 hover:bg-violet-100 hover:text-violet-800 hover:ring-violet-200',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    price: 'text-emerald-700',
    border: 'hover:border-emerald-200',
    bar: 'from-emerald-400/70',
    button: 'bg-emerald-50 text-emerald-700 ring-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 hover:ring-emerald-200',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600 ring-orange-100',
    price: 'text-orange-700',
    border: 'hover:border-orange-200',
    bar: 'from-orange-400/70',
    button: 'bg-orange-50 text-orange-700 ring-orange-100 hover:bg-orange-100 hover:text-orange-800 hover:ring-orange-200',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-100',
    price: 'text-amber-700',
    border: 'hover:border-amber-200',
    bar: 'from-amber-400/70',
    button: 'bg-amber-50 text-amber-700 ring-amber-100 hover:bg-amber-100 hover:text-amber-800 hover:ring-amber-200',
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600 ring-rose-100',
    price: 'text-rose-700',
    border: 'hover:border-rose-200',
    bar: 'from-rose-400/70',
    button: 'bg-rose-50 text-rose-700 ring-rose-100 hover:bg-rose-100 hover:text-rose-800 hover:ring-rose-200',
  },
  cyan: {
    icon: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
    price: 'text-cyan-700',
    border: 'hover:border-cyan-200',
    bar: 'from-cyan-400/70',
    button: 'bg-cyan-50 text-cyan-700 ring-cyan-100 hover:bg-cyan-100 hover:text-cyan-800 hover:ring-cyan-200',
  },
} satisfies Record<string, Accent>

type ServiceCategory = {
  icon: LucideIcon
  title: string
  description: string
  items: Array<PriceItem>
  accent: keyof typeof ACCENTS
  gradient: string
}

const serviceCategories: Array<ServiceCategory> = [
  {
    icon: Stethoscope,
    title: 'Прийом, терапія та діагностика',
    description: 'Клінічний огляд, збір анамнезу, призначення терапії та інструментальна діагностика, зокрема УЗД.',
    accent: 'sky',
    gradient: 'radial-gradient(115% 80% at 100% 0%, rgba(56,189,248,0.08), transparent 55%)',
    items: [
      { label: 'Огляд ветеринарного лікаря', price: '200 ₴' },
      { label: 'Послуга УЗД', price: '250 ₴' },
      { label: 'Ін’єкції', price: '5 ₴' },
      { label: 'Дача лікувальних препаратів (без вартості препаратів)', price: '20 ₴' },
    ],
  },
  {
    icon: Syringe,
    title: 'Вакцинація і профілактика',
    description: 'Профілактичні щеплення, обробки від паразитів і формування індивідуального графіка догляду.',
    accent: 'emerald',
    gradient: 'radial-gradient(120% 90% at 100% 100%, rgba(16,185,129,0.07), transparent 55%)',
    items: [
      { label: 'Вакцинація (без вартості вакцини)', price: '20 ₴' },
      { label: 'Дегельмінтизація та протипаразитарна обробка', price: 'за запитом' },
      { label: 'Підбір графіка ревакцинації', price: 'за запитом' },
    ],
  },
  {
    icon: HeartPulse,
    title: 'Хірургія та стерилізація',
    description: 'Планові оперативні втручання, стерилізація, кастрація та післяопераційний супровід.',
    accent: 'orange',
    gradient: 'radial-gradient(120% 85% at 0% 100%, rgba(249,115,22,0.07), transparent 55%)',
    items: [
      { label: 'Стерилізація (оваріогістеректомія), до 5 кг', price: '500 ₴' },
      { label: 'Стерилізація (оваріогістеректомія), до 10 кг', price: '600 ₴' },
      { label: 'Стерилізація (оваріогістеректомія), до 20 кг', price: '650 ₴' },
      { label: 'Стерилізація (оваріогістеректомія), до 30 кг', price: '850 ₴' },
      { label: 'Стерилізація (оваріогістеректомія), до 40 кг', price: '1 000 ₴' },
      { label: 'Стерилізація (оваріогістеректомія), від 41 кг', price: '1 100 ₴' },
      { label: 'Вимушена евтаназія', price: '500–800 ₴' },
    ],
  },
  {
    icon: BedDouble,
    title: 'Проживання та харчування',
    description: 'Стаціонарний догляд після операцій, лікування та реабілітації з індивідуальним харчуванням.',
    accent: 'amber',
    gradient: 'radial-gradient(110% 80% at 50% 0%, rgba(245,158,11,0.08), transparent 55%)',
    items: [
      { label: 'Проживання у стаціонарі, до 20 кг / день', price: '80 ₴' },
      { label: 'Проживання у стаціонарі, понад 20 кг / день', price: '120 ₴' },
      { label: 'Харчування, до 20 кг / день', price: '120 ₴' },
      { label: 'Харчування лікувальними кормами, до 20 кг / день', price: '150 ₴' },
      { label: 'Харчування, понад 20 кг / день', price: '150 ₴' },
      { label: 'Харчування лікувальними кормами, понад 20 кг / день', price: '180 ₴' },
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Документи, ідентифікація та супровід',
    description: 'Чіпування, ветеринарні записи, консультації після усиновлення та план профілактики.',
    accent: 'rose',
    gradient: 'radial-gradient(120% 80% at 0% 0%, rgba(244,63,94,0.06), transparent 55%)',
    items: [
      { label: 'Чіпування тварин', price: '300 ₴' },
      { label: 'Ветеринарні рекомендації після прийому', price: 'за запитом' },
      { label: 'Пам’ятка з догляду та підготовка до вакцинації/операції', price: 'за запитом' },
    ],
  },
  {
    icon: Shield,
    title: 'Гуманний відлов і транспортування',
    description: 'Безпечна робота з безпритульними тваринами, транспортування до центру та первинний ветогляд.',
    accent: 'cyan',
    gradient: 'radial-gradient(120% 90% at 100% 100%, rgba(6,182,212,0.07), transparent 55%)',
    items: [
      { label: 'Доставка автомобілем (по місту), за 1 км', price: '30 ₴' },
      { label: 'Гуманний відлов та фіксація тварини', price: 'за запитом' },
      { label: 'Первинний ветогляд після прибуття', price: 'за запитом' },
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

const priceHighlights = [
  { icon: Tag, text: 'Ціна на кожній картці — без прихованих платежів' },
  { icon: ShieldCheck, text: 'Точну суму підтверджуємо під час огляду' },
  { icon: Receipt, text: 'Залежить від ваги, стану та обраних препаратів' },
]

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

function OrderDialogContent({ service, accent, icon: Icon }: { service: ServiceCategory; accent: Accent; icon: LucideIcon }) {
  const [category, setCategory] = useState(service.title)
  const [phone, setPhone] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const mailHref = `${SITE_CONTACTS.emailHref}?subject=${encodeURIComponent(`Замовлення послуги: ${category}`)}&body=${encodeURIComponent(
    [
      `Категорія послуги: ${category}`,
      phone ? `Телефон: ${phone}` : null,
      weight ? `Орієнтовна вага тварини: ${weight} кг` : null,
      date ? `Бажана дата: ${date}` : null,
      comment ? `Коментар: ${comment}` : null,
    ]
      .filter(Boolean)
      .join('\n')
  )}`

  function handleSubmit() {
    if (!phone.trim()) {
      setStatus('error')
      return
    }

    setStatus('loading')

    window.setTimeout(() => {
      setStatus('success')
      window.open(mailHref, '_blank')
    }, 1400)
  }

  return (
    <DialogContent
      className={cn('transition-[max-width] duration-300 ease-out', status === 'success' ? 'max-w-2xl sm:max-w-3xl' : 'max-w-lg')}
    >
      {status !== 'success' && (
        <DialogHeader>
          <span className={cn('mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1', accent.icon)}>
            <Icon className="h-6 w-6" />
          </span>
          <DialogTitle>Замовлення послуги</DialogTitle>
          <DialogDescription>Заповніть коротку форму — ми зв&apos;яжемося з вами, щоб узгодити деталі та точну вартість.</DialogDescription>
        </DialogHeader>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <SuccessApplication />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900" htmlFor="order-category">
                  Категорія послуги
                </label>
                <Select id="order-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                  {serviceCategories.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900" htmlFor="order-phone">
                  Ваш телефон
                </label>
                <UkrainianPhoneInput
                  id="order-phone"
                  onChange={(event) => {
                    setPhone(event.target.value)
                    if (status === 'error') {
                      setStatus('idle')
                    }
                  }}
                />
                {status === 'error' && (
                  <p className="mt-1.5 text-sm font-semibold text-rose-500">Вкажіть номер телефону для зв&apos;язку.</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-900" htmlFor="order-weight">
                    Вага тварини, кг
                  </label>
                  <Input
                    id="order-weight"
                    type="number"
                    min={0}
                    step="0.1"
                    inputMode="decimal"
                    placeholder="наприклад, 12"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-900" htmlFor="order-date">
                    Бажана дата <span className="font-medium text-gray-400">(необов&apos;язково)</span>
                  </label>
                  <Input id="order-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900" htmlFor="order-comment">
                  Коментар
                </label>
                <Textarea
                  id="order-comment"
                  placeholder="Опишіть стан тварини, побажання або додаткові деталі"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />
              </div>
            </form>

            <DialogFooter className="flex-col sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                disabled={status === 'loading'}
                onClick={handleSubmit}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Надсилаємо...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Надіслати заявку
                  </>
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  )
}

function ServiceCard({ service, index }: { service: ServiceCategory; index: number }) {
  const Icon = service.icon
  const accent = ACCENTS[service.accent]

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_22px_60px_-40px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_80px_-44px_rgba(15,23,42,0.28)]',
        accent.border
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: service.gradient }} />
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r to-transparent', accent.bar)}
      />

      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1', accent.icon)}>
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-xl font-black tracking-tight text-gray-900 sm:text-[1.4rem]">{service.title}</h3>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">{service.description}</p>

        <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100 pt-1">
          {service.items.map((item) => (
            <li key={item.label} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="text-sm leading-5 text-gray-600">{item.label}</span>
              <span className={cn('shrink-0 text-sm font-black tabular-nums whitespace-nowrap', accent.price)}>{item.price}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex justify-end pt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="md"
                className={cn(
                  'w-fit min-w-[12rem] justify-center rounded-full px-5 font-bold ring-1 ring-inset transition-colors',
                  accent.button
                )}
              >
                Замовити
              </Button>
            </DialogTrigger>

            <OrderDialogContent service={service} accent={accent} icon={Icon} />
          </Dialog>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" icon={SquarePen}>
                  Записатися на послугу
                </Button>
              </DialogTrigger>

              <OrderDialogContent
                service={serviceCategories[0]}
                accent={ACCENTS[serviceCategories[0].accent]}
                icon={serviceCategories[0].icon}
              />
            </Dialog>
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

      <section className="px-4 sm:px-6 lg:px-8">
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

      <section className="relative px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[min(92vw,1100px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,116,56,0.12)_0%,transparent_68%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(45,106,79,0.1)_0%,transparent_70%)] blur-3xl"
        />

        <SectionFrame className="mx-auto max-w-336 p-6 sm:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-10 md:mb-12 lg:mb-14"
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-sm font-black uppercase tracking-[0.22em] text-primary">
                  <Receipt className="h-4 w-4" />
                  Прайс-лист
                </span>
                <h2 className="mt-5 text-4xl uppercase font-black tracking-tight text-gray-950 sm:text-5xl lg:text-[3rem] lg:leading-[1.04]">
                  З радістю допоможемо{' '}
                  <span className="bg-linear-to-r from-primary via-orange-500 to-primary-second bg-clip-text text-transparent">
                    Вашим улюбленцям
                  </span>
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                  Орієнтовна вартість кожної послуги — одразу на картці. Точну суму підтверджуємо під час огляду: вона залежить від ваги,
                  стану тварини та обраних препаратів.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {priceHighlights.map((item) => {
                    const Icon = item.icon
                    return (
                      <span
                        key={item.text}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)]"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        {item.text}
                      </span>
                    )
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }}
                whileHover={{ rotate: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
                viewport={{ once: true }}
                style={{ rotate: -3 }}
                className="relative mx-auto w-full max-w-3xl lg:mx-0"
              >
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 -z-10 rounded-[36px] bg-[radial-gradient(circle,rgba(242,116,56,0.16)_0%,transparent_70%)] blur-2xl"
                />
                <div className="rounded-[32px] border border-gray-200/80 bg-white p-8 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)] sm:p-10">
                  <div className="flex items-end gap-4">
                    <span className="text-pink-600 bg-clip-text text-[6.5rem] font-black leading-none tabular-nums sm:text-[8.5rem]">
                      {serviceCategories.length}
                    </span>
                    <span className="pb-3 text-[42px] font-black leading-tight text-gray-900">
                      категорій
                      <br />
                      послуг
                    </span>
                  </div>
                  <p className="mt-5 text-base leading-7 text-gray-500">
                    Від профілактики й вакцинації до хірургії та стаціонарного догляду — для кожної категорії одразу вказана орієнтовна
                    ціна.
                  </p>
                  <div className="mt-6 h-px w-full bg-gray-100" />
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Без прихованих платежів
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCategories.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
