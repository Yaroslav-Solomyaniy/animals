'use client'

import { useState } from 'react'
import { HandCoins, Heart, PawPrint, ScrollText, Sparkles } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { buildDonateHref } from '@/lib/donate-search-params'
import { SITE_ROUTES } from '@/lib/site-config'
import AnimalTreatCarousel from '@/components/AnimalTreatCarousel'
import ReportsCarousel from '@/components/ReportsCarousel'

type TreatAnimal = {
  id: string
  name: string
  imageUrl: string
  donateHref: string
}

type ReportFile = { src: string; name: string }

type Report = {
  id: string
  title: string
  period: string | null
  description: string | null
  files: ReportFile[]
  date: string
}

type Props = {
  donationsEnabled: boolean
  amounts: number[]
  description: string | null
  animals: TreatAnimal[]
  reports: Report[]
}

export default function DonationBanner({ donationsEnabled, amounts, description, animals, reports }: Props) {
  const hasReports = reports.length > 0

  const allTabs = [
    donationsEnabled ? { id: 'donate',   label: 'Підтримати центр', icon: HandCoins  } : null,
    donationsEnabled ? { id: 'treat',    label: 'Смаколик тварині', icon: PawPrint   } : null,
    hasReports       ? { id: 'reports',  label: 'Наші звіти',       icon: ScrollText } : null,
  ].filter(Boolean) as { id: string; label: string; icon: React.ElementType }[]

  const [tab, setTab] = useState(allTabs[0]?.id ?? 'donate')

  if (allTabs.length === 0) return null

  return (
    <section className="relative mt-14 overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_24px_80px_rgba(242,116,56,0.07)]">

      {/* ── Tab switcher (only when >1 tab) ── */}
      {allTabs.length > 1 && (
        <div className="flex items-center gap-2 border-b border-orange-100 px-8 pt-6 sm:px-10 lg:px-12">
          {allTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'relative flex items-center gap-2 rounded-t-2xl px-5 py-3 text-sm font-extrabold transition-all duration-200',
                tab === id ? 'bg-orange-50 text-primary' : 'text-gray-400 hover:text-gray-700',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              {label}
              {tab === id && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Donate tab ── */}
      {tab === 'donate' && (
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          {/* Left — yellow hero panel */}
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fbbf24_0%,#f97316_100%)] p-8 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute right-6 bottom-10 h-24 w-24 rounded-full bg-amber-300/30" />

            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Підтримати центр
            </span>
            <h2 className="relative mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Кожна гривня — конкретна турбота
            </h2>
            <p className="relative mt-3 leading-7 text-white/80">
              {description ?? 'Донати йдуть на корм, ліки, вакцинацію та щоденний догляд тварин центру.'}
            </p>
            <div className="relative mt-4 flex items-start gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <p className="text-sm leading-6 text-white">
                Оплата через Monobank — приймаються картки будь-якого банку.
              </p>
            </div>
            {hasReports && (
              <div className="relative mt-6 flex items-start gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                <p className="text-sm leading-6 text-white">
                  <span className="font-extrabold">Ми прозорі.</span>{' '}
                  Вся фінансова звітність публічно доступна на сайті.
                </p>
              </div>
            )}
          </div>

          {/* Right — amounts */}
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-gray-400">Оберіть суму</p>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map((amount) => (
                <a
                  key={amount}
                  href={buildDonateHref({ amount })}
                  className="flex h-16 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-xl font-black text-gray-800 shadow-sm transition-all duration-200 hover:border-primary hover:bg-orange-50 hover:text-primary hover:shadow-[0_8px_24px_rgba(242,116,56,0.15)]"
                >
                  {amount} <span className="ml-1 text-base font-extrabold opacity-60">₴</span>
                </a>
              ))}
            </div>
            <LinkButton
              href={buildDonateHref()}
              className="mt-3 h-13 w-full rounded-2xl bg-primary text-sm font-extrabold text-white shadow-[0_8px_28px_rgba(242,116,56,0.28)] transition-all hover:bg-primary/90 hover:-translate-y-0.5"
            >
              <Heart className="h-4 w-4" />
              Власна сума
            </LinkButton>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-center text-[11px] leading-5 text-slate-400">
                Усі пожертування є добровільними та безповоротними. Здійснюючи переказ, ви підтверджуєте, що ознайомлені з цією умовою та робите внесок свідомо.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Treat tab ── */}
      {tab === 'treat' && (
        <div className="p-8 sm:p-10 lg:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-950 sm:text-3xl">Дайте смаколик конкретній тварині</h3>
              <p className="mt-2 max-w-lg leading-7 text-gray-500">
                Оберіть улюбленця — ваші кошти підуть на ласощі та дрібні потреби конкретної тварини.
              </p>
            </div>
            <LinkButton href={SITE_ROUTES.animals} variant="outline" size="sm" className="shrink-0 rounded-xl">
              Усі тварини
            </LinkButton>
          </div>
          <AnimalTreatCarousel animals={animals} />
        </div>
      )}

      {/* ── Reports tab ── */}
      {tab === 'reports' && (
        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-6 flex items-center gap-4 border-b border-orange-100/70 pb-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
              <ScrollText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Прозорість та відкритість</p>
              <h2 className="mt-1 text-2xl font-black text-gray-950">Ми публічні — дивіться наші звіти</h2>
            </div>
          </div>
          <ReportsCarousel reports={reports} />
        </div>
      )}
    </section>
  )
}
