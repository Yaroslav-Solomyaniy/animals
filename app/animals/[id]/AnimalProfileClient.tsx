'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Heart, MessageCircleQuestionMark,
  PawPrint,
  Ruler,
  ShieldCheck,
  Syringe,
  VenusAndMars,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import BounceCards from '@/components/ui/BounceCards'
import type { Animal } from '@/types'
import SectionFrame from "@/components/ui/SectionFrame";
import {InfoCard} from "@/app/animals/[id]/_components/InfoCards";
import Link from "next/link";
import ShareMenu from '@/components/ui/ShareMenu'
import { LinkButton } from '@/components/ui/Button'

type AnimalProfileClientProps = {
  animal: Animal
  galleryImages: string[]
  relatedAnimals: Animal[]
}

const transformStyles = [
  'rotate(4deg) translate(-126px)',
  'rotate(0deg) translate(-62px)',
  'rotate(-5deg)',
  'rotate(4deg) translate(62px)',
  'rotate(-4deg) translate(126px)',
]

const fallbackDogGallery = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=900',
]

export default function AnimalProfileClient({
  animal,
  galleryImages,
  relatedAnimals,
}: AnimalProfileClientProps) {
  const images = useMemo(
    () => {
      const sourceImages =
        animal.id === '1' ? fallbackDogGallery : [animal.imageUrl, ...galleryImages]

      return Array.from(new Set(sourceImages)).slice(0, 5)
    },
    [animal.id, animal.imageUrl, galleryImages],
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex] ?? animal.imageUrl

  const infoCards = [
    {
      label: 'Розмір',
      value: animal.size,
      icon: Ruler,
    },
    {
      label: 'Термін у притулку',
      value: animal.stayDuration,
      icon: CalendarDays,
    },
    {
      label: '',
      value: animal.isVaccinated ? 'Щеплений' : 'Не щеплений',
      icon: Syringe,
      isActive: animal.isVaccinated,
    },
    {
      label: '',
      value: animal.isNeutered ? 'Стерилізований' : 'Не стерилізований',
      icon: ShieldCheck,
      isActive: animal.isNeutered,
    },
  ]

  return (
    <main className="min-h-screen pb-10 pt-12 text-[#111827] sm:pt-16 md:pb-14 md:pt-20">
      <div className="mx-auto mb-5 max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
        <LinkButton href="/animals" variant="outline"><ArrowLeft className="h-4 w-4" />Повернутись назад</LinkButton>
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2.3fr_3fr] md:items-start">
          <div className="space-y-5">
            <section>
              <div className="relative aspect-4/5 w-full h-125 overflow-hidden rounded-[30px] bg-gray-100 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.95)]">
                <img
                    src={selectedImage}
                    alt={animal.name}
                    className="h-full w-full object-cover object-center"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute left-6 right-6 top-6 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-emerald-700 shadow-sm backdrop-blur">
                  <BadgeCheck className="h-4 w-4" />
                  {animal.badge ?? getReadinessLabel(animal)}
                </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-orange-500 shadow-sm backdrop-blur">
                    <PawPrint className="h-5 w-5" />
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                  <h1 className="text-6xl font-black leading-none tracking-normal text-white sm:text-7xl">
                    {animal.name}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <MetaPill icon={VenusAndMars}>{animal.gender}</MetaPill>
                    <MetaPill icon={CalendarDays}>{animal.age}</MetaPill>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] bg-[#f8f6f1] p-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black">Фото</h2>
                <span className="text-sm font-bold text-gray-400">
                {selectedIndex + 1} / {images.length}
              </span>
              </div>
              <div className="flex justify-center overflow-hidden py-3">
                <BounceCards
                    className="custom-bounceCards"
                    images={images}
                    selectedIndex={selectedIndex}
                    containerWidth={430}
                    containerHeight={200}
                    animationDelay={0.25}
                    animationStagger={0.08}
                    easeType="elastic.out(1, 0.5)"
                    transformStyles={transformStyles}
                    enableHover
                    onSelect={setSelectedIndex}
                />
              </div>
            </section>
          </div>

          <section className="min-w-0 p-1 sm:p-3 md:p-5 lg:p-6">
            <p className="text-xl font-black leading-tight tracking-normal text-[#111827] sm:text-2xl md:text-3xl">
            <span className="rounded-xl px-2 box-decoration-clone">
              {animal.description}
            </span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {animal.character.map((trait, index) => (
                  <TraitChip key={trait} icon={index % 2 === 0 ? Zap : Heart}>
                    {trait}
                  </TraitChip>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {infoCards.map((card) => (
                  <InfoCard
                      key={card.label}
                      icon={card.icon}
                      label={card.label}
                      value={card.value}
                      isActive={card.isActive}
                  />
              ))}
            </div>

            <section className="mt-8 rounded-[28px] bg-[#f8f6f1] p-6">
              <p className="mb-2 text-sm font-black uppercase tracking-wider text-orange-500">
                Повна історія
              </p>
              <h2 className="text-3xl font-black tracking-normal">
                Історія {animal.name}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-8 text-gray-600">
                <p>{buildStory(animal)}</p>
                <p>{animal.description}</p>
              </div>
            </section>

            <section className="mt-8 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <LinkButton href={`/donate?animalId=${animal.id}&gift=treat`} variant="outline" className="flex-1 text-center"><PawPrint className="h-5 w-5" />
                Дати смаколика</LinkButton>
              <LinkButton href="/contacts" variant="secondary" className="flex-1 text-center">Поставити запитання <MessageCircleQuestionMark className="h-6 w-6" /></LinkButton>
                <ShareMenu
                  path={`/animals/${animal.id}`}
                  title={`${animal.name} шукає дім`}
                  text={animal.description}
                  label="Поділитись"
                  variant="icon"
                  className="w-full sm:w-auto"
                />
              </div>
              <LinkButton href="/contacts" className="w-full text-center"><Heart className="h-5 w-5 fill-white/20" />
                Стати вірним другом</LinkButton>
            </section>
          </section>
        </div>
        </SectionFrame>
      </section>

      {relatedAnimals.length > 0 && (
        <section className="mx-auto mt-10 max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
                Вони також шукають дім
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-gray-950">
                Познайомтесь ще з кількома хвостиками
              </h2>
            </div>
            <LinkButton href="/animals" variant="outline">Весь каталог</LinkButton>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedAnimals.map((item) => (
              <RelatedAnimalCard key={item.id} animal={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function RelatedAnimalCard({ animal }: { animal: Animal }) {
  return (
    <Link
      href={`/animals/${animal.id}`}
      className="group flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-3 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/20"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xl font-black text-gray-950">
          {animal.name}
        </h3>
        <p className="mt-1 text-sm font-bold text-gray-500">
          {animal.age} • {animal.stayDuration}
        </p>
        <span className="mt-3 inline-flex text-sm font-black text-primary transition-colors group-hover:text-secondary">
          Переглянути
        </span>
      </div>
    </Link>
  )
}

function MetaPill({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1.5 text-xs font-extrabold text-white ring-1 ring-white/25 backdrop-blur">
      <Icon className="h-4 w-4" />
      {children}
    </span>
  )
}

function TraitChip({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#eef8e7] px-4 text-sm font-extrabold text-gray-700">
      <Icon className="h-4 w-4 text-emerald-700" />
      {children}
    </span>
  )
}

function buildStory(animal: Animal) {
  return `${animal.name} вже ${animal.stayDuration} перебуває під опікою притулку. За цей час команда краще зрозуміла його характер, потреби та темп життя, щоб підібрати родину, якій буде комфортно поруч із ним.`
}

function getReadinessLabel(animal: Animal) {
  return animal.isVaccinated && animal.isNeutered
    ? 'Готовий до адопції'
    : 'Потребує підготовки'
}
