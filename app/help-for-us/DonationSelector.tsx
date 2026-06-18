'use client'

import { useState } from 'react'
import { Bone, HeartPulse, Sparkles, Stethoscope, ArrowRight, PenLine, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { SITE_ROUTES } from '@/lib/site-config'

type DonationOption = {
  amount: number
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

const donationOptions: DonationOption[] = [
  {
    amount: 100,
    description: 'корм або смаколики для підопічних',
    icon: Bone,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    amount: 500,
    description: 'вакцинація та базовий догляд',
    icon: Stethoscope,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-500',
  },
  {
    amount: 1000,
    description: 'підтримка лікування чи стерилізації',
    icon: HeartPulse,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
  },
  {
    amount: 2500,
    description: 'місячна допомога центру',
    icon: Sparkles,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-500',
  },
]

export default function DonationSelector() {
  const [selected, setSelected] = useState<number | null>(null)

  const donateHref = selected
    ? `${SITE_ROUTES.donate}?amount=${selected}`
    : SITE_ROUTES.donate

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {donationOptions.slice(0, 2).map((option) => {
          const Icon = option.icon
          const isSelected = selected === option.amount
          return (
            <button
              key={option.amount}
              type="button"
              onClick={() => setSelected(isSelected ? null : option.amount)}
              className={[
                'group flex flex-col items-center rounded-3xl border-2 p-6 text-center transition-all duration-300',
                isSelected
                  ? 'border-primary bg-primary shadow-[0_8px_32px_rgba(242,116,56,0.30)]'
                  : 'border-gray-100 bg-white hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl',
              ].join(' ')}
            >
              <span className={['mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110', isSelected ? 'bg-white/20' : option.iconBg].join(' ')}>
                <Icon className={`h-7 w-7 ${isSelected ? 'text-white' : option.iconColor}`} />
              </span>
              <span className={['block text-3xl font-black', isSelected ? 'text-white' : 'text-gray-950'].join(' ')}>
                {option.amount} грн
              </span>
              <span className={['mt-3 block text-sm leading-6', isSelected ? 'text-white/75' : 'text-gray-600'].join(' ')}>
                {option.description}
              </span>
            </button>
          )
        })}

        {/* Custom amount — middle */}
        <Link
          href={SITE_ROUTES.donate}
          className="group flex flex-col items-center rounded-3xl border-2 border-dashed border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-50">
            <PenLine className="h-7 w-7 text-gray-400 transition-colors group-hover:text-orange-500" />
          </span>
          <span className="block text-xl font-black text-gray-500 group-hover:text-gray-950">Власна сума</span>
          <span className="mt-3 block text-sm leading-6 text-gray-400">вказати довільну суму</span>
        </Link>

        {donationOptions.slice(2).map((option) => {
          const Icon = option.icon
          const isSelected = selected === option.amount
          return (
            <button
              key={option.amount}
              type="button"
              onClick={() => setSelected(isSelected ? null : option.amount)}
              className={[
                'group flex flex-col items-center rounded-3xl border-2 p-6 text-center transition-all duration-300',
                isSelected
                  ? 'border-primary bg-primary shadow-[0_8px_32px_rgba(242,116,56,0.30)]'
                  : 'border-gray-100 bg-white hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl',
              ].join(' ')}
            >
              <span className={['mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110', isSelected ? 'bg-white/20' : option.iconBg].join(' ')}>
                <Icon className={`h-7 w-7 ${isSelected ? 'text-white' : option.iconColor}`} />
              </span>
              <span className={['block text-3xl font-black', isSelected ? 'text-white' : 'text-gray-950'].join(' ')}>
                {option.amount} грн
              </span>
              <span className={['mt-3 block text-sm leading-6', isSelected ? 'text-white/75' : 'text-gray-600'].join(' ')}>
                {option.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* CTA button */}
      <div className={['flex justify-end overflow-hidden transition-all duration-500', selected ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'].join(' ')}>
        <Link
          href={donateHref}
          className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-extrabold text-white shadow-[0_14px_34px_rgba(242,116,56,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_18px_45px_rgba(242,116,56,0.30)]"
        >
          Перейти до оплати
          {selected ? <span className="opacity-75">· {selected} грн</span> : null}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
