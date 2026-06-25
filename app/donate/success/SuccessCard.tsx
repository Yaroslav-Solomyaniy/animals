'use client'

import { motion } from 'motion/react'
import { Bone, Heart, Home, PawPrint, ShieldCheck } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { SITE_ROUTES } from '@/lib/site-config'

export default function SuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-[620px]"
    >
      {/* ── TOP: orange gradient ── */}
      <div className="relative overflow-hidden rounded-t-[28px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-8 pb-10 pt-8 text-white sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }}
        />

        <div className="relative flex flex-col items-center">
          <div className="flex h-52 w-52 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
            <img src="/dog3.png" alt="" aria-hidden className="h-[192px] w-[192px] object-contain" />
          </div>
          <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            Платіж успішний
          </p>
          <h1 className="mt-2 text-center text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Дякуємо за<br />підтримку!
          </h1>
        </div>
      </div>

      {/* ── PERFORATION ── */}
      <div className="relative z-10 flex h-0 items-center">
        <div className="absolute -left-4 h-8 w-8 rounded-full bg-[#fff7ed]" />
        <div className="absolute -right-4 h-8 w-8 rounded-full bg-[#fff7ed]" />
        <div className="mx-4 w-full border-t-2 border-dashed border-orange-200/70" />
      </div>

      {/* ── BOTTOM ── */}
      <div className="rounded-b-[28px] border-x-2 border-b-2 border-white/60 bg-white/85 px-8 pb-8 pt-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-10 sm:pb-10">
        <p className="text-base font-medium leading-7 text-gray-600">
          Ваш платіж прийнятий. Кожна гривня йде напряму на потреби тварин центру.
        </p>

        {/* Impact chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <Bone className="h-4 w-4" /> Корм та ласощі
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            <ShieldCheck className="h-4 w-4" /> Ліки й обробки
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <Home className="h-4 w-4" /> Тепло й догляд
          </span>
        </div>

        {/* Reports */}
        <p className="mt-5 text-sm leading-6 text-gray-400">
          Звітність про використання коштів —{' '}
          <a href={SITE_ROUTES.help} className="font-semibold text-orange-600 underline-offset-2 hover:underline">
            сторінка «Як можна допомогти»
          </a>.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-100" />

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <LinkButton href={SITE_ROUTES.animals} size="lg" className="flex-1 justify-center">
            <PawPrint className="h-5 w-5" />
            До каталогу тварин
          </LinkButton>
          <LinkButton href={SITE_ROUTES.home} variant="outline" size="lg" className="flex-1 justify-center">
            <Heart className="h-5 w-5" />
            На головну
          </LinkButton>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-5 text-center">
          <img src="/dog2.png" alt="" aria-hidden className="mx-auto mb-3 h-16 w-16 object-contain" />
          <p className="text-base font-semibold text-gray-800">Центр надання допомоги тваринам м. Черкаси</p>
          <p className="mt-1 text-sm text-gray-500">Рятуємо, лікуємо, соціалізуємо та допомагаємо знайти новий дім для тварин Черкас.</p>
        </div>
      </div>
    </motion.div>
  )
}
