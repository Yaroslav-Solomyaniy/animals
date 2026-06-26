'use client'

import {
  Activity,
  BedDouble,
  ClipboardCheck,
  HeartPulse,
  Loader2,
  type LucideIcon,
  Mail,
  MessageCircle,
  Receipt,
  Shield,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Tag,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useState } from 'react'
import { submitServiceRequestAction } from '@/app/services/actions'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { SITE_CONTACTS } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import UkrainianPhoneInput from '@/components/ui/UkrainianPhoneInput'
import SuccessApplication from '@/components/SuccessApplication'

export type PriceItem = { label: string; price?: string }

export type Accent = {
  icon: string
  price: string
  border: string
  bar: string
  button: string
}

export const ACCENTS = {
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

export type ServiceCategory = {
  icon: LucideIcon
  title: string
  description: string
  items: Array<PriceItem>
  accent: keyof typeof ACCENTS
  gradient: string
}

export const serviceCategories: Array<ServiceCategory> = [
  {
    icon: Stethoscope,
    title: 'Прийом, терапія та діагностика',
    description: 'Клінічний огляд, збір анамнезу, призначення терапії та інструментальна діагностика, зокрема УЗД.',
    accent: 'sky',
    gradient: 'radial-gradient(115% 80% at 100% 0%, rgba(56,189,248,0.08), transparent 55%)',
    items: [
      { label: 'Огляд ветеринарного лікаря', price: '200 ₴' },
      { label: 'Послуга УЗД', price: '250 ₴' },
      { label: "Ін'єкції", price: '5 ₴' },
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
      { label: "Пам'ятка з догляду та підготовка до вакцинації/операції", price: 'за запитом' },
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

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function OrderDialogContent({
  service,
  accent,
  icon: Icon,
}: {
  service: ServiceCategory
  accent: Accent
  icon: LucideIcon
}) {
  const [category, setCategory] = useState(service.title)
  const [phone, setPhone] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const minDate = date  // min = tomorrow (same as default)
  const isPhoneValid = phone.replace(/\D/g, '').length >= 10
  const isFormValid = isPhoneValid

  async function handleSubmit() {
    if (!isPhoneValid) {
      setStatus('error')
      return
    }

    setStatus('loading')

    const formData = new FormData()
    formData.set('category', category)
    formData.set('phone', phone)
    if (weight) formData.set('weight', weight)
    if (date) formData.set('desired_date', date)
    if (comment) formData.set('comment', comment)

    const result = await submitServiceRequestAction(formData)
    setStatus(result.ok ? 'success' : 'error')
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
          <DialogDescription>
            Заповніть коротку форму — ми зв&apos;яжемося з вами, щоб узгодити деталі та точну вартість.
          </DialogDescription>
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
                  Ваш телефон <span className="text-rose-500">*</span>
                </label>
                <UkrainianPhoneInput
                  id="order-phone"
                  onChange={(event) => {
                    setPhone(event.target.value)
                    if (status === 'error') setStatus('idle')
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
                    Бажана дата
                  </label>
                  <Input id="order-date" type="date" value={date} min={minDate} onChange={(event) => setDate(event.target.value)} />
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
                disabled={status === 'loading' || !isFormValid}
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

/**
 * Self-contained dialog with a custom trigger.
 * Pass any element as `trigger` — it will be wrapped with DialogTrigger asChild.
 */
export function ServiceOrderDialog({ trigger }: { trigger: ReactNode }) {
  const first = serviceCategories[0]
  const [openCount, setOpenCount] = useState(0)
  return (
    <Dialog onOpenChange={(open) => { if (open) setOpenCount((c) => c + 1) }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <OrderDialogContent key={openCount} service={first} accent={ACCENTS[first.accent]} icon={first.icon} />
    </Dialog>
  )
}
