'use client'

import React, {useMemo, useState} from 'react'
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Heart,
    MessageCircleQuestionMark,
    PawPrint,
    Ruler,
    ShieldCheck,
    Syringe,
    VenusAndMars,
    Zap,
} from 'lucide-react'
import type {Animal} from '@/types'
import SectionFrame from "@/components/ui/SectionFrame";
import {InfoCard} from "@/app/animals/[id]/_components/InfoCards";
import Link from "next/link";
import ShareMenu from '@/components/ui/ShareMenu'
import {LinkButton} from "@/components/ui/Button";
import {buildDonateHref} from '@/lib/donate-search-params'
import {buildAnimalHref, SITE_ROUTES} from '@/lib/site-config'
import {AnimatePresence, motion} from 'motion/react'
import {MetaPill} from "@/app/animals/[id]/_components/MetaPill";
import {TraitChip} from "@/app/animals/[id]/_components/TraitChip";

type AnimalProfileClientProps = {
    animal: Animal
    galleryImages: string[]
    relatedAnimals: Animal[]
}

export default function AnimalProfileClient({animal, galleryImages, relatedAnimals,}: AnimalProfileClientProps) {
    const images = useMemo(
        () => {
            return Array.from(new Set([animal.imageUrl, ...galleryImages])).slice(0, 5)
        },
        [animal.imageUrl, galleryImages],
    )
    const [selectedIndex, setSelectedIndex] = useState(0)

    const infoCards = [
        {
            label: 'Розмір',
            value: animal.size,
            icon: Ruler,
        },
        {
            label: 'Вік',
            value: animal.age,
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
        <main className="contacts-gradient-honey min-h-screen pb-8 pt-8 text-[#111827] sm:pt-8 md:pb-8 md:pt-8">
            <section className="px-4 sm:px-6 lg:px-8">
                <SectionFrame className="mx-auto max-w-336 p-4 sm:p-6 lg:p-8">
                    <div className="mb-5 flex items-stretch justify-between gap-3">
                        <LinkButton
                            href={SITE_ROUTES.animals}
                            variant="outline"
                            className="w-1/2 sm:w-auto"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Повернутись назад</span>
                        </LinkButton>

                        <div className={'flex gap-6'}>
                            <LinkButton
                                href={buildDonateHref({ animalId: animal.id, gift: 'treat' })}
                                variant="outline"
                            >
                                <PawPrint className="h-5 w-5" />
                                Дати смаколика
                            </LinkButton>
                            <ShareMenu
                                path={buildAnimalHref(animal.id)}
                                title={`${animal.name} шукає дім`}
                                text={animal.description}
                                label="Поширити в соціальних мережах"
                                variant="button"
                                className="self-stretch [&>button]:h-full!"
                            />
                            <LinkButton
                                href={SITE_ROUTES.contacts}
                                variant="outline"
                            >
                                Уточнити деталі <MessageCircleQuestionMark className="h-6 w-6" />
                            </LinkButton>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2.3fr_3fr] md:items-start">
                        <div className="space-y-5">
                            <AnimalPhotoStorySlider
                                animal={animal}
                                images={images}
                                selectedIndex={selectedIndex}
                                onSelect={setSelectedIndex}
                            />

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {animal.character.map((trait, index) => (
                                    <TraitChip key={trait} icon={index % 2 === 0 ? Zap : Heart}>
                                        {trait}
                                    </TraitChip>
                                ))}
                            </div>
                            {/*<section className="overflow-hidden rounded-[28px] bg-[#f8f6f1] p-5">*/}
                            {/*    <p></p>*/}
                            {/*</section>*/}
                        </div>

                        <section className="min-w-0 p-1 sm:p-3 md:p-5 lg:p-6">
                            <p className="text-xl font-black leading-tight tracking-normal text-[#111827] sm:text-2xl md:text-3xl">
            <span className="rounded-xl px-2 box-decoration-clone">
              {animal.description}
            </span>
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {infoCards.map((card) => (
                                    <InfoCard
                                        key={`${card.label}+++${card.value} + ${animal.slug}`}
                                        icon={card.icon}
                                        label={card.label}
                                        value={card.value}
                                        isActive={card.isActive}
                                    />
                                ))}
                            </div>

                            <LinkButton
                                href={SITE_ROUTES.contacts}
                                variant="primary"
                                size="lg"
                                className="w-full mt-4"
                            >
                                <Heart className="h-5 w-5 fill-white/20" />
                                Стати вірним другом
                            </LinkButton>

                            <section className="mt-8 rounded-[28px] bg-[#f8f6f1] p-6">
                                <p className="mb-2 text-sm font-black uppercase tracking-wider text-orange-500">
                                    Повна історія
                                </p>
                                <div className="mt-5 space-y-4 text-lg leading-8 text-gray-600">
                                    <p>{animal.fullStory || buildStory(animal)}</p>
                                    <p>{animal.description}</p>
                                </div>
                            </section>
                        </section>
                    </div>
                </SectionFrame>
            </section>

            {relatedAnimals.length > 0 && (
                <section className="mx-auto mt-10 max-w-336 px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
                                Вони також шукають дім
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-normal text-gray-950">
                                Познайомтесь ще з кількома хвостиками
                            </h2>
                        </div>
                        <LinkButton
                            href={SITE_ROUTES.animals}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            Весь каталог
                        </LinkButton>
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
            href={buildAnimalHref(animal.id)}
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

function AnimalPhotoStorySlider({
                                    animal,
                                    images,
                                    selectedIndex,
                                    onSelect,
                                }: {
    animal: Animal
    images: string[]
    selectedIndex: number
    onSelect: (index: number) => void
}) {
    const showPrevious = () => {
        if (selectedIndex > 0) {
            onSelect(selectedIndex - 1)
        }
    }

    const showNext = () => {
        if (selectedIndex < images.length - 1) {
            onSelect(selectedIndex + 1)
        }
    }

    return (
        <section className="relative h-125 min-h-87.5 overflow-hidden rounded-[30px] bg-zinc-900 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.95)]">
            <div className="absolute left-0 right-0 top-4 z-30 flex gap-1.5 px-4">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelect(idx)}
                        className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/20"
                        aria-label={`Показати фото ${idx + 1}`}
                        aria-pressed={idx === selectedIndex}
                    >
            <span
                className="block h-full bg-white transition-all duration-300"
                style={{
                    width: idx <= selectedIndex ? '100%' : '0%',
                }}
            />
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 h-full w-full"
                >
                    <img
                        src={images[selectedIndex] ?? animal.imageUrl}
                        alt={`${animal.name} - фото ${selectedIndex + 1}`}
                        className="h-full w-full object-cover brightness-95"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute left-6 right-6 top-12 z-20 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-emerald-700 shadow-sm backdrop-blur">
          <BadgeCheck className="h-4 w-4" />
            {animal.badge ?? getReadinessLabel(animal)}
        </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-orange-500 shadow-sm backdrop-blur">
          <PawPrint className="h-5 w-5" />
        </span>
            </div>

            <div className="absolute left-3 top-1/2 z-30 -translate-y-1/2">
                {selectedIndex > 0 && (
                    <button
                        type="button"
                        onClick={showPrevious}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all hover:bg-black/60"
                        aria-label="Попереднє фото"
                    >
                        <ChevronLeft className="h-5 w-5 pointer-events-none" />
                    </button>
                )}
            </div>

            <div className="absolute right-3 top-1/2 z-30 -translate-y-1/2">
                {selectedIndex < images.length - 1 && (
                    <button
                        type="button"
                        onClick={showNext}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all hover:bg-black/60"
                        aria-label="Наступне фото"
                    >
                        <ChevronRight className="h-5 w-5 pointer-events-none" />
                    </button>
                )}
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-7 text-white sm:p-9">
                <h1 className="text-6xl font-black leading-none tracking-normal text-white sm:text-7xl">
                    {animal.name}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                    <MetaPill icon={VenusAndMars}>{animal.gender}</MetaPill>
                    <MetaPill icon={CalendarDays}>{animal.age}</MetaPill>
                </div>
            </div>
        </section>
    )
}

function buildStory(animal: Animal) {
    return `${animal.name} перебуває під опікою центру. Команда краще зрозуміла характер, потреби та темп життя, щоб підібрати родину, якій буде комфортно поруч із ним.`
}

function getReadinessLabel(animal: Animal) {
    return animal.isVaccinated && animal.isNeutered
        ? 'Готовий до адопції'
        : 'Потребує підготовки'
}
