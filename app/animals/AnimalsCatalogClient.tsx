'use client'

import type {LucideIcon} from 'lucide-react'
import {
    ArrowLeft,
    ArrowRight,
    Bone,
    BookOpen,
    ChevronDown,
    Dog,
    PawPrint,
    Search,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-react'
import {useMemo} from 'react'
import { useQueryStates } from 'nuqs'
import AnimalCard from '@/components/AnimalCard'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button } from '@/components/ui/Button'
import {
    publicAnimalFilterParsers,
    type PublicAnimalCareFilter,
    type PublicAnimalFilters,
    type PublicAnimalGenderFilter,
    type PublicAnimalSizeFilter,
    type PublicAnimalSort,
    type PublicAnimalSortOrder,
} from '@/lib/public-animal-filter-parsers'
import type {Animal} from '@/types'


const ITEMS_PER_PAGE = 6

const EMPTY_FEATURED_ANIMAL: Animal = {
    id: 'empty',
    name: 'Наші хвостики',
    age: 'Чекають на знайомство',
    gender: 'Самець',
    size: 'Середній',
    stayDuration: 'Анкета активна',
    badge: 'Каталог оновлюється',
    imageUrl: '/dog.png',
    character: ['Шукає родину'],
    adoptionStatus: null,
    isVaccinated: false,
    isNeutered: false,
    description: 'У каталозі скоро зʼявляться тварини, які шукають дім.',
}

const genderByAnimalValue: Record<Animal['gender'], PublicAnimalGenderFilter> = {
    Самець: 'male',
    Самка: 'female',
}

const sizeByAnimalValue: Record<Animal['size'], PublicAnimalSizeFilter> = {
    Малий: 'small',
    Середній: 'medium',
    Великий: 'large',
}

const genderOptions: Array<{ label: string; value: PublicAnimalGenderFilter }> = [
    {label: 'Усі', value: 'all'},
    {label: 'Самці', value: 'male'},
    {label: 'Самки', value: 'female'},
]

const sizeOptions: Array<{ label: string; value: PublicAnimalSizeFilter }> = [
    {label: 'Усі', value: 'all'},
    {label: 'Малий', value: 'small'},
    {label: 'Середній', value: 'medium'},
    {label: 'Великий', value: 'large'},
]

const careOptions: Array<{ label: string; value: PublicAnimalCareFilter }> = [
    {label: 'Усі', value: 'all'},
    {label: 'Готові до дому', value: 'ready'},
    {label: 'Потребують турботи', value: 'needs_care'},
]

const sortOptions: Array<{ label: string; value: PublicAnimalSort }> = [
    {label: 'Найновіші', value: 'newest'},
    {label: 'За іменем', value: 'name'},
]

const sortOrderOptions: Array<{ label: string; value: PublicAnimalSortOrder }> = [
    {label: 'А-Я', value: 'asc'},
    {label: 'Я-А', value: 'desc'},
]

export default function AnimalsCatalogClient({ animals }: { animals: Animal[] }) {
    const [filters, setFilters] = useQueryStates(publicAnimalFilterParsers, {
        history: 'push',
    })

    const filteredAnimals = useMemo(() => {
        const normalizedSearch = filters.q.trim().toLowerCase()

        return animals.filter((animal) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [animal.name, animal.age, animal.description, animal.badge, ...animal.character]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch)

            const matchesGender =
                filters.gender === 'all' ||
                genderByAnimalValue[animal.gender] === filters.gender
            const matchesSize =
                filters.size === 'all' ||
                sizeByAnimalValue[animal.size] === filters.size
            const matchesCare =
                filters.care === 'all' ||
                animal.adoptionStatus === filters.care

            return matchesSearch && matchesGender && matchesSize && matchesCare
        }).sort((first, second) => {
            if (filters.sort === 'name') {
                const result = first.name.localeCompare(second.name, 'uk')
                return filters.order === 'desc' ? -result : result
            }

            return getDateScore(second) - getDateScore(first)
        })
    }, [animals, filters.care, filters.gender, filters.order, filters.q, filters.size, filters.sort])

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE),
    )
    const currentPage = Math.min(Math.max(1, filters.page), totalPages)
    const currentAnimals = filteredAnimals.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    )
    const featuredAnimal = filteredAnimals[0] ?? animals[0] ?? EMPTY_FEATURED_ANIMAL
    const activeFiltersCount = [
        filters.q.trim(),
        filters.gender !== 'all',
        filters.size !== 'all',
        filters.care !== 'all',
    ].filter(Boolean).length

    function updateFilter<Key extends keyof PublicAnimalFilters>(
        key: Key,
        value: PublicAnimalFilters[Key],
        resetPage = true,
    ) {
        type FilterUpdate = Parameters<typeof setFilters>[0]
        void setFilters({
            [key]: value,
            ...(resetPage ? { page: 1 } : {}),
        } as FilterUpdate)
    }

    function updateSort(value: PublicAnimalSort) {
        void setFilters({
            sort: value,
            order: value === 'name' ? filters.order : 'asc',
            page: 1,
        })
    }

    function resetFilters() {
        void setFilters({
            q: '',
            gender: 'all',
            size: 'all',
            care: 'all',
            sort: 'newest',
            order: 'asc',
            page: 1,
        })
    }

    return (
        <main className="storybook-bg min-h-screen overflow-hidden text-text-main">
            <StorybookDecorations/>
            <PageHero
                eyebrow="Книга хвостиків"
                title="Відкрийте сторінку, де починається дружба"
                description="Кожна анкета тут як маленька казка: з фото, історією, турботою і шансом знайти свій дім."
                icon={BookOpen}
            >
                <div className="orange-neon relative overflow-hidden rounded-3xl bg-gray-950">
                    <img
                        src={featuredAnimal.imageUrl}
                        alt={featuredAnimal.name}
                        className="h-90 w-full object-cover opacity-75"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent"/>
                    <DecorativeIcon
                        icon={PawPrint}
                        className="left-7 top-8 text-primary-second"
                    />
                    <DecorativeIcon
                        icon={Bone}
                        className="right-8 top-10 text-white"
                        delayClass="[animation-delay:700ms]"
                    />
                    <DecorativeIcon
                        icon={Dog}
                        className="bottom-24 right-16 text-primary"
                        delayClass="[animation-delay:1000ms]"
                    />
                    <div className="absolute bottom-6 left-6 right-6">
            <span
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-text-main backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary"/>
              Герой сторінки
            </span>
                        <h2 className="mt-3 text-4xl font-black text-white">
                            {featuredAnimal.name}
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                            {featuredAnimal.description}
                        </p>
                    </div>
                </div>
            </PageHero>

            <section className="relative z-20 mx-auto -mt-10 max-w-336 px-4 pb-12 sm:px-6 lg:px-8">
                <SectionFrame className="rounded-[28px] border-gray-100 p-4 sm:p-5">
                    <div className="relative flex flex-col gap-4">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
                            <label className="relative block">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="search"
                                    placeholder="Знайти героя за іменем або історією"
                                    value={filters.q}
                                    onChange={(event) => updateFilter('q', event.target.value)}
                                    className="h-13 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-12 pr-4 text-sm font-bold text-text-main outline-none transition-all placeholder:text-gray-400 focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10"
                                />
                            </label>

                            <label className="relative block">
                                <SlidersHorizontal
                                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
                                <select
                                    value={filters.sort}
                                    onChange={(event) =>
                                        updateSort(event.target.value as PublicAnimalSort)
                                    }
                                    className="h-13 w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 px-12 text-sm font-bold text-text-main outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/10"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
                            </label>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            <FilterGroup label="Стать" icon={Dog}>
                                {genderOptions.map((option) => (
                                    <FilterButton
                                        key={option.value}
                                        isActive={filters.gender === option.value}
                                        onClick={() => updateFilter('gender', option.value)}
                                    >
                                        {option.label}
                                    </FilterButton>
                                ))}
                            </FilterGroup>

                            <FilterGroup label="Розмір" icon={PawPrint}>
                                {sizeOptions.map((option) => (
                                    <FilterButton
                                        key={option.value}
                                        isActive={filters.size === option.value}
                                        onClick={() => updateFilter('size', option.value)}
                                    >
                                        {option.label}
                                    </FilterButton>
                                ))}
                            </FilterGroup>

                            <FilterGroup label="Готовність" icon={Sparkles}>
                                {careOptions.map((option) => (
                                    <FilterButton
                                        key={option.value}
                                        isActive={filters.care === option.value}
                                        onClick={() => updateFilter('care', option.value)}
                                    >
                                        {option.label}
                                    </FilterButton>
                                ))}
                            </FilterGroup>

                            {filters.sort === 'name' ? (
                                <FilterGroup label="Порядок імені" icon={SlidersHorizontal}>
                                    {sortOrderOptions.map((option) => (
                                        <FilterButton
                                            key={option.value}
                                            isActive={filters.order === option.value}
                                            onClick={() => updateFilter('order', option.value)}
                                        >
                                            {option.label}
                                        </FilterButton>
                                    ))}
                                </FilterGroup>
                            ) : null}
                        </div>
                    </div>
                </SectionFrame>

                <div className="mb-8 mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">
                            <Sparkles className="h-3.5 w-3.5"/>
                            Знайдено {filteredAnimals.length}
                        </p>
                        <h2 className="mt-3 text-4xl font-extrabold text-text-main">
                            Розділ пригод
                        </h2>
                    </div>

                    {activeFiltersCount > 0 && (
                        <Button
                            type="button"
                            onClick={resetFilters}
                            variant="outline"
                            size="sm"
                            className="h-11 w-full sm:w-auto"
                        >
                            <PawPrint className="h-4 w-4"/>
                            Скинути фільтри ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                {currentAnimals.length === 0 ? (
                    <EmptyState onReset={resetFilters}/>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {currentAnimals.map((animal, index) => (
                                <AnimalCard
                                    key={animal.id}
                                    animal={animal}
                                    index={index}
                                    className="shadow-soft"
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onChange={(page) => updateFilter('page', page, false)}
                        />
                    </>
                )}
            </section>
        </main>
    )
}

function DecorativeIcon({
                            icon: Icon,
                            className,
                            delayClass = '',
                        }: {
    icon: LucideIcon
    className: string
    delayClass?: string
}) {
    return (
        <span
            className={`storybook-float pointer-events-none absolute hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur md:flex ${className} ${delayClass}`}
        >
      <Icon className="h-7 w-7"/>
    </span>
    )
}

function FilterGroup({
                         label,
                         icon: Icon,
                         children,
                     }: {
    label: string
    icon: LucideIcon
    children: React.ReactNode
}) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                <Icon className="h-3.5 w-3.5 text-primary"/>
                {label}
            </div>
            <div className="flex flex-wrap gap-2">{children}</div>
        </div>
    )
}

function FilterButton({
                          isActive,
                          onClick,
                          children,
                      }: {
    isActive: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <Button
            type="button"
            onClick={onClick}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
        >
            {children}
        </Button>
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
    const pages = Array.from({length: totalPages}, (_, index) => index + 1)

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
                variant="outline"
                size="sm"
                className="h-11"
            >
                <ArrowLeft className="h-4 w-4"/>
                Назад
            </Button>

            {pages.map((page) => (
                <Button
                    key={page}
                    type="button"
                    onClick={() => onChange(page)}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="icon"
                    className="h-11 w-11"
                >
                    {page}
                </Button>
            ))}

            <Button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onChange(currentPage + 1)}
                variant="outline"
                size="sm"
                className="h-11"
            >
                Далі
                <ArrowRight className="h-4 w-4"/>
            </Button>
        </nav>
    )
}

function EmptyState({onReset}: { onReset: () => void }) {
    return (
        <SectionFrame className="rounded-[28px] border-dashed border-gray-200 p-10 text-center">
            <div
                className="storybook-wiggle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                <Search className="h-7 w-7"/>
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-text-main">
                Цю сторінку ще треба знайти
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-gray-500">
                Спробуйте змінити розмір, стать або статус готовності.
            </p>
            <Button type="button" onClick={onReset} className="mt-6">
                Показати всіх
            </Button>
        </SectionFrame>
    )
}

function getDateScore(animal: Animal) {
    const value = Date.parse(animal.publishedAt ?? animal.createdAt ?? '')
    return Number.isNaN(value) ? 0 : value
}
