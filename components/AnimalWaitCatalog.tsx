'use client'

import {useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react'
import Section from '@/components/ui/Section'

import AnimalCard from '@/components/AnimalCard'
import {LinkButton} from '@/components/ui/Button'
import {SITE_ROUTES} from '@/lib/site-config'
import type {Animal} from '@/types'
import StorybookDecorations from "@/components/ui/StorybookDecorations";

export default function AnimalWaitCatalog({ animals }: { animals: Animal[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    watchDrag: false,
    loop: false,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial button state from embla, its own recommended usage pattern
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
      <section
          id="adopt"
          className="overflow-hidden bg-mauve-50 px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-336">
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
            <div className="relative">
              <div ref={emblaRef} className="overflow-hidden py-4">
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

              <LinkButton
                  href={SITE_ROUTES.animals}
                  variant="outline"
                  className="mt-4 h-11 w-full rounded-xl px-4 text-sm lg:hidden"
              >
                Перейти до всіх тварин
                <ArrowRight className="h-4 w-4" />
              </LinkButton>

              <div className="pointer-events-none absolute inset-y-0 left-2 right-2 z-20 flex items-center justify-between">
                <button
                    type="button"
                    aria-label="Попередня тварина"
                    disabled={!canScrollPrev}
                    className="pointer-events-auto inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/85 text-gray-700 opacity-70 shadow-sm backdrop-blur transition hover:border-white hover:bg-white hover:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
                    onClick={() => emblaApi?.scrollPrev()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    aria-label="Наступна тварина"
                    disabled={!canScrollNext}
                    className="pointer-events-auto inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/85 text-gray-900 opacity-70 shadow-sm backdrop-blur transition hover:border-white hover:bg-white hover:text-primary hover:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
                    onClick={() => emblaApi?.scrollNext()}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
