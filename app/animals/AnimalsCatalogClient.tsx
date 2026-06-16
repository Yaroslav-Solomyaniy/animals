'use client'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
} from 'lucide-react'
import type { FC } from 'react'

import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import Section from '@/components/ui/Section'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button } from '@/components/ui/Button'
import type { Animal } from '@/types'
import AnimalsFilter from '@/app/animals/_components/animalsFilter'
import AnimalsHeroFriend from '@/app/animals/_components/animalsHeroFriend'
import AnimalCard from '@/components/AnimalCard'
import { useAnimalUrlFilters } from '@/hooks/useAnimalUrlFilters'
import GoWalks from '@/components/GoWalks'

interface Props {
  animals: Animal[]
  foundCount: number
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export const AnimalsCatalogClient: FC<Props> = ({ animals, foundCount, pagination }) => {
  const { updateFilter, resetFilters } = useAnimalUrlFilters()

  return (
    <main className="storybook-bg min-h-screen overflow-hidden text-text-main">
      <StorybookDecorations />

      <PageHero
        eyebrow="Книга хвостиків"
        title="Вітаємо на сторінці, де починається дружба"
        description="Кожна анкета тут як маленька казка: з фото, історією, турботою і шансом знайти свій дім."
        icon={BookOpen}
      >
        <AnimalsHeroFriend />
      </PageHero>

      {/* Catalog */}
      <Section id="animals-catalog" className="relative z-20 scroll-mt-24 pb-16">
        {/* Filters */}
        <SectionFrame className="rounded-[28px] border-gray-100 p-4 sm:p-5">
          <AnimalsFilter />
        </SectionFrame>

        {/* Catalog header */}
        <div className="mb-7 mt-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Знайдено {foundCount}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold text-text-main">Розділ пригод</h2>
        </div>

        {/* Output */}
        {animals.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {animals.map((animal, index) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  index={index}
                  className="shadow-soft"
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onChange={(page: number) => updateFilter('page', page, false)}
            />
          </>
        )}
      </Section>

      <GoWalks />
    </main>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Button type="button" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)} variant="primary" size="sm" className="h-11">
        <ArrowLeft className="h-4 w-4" />
        Назад
      </Button>
      {pages.map((page) => (
        <Button key={page} type="button" onClick={() => onChange(page)} variant={currentPage === page ? 'primary' : 'outline'} size="icon" className="h-11 w-11">
          {page}
        </Button>
      ))}
      <Button type="button" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)} variant="primary" size="sm" className="h-11">
        Далі
        <ArrowRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <SectionFrame className="rounded-[28px] border-dashed border-gray-200 p-10 text-center">
      <div className="storybook-wiggle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-primary">
        <Search className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-2xl font-extrabold text-text-main">Цю сторінку ще треба знайти</h3>
      <p className="mx-auto mt-2 max-w-xl text-gray-500">Спробуйте змінити розмір, стать або статус готовності.</p>
      <Button type="button" onClick={onReset} className="mt-6">Показати всіх</Button>
    </SectionFrame>
  )
}
