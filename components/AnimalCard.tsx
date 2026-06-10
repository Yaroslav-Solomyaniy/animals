'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CalendarHeart,
  Clock3,
  PawPrint,
  Ruler,
  Scissors,
  ShieldCheck,
  Sparkles,
  VenusAndMars,
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react'
import type {ReactNode} from 'react'
import {motion} from 'motion/react'

import {LinkButton} from '@/components/ui/Button'
import {buildDonateHref} from '@/lib/donate-search-params'
import {buildAnimalHref} from '@/lib/site-config'
import type {Animal} from '@/types'

type AnimalCardProps = {
  animal: Animal
  className?: string
  detailsHref?: string
  index?: number
}

export default function AnimalCard({
  animal,
  className = '',
  detailsHref,
  index = 0,
}: AnimalCardProps) {
  const treatHref = buildDonateHref({animalId: animal.id, gift: 'treat'})
  const primaryHref = detailsHref ?? buildAnimalHref(animal.id)

  return (
    <motion.article
      initial={{opacity: 0, y: 18}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.42, delay: index * 0.03, ease: [0.22, 1, 0.36, 1]}}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-primary/20 bg-white transition-all duration-500 md:hover:-translate-y-1 md:hover:border-primary/30 ${className}`}
    >
      <Link
        href={primaryHref}
        className="relative block aspect-[10/11] overflow-hidden bg-gray-100 sm:aspect-9/11"
        aria-label={`Відкрити деталі для ${animal.name}`}
      >
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-linear-to-t from-gray-950/82 via-gray-950/18 to-transparent" />

        <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-3">
          {animal.badge ? (
            <span className="max-w-[calc(100%-3.25rem)] rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-primary uppercase shadow-sm backdrop-blur">
              {animal.badge}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-soft backdrop-blur transition-colors group-hover:bg-primary group-hover:text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
        </div>

        <div className="absolute right-5 bottom-13 left-5">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/16 px-3 py-1 text-[11px] font-extrabold text-white backdrop-blur">
            <CalendarHeart className="h-3.5 w-3.5 text-orange-200" />
            Анкета тварини
          </p>
          <h3 className="truncate text-3xl leading-none font-black text-white sm:text-[34px]">
            {animal.name}
          </h3>
        </div>
      </Link>

      <div className="relative z-10 -mt-7 flex flex-1 flex-col rounded-t-[26px]  bg-white px-3.5 pt-4 pb-3.5 shadow-[0_-22px_50px_-36px_rgba(15,23,42,0.72)] sm:px-4 sm:pt-4.5 sm:pb-4">

        <div className="grid grid-cols-2 gap-1.5">
          <FactTile icon={VenusAndMars} label="Стать" value={animal.gender} />
          <FactTile icon={Ruler} label="Розмір" value={animal.size} />
          <FactTile icon={Clock3} label="Вік" value={animal.age} className="col-span-2" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-gray-100 pt-3">
          <CareStatus
            icon={ShieldCheck}
            isReady={animal.isVaccinated}
            label="Щеплення"
            value={animal.isVaccinated ? 'Присутнє' : 'Відсутнє'}
          />
          <CareStatus
            icon={animal.isNeutered ? BadgeCheck : Scissors}
            isReady={animal.isNeutered}
            label={getNeuterActionLabel(animal.gender)}
            value={animal.isNeutered ? 'Проведена' : 'Заплановано'}
          />
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <LinkButton
            href={primaryHref}
            variant="dark"
            className="h-11 flex-1 rounded-xl text-sm"
          >
            Деталі
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton
            href={treatHref}
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            aria-label={`Дати смаколик для ${animal.name}`}
            title="Дати смаколик"
          >
            <PawPrint className="h-4.5 w-4.5" />
          </LinkButton>
        </div>
      </div>
    </motion.article>
  )
}

function getNeuterActionLabel(gender: Animal['gender']) {
  return gender === 'Самець' ? 'Кастрація' : 'Стерилізація'
}

function FactTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={[
        'flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 px-2.5 py-2',
        className ?? '',
      ].join(' ')}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-secondary shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] leading-none font-black tracking-wide text-gray-400 uppercase">
          {label}
        </span>
        <span className="mt-1 block truncate text-[13px] leading-4 font-extrabold text-gray-700">
          {value}
        </span>
      </span>
    </div>
  )
}

function CareStatus({
  icon: Icon,
  isReady,
  label,
  value,
}: {
  icon: LucideIcon
  isReady: boolean
  label: string
  value: ReactNode
}) {
  return (
    <div
      className={[
        'flex min-h-13 min-w-0 items-center gap-2 rounded-xl border px-2 py-2',
        isReady
          ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
          : 'border-orange-100 bg-orange-50 text-orange-700',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm',
          isReady ? 'text-secondary' : 'text-primary',
        ].join(' ')}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[8.5px] leading-none font-black tracking-wide uppercase opacity-70">
          {label}
        </span>
        <span className="mt-1 block truncate text-[12px] leading-4 font-extrabold">
          {value}
        </span>
      </span>
    </div>
  )
}
