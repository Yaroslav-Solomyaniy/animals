'use client'

import useEmblaCarousel from 'embla-carousel-react'
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react'

import AnimalCard from '@/components/AnimalCard'
import {LinkButton} from '@/components/ui/Button'
import {SITE_ROUTES} from '@/lib/site-config'
import type {Animal} from '@/types'

export default function AnimalWaitCatalog({ animals }: { animals: Animal[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
  })

  return (
    <section
      id="adopt"
      className="bg-transparent pt-12 pb-8 sm:pt-16 sm:pb-10 md:pt-20 md:pb-8 lg:pt-24 lg:pb-12"
    >
      <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
        <div className="mb-7 grid gap-5 sm:mb-9 md:mb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6">
          <div className="min-w-0 max-w-2xl">
            <h2 className="mb-3 text-3xl font-extrabold leading-tight text-text-main sm:text-4xl md:mb-4 md:text-5xl">
              Вони чекають на вас
            </h2>
            <p className="text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
              Познайомтеся з собаками, які шукають люблячу родину. Кожен має
              свою історію і заслуговує на спокійний дім.
            </p>
          </div>

          <LinkButton
            href={SITE_ROUTES.animals}
            variant="primary"
            className="hidden h-10 w-fit max-w-full shrink-0 px-4 text-sm lg:inline-flex"
          >
            Загальний перелік тварин
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="relative">
          <div className="relative min-w-0">
            <div className="animal-carousel min-w-0">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
                  {animals.map((animal, index) => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      index={index}
                      className="flex-[0_0_100%] sm:flex-[0_0_calc(85%-8px)] md:flex-[0_0_calc(50%-10px)] xl:flex-[0_0_calc(33.333%-16px)] 2xl:flex-[0_0_calc(33.333%-18px)]"
                    />
                  ))}
                </div>
              </div>
            </div>

            <LinkButton
              href={SITE_ROUTES.animals}
              variant="outline"
              className="mt-4 h-11 w-full rounded-xl px-4 text-sm lg:hidden"
            >
              Перейти до всіх тварин
              <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <div className="mt-5 grid grid-cols-2 gap-2 md:pointer-events-none md:absolute md:inset-y-0 md:right-2 md:left-2 md:z-20 md:mt-0 md:flex md:items-center md:justify-between">
              <button
                type="button"
                aria-label="Попередня тварина"
                className="pointer-events-auto inline-flex h-11 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-orange-100 bg-white px-2 text-xs font-extrabold text-gray-700 shadow-sm transition hover:border-primary/35 hover:bg-orange-50 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.98] md:h-11 md:w-11 md:rounded-full md:border-white/70 md:bg-white/85 md:p-0 md:opacity-70 md:backdrop-blur md:hover:border-white md:hover:bg-white md:hover:opacity-100"
                onClick={() => emblaApi?.scrollPrev()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="md:hidden">Попередня тварина</span>
              </button>
              <button
                type="button"
                aria-label="Наступна тварина"
                className="pointer-events-auto inline-flex h-11 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary px-2 text-xs font-extrabold text-white shadow-sm shadow-primary/20 transition hover:border-orange-600 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.98] md:h-11 md:w-11 md:rounded-full md:border-white/70 md:bg-white/85 md:p-0 md:text-gray-900 md:opacity-70 md:backdrop-blur md:hover:border-white md:hover:bg-white md:hover:text-primary md:hover:opacity-100"
                onClick={() => emblaApi?.scrollNext()}
              >
                <span className="md:hidden">Наступна тварина</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
