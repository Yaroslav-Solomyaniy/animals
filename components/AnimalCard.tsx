'use client'

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  Dog,
  PawPrint,
  Ruler,
  ShieldCheck,
  Sparkles,
  VenusAndMars,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Animal } from '@/types'

type AnimalCardProps = {
  animal: Animal
  className?: string
  detailsHref?: string
  index?: number
}

export default function AnimalCard({
  animal,
  className = '',
  detailsHref = '/dogs',
  index = 0,
}: AnimalCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotate: -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
      className={`storybook-card group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-white transition-all duration-500 md:hover:-translate-y-1 ${className}`}
    >
      <span className="absolute left-0 top-8 z-20 h-16 w-2 rounded-r-full bg-primary" />
      <span className="storybook-spark absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-primary shadow-soft backdrop-blur">
        <Sparkles className="h-4 w-4" />
      </span>

      <a
        href={detailsHref}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100 sm:aspect-[4/5]"
        aria-label={`Відкрити деталі для ${animal.name}`}
      >
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-4 left-4 flex max-w-[calc(100%-4rem)] flex-col gap-2">
          {animal.badge && (
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-orange-600 uppercase shadow-sm">
              {animal.badge}
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-2/3 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute right-4 bottom-4 left-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 text-[10px] font-extrabold text-text-main backdrop-blur">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Сторінка {animal.id}
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-3xl font-extrabold text-white">
                {animal.name}
              </h3>
              <p className="mt-1 text-xs font-bold text-white/75">
                {animal.age}
              </p>
            </div>

            <span className="storybook-card-icon inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/95 text-primary shadow-lg backdrop-blur transition-colors group-hover:bg-primary group-hover:text-white">
              <Dog className="h-5 w-5" />
            </span>
          </div>
        </div>
      </a>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-4 min-h-[4.5rem] text-sm leading-6 text-gray-500">
          {animal.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-500">
          <InfoPill icon={VenusAndMars}>{animal.gender}</InfoPill>
          <InfoPill icon={Ruler}>{animal.size}</InfoPill>
          <InfoPill icon={Clock3}>{animal.stayDuration}</InfoPill>
          <InfoPill icon={ShieldCheck}>
            {animal.isVaccinated ? 'Вакцинована' : 'Уточнити'}
          </InfoPill>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          <StatusPill isReady={animal.isVaccinated}>
            {animal.isVaccinated ? 'Щеплення є' : 'Щеплення уточнюється'}
          </StatusPill>
          <StatusPill isReady={animal.isNeutered}>
            {animal.isNeutered ? 'Стерилізована' : 'Підготовка'}
          </StatusPill>
        </div>

        <div className="mt-auto flex gap-2 pt-5">
          <a
            href={detailsHref}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-extrabold text-gray-500 transition-colors hover:bg-primary hover:text-white"
          >
            Деталі
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={`/donate?animalId=${animal.id}&gift=treat`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary transition-colors hover:bg-primary hover:text-white"
            aria-label={`Дати смаколик для ${animal.name}`}
            title="Дати смаколик"
          >
            <PawPrint className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function InfoPill({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="flex min-h-10 items-center gap-1.5 rounded-xl bg-neutral-base px-2.5 py-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-secondary" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  )
}

function StatusPill({
  isReady,
  children,
}: {
  isReady: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={[
        'inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold',
        isReady ? 'bg-[#F1FFF8] text-secondary' : 'bg-orange-50 text-primary',
      ].join(' ')}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}
