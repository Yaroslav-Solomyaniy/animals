import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import AnimalCard from '@/components/AnimalCard'
import { MOCK_ANIMALS } from '@/mockData'

export default function AnimalCatalog() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
  })

  return (
    <section id="adopt" className="bg-neutral-base py-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-4xl font-extrabold text-text-main md:text-5xl">
              Вони чекають на вас
            </h2>
            <p className="text-lg leading-8 text-gray-500">
              Познайомтеся з собаками, які шукають люблячу родину. Кожен має
              свою історію і заслуговує на спокійний дім.
            </p>
          </div>

          <a
            href="/dogs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-7 py-3.5 font-bold text-text-main transition-all hover:border-primary hover:text-primary sm:w-auto"
          >
            До всіх тварин
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative">
          <div className="animal-carousel min-w-0 md:px-14">
            <div ref={emblaRef} className="overflow-hidden p-2">
              <div className="-m-2 flex p-2 md:gap-6">
                {MOCK_ANIMALS.map((animal, index) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    index={index}
                    className="flex-[0_0_100%] sm:flex-[0_0_300px] md:flex-[0_0_310px]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-3 md:pointer-events-none md:absolute md:inset-y-0 md:right-0 md:left-0 md:mt-0 md:items-center md:justify-between">
            <button
              type="button"
              aria-label="Прокрутити назад"
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white text-text-main transition-all hover:border-primary hover:text-primary"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Прокрутити вперед"
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white text-text-main transition-all hover:border-primary hover:text-primary"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
