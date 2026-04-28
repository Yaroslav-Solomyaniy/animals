'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Dog,
  PawPrint,
  Ruler,
  Sparkles,
  VenusAndMars,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { LinkButton } from '@/components/ui/Button'
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
  detailsHref,
  index = 0,
}: AnimalCardProps) {
  const treatHref = `/donate?animalId=${animal.id}&gift=treat`
  const primaryHref = detailsHref ?? `/animals/${animal.id}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotate: -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_22px_60px_-42px_rgba(31,41,55,0.52)] transition-all duration-500 md:hover:-translate-y-1 md:hover:border-primary/30 ${className}`}
    >
      <Link
        href={primaryHref}
        className="relative block aspect-[1.12] overflow-hidden bg-gray-100"
        aria-label={`Відкрити деталі для ${animal.name}`}
      >
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-3">
          {animal.badge && (
            <span className="max-w-[calc(100%-3rem)] rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold tracking-wider text-orange-600 uppercase shadow-sm backdrop-blur">
              {animal.badge}
            </span>
          )}
          <span className="storybook-spark ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-soft backdrop-blur">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-3/4 bg-gradient-to-t from-gray-950/82 via-gray-950/28 to-transparent" />

        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-3xl font-extrabold text-white">
              {animal.name}
            </h3>
            <p className="mt-1 text-xs font-bold text-white/80">
              {animal.age}
            </p>
          </div>

          <span className="storybook-card-icon inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-lg backdrop-blur transition-colors group-hover:bg-primary group-hover:text-white">
            <Dog className="h-5 w-5" />
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-4 min-h-19 overflow-hidden text-sm leading-6 text-gray-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {animal.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-500">
          <InfoPill icon={VenusAndMars} className="col-span-2">
            {animal.gender}
          </InfoPill>
          <InfoPill icon={Ruler}>{animal.size}</InfoPill>
          <InfoPill icon={Clock3}>{animal.stayDuration}</InfoPill>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          <StatusPill isReady={animal.isVaccinated}>
            {animal.isVaccinated
              ? getVaccinationLabel(animal.gender)
              : 'Щеплення уточнюється'}
          </StatusPill>
          <StatusPill isReady={animal.isNeutered}>
            {animal.isNeutered
              ? getNeuterLabel(animal.gender)
              : getNeuterPendingLabel(animal.gender)}
          </StatusPill>
        </div>

        <div className="mt-auto flex gap-2 pt-5">
          <LinkButton
            href={primaryHref}
            variant="primary"
            className="h-12 flex-1 text-sm"
          >
            Деталі
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton
            href={treatHref}
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0"
            aria-label={`Дати смаколик для ${animal.name}`}
            title="Дати смаколик"
          >
            <PawPrint className="h-5 w-5" />
          </LinkButton>
        </div>
      </div>
    </motion.article>
  )
}

function getVaccinationLabel(gender: Animal['gender']) {
  return gender === 'Самець' ? 'Щеплений' : 'Щеплена'
}

function getNeuterLabel(gender: Animal['gender']) {
  return gender === 'Самець' ? 'Кастрований' : 'Стерилізована'
}

function getNeuterPendingLabel(gender: Animal['gender']) {
  return gender === 'Самець'
    ? 'Кастрація в плані'
    : 'Стерилізація в плані'
}

function InfoPill({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={[
        'flex min-h-10 items-center gap-1.5 rounded-xl bg-neutral-base px-2.5 py-2',
        className ?? '',
      ].join(' ')}
    >
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
