'use client'
import useEmblaCarousel from 'embla-carousel-react'
import {ArrowRight, ChevronLeft, ChevronRight} from 'lucide-react'
import AnimalCard from '@/components/AnimalCard'
import {MOCK_ANIMALS} from '@/mockData'
import {IconButton, LinkButton} from '@/components/ui/Button'

export default function AnimalWaitCatalog() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
        loop: false,
    })

    return (
            <section id="adopt" className="py-24 pb-12">
                <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
                        <div className="max-w-2xl">
                            <h2 className="mb-4 text-4xl font-extrabold text-text-main md:text-5xl">
                                Вони чекають на вас
                            </h2>
                            <p className="text-lg leading-8 text-gray-500">
                                Познайомтеся з собаками, які шукають люблячу родину.
                                Кожен має свою історію і заслуговує на спокійний дім.
                            </p>
                        </div>

                        <LinkButton
                            href="/animals"
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            До всіх тварин
                            <ArrowRight className="h-4 w-4"/>
                        </LinkButton>
                    </div>

                    <div className="relative">
                        <div className="animal-carousel min-w-0">
                            <div ref={emblaRef} className="overflow-hidden">
                                <div className="flex gap-4 xl:gap-6">
                                    {MOCK_ANIMALS.map((animal, index) => (
                                        <AnimalCard
                                            key={animal.id}
                                            animal={animal}
                                            index={index}
                                            className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] xl:flex-[0_0_calc(33.333%-16px)] 2xl:flex-[0_0_calc(25%-18px)]"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            className="pointer-events-none absolute inset-y-0 right-2 left-2 z-20 flex items-center justify-between">
                            <IconButton
                                type="button"
                                aria-label="Прокрутити назад"
                                label="Прокрутити назад"
                                variant="light"
                                className="pointer-events-auto opacity-70 backdrop-blur hover:opacity-100 hover:text-primary"
                                onClick={() => emblaApi?.scrollPrev()}
                            >
                                <ChevronLeft className="h-5 w-5"/>
                            </IconButton>
                            <IconButton
                                type="button"
                                aria-label="Прокрутити вперед"
                                label="Прокрутити вперед"
                                variant="light"
                                className="pointer-events-auto opacity-70 backdrop-blur hover:opacity-100 hover:text-primary"
                                onClick={() => emblaApi?.scrollNext()}
                            >
                                <ChevronRight className="h-5 w-5"/>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </section>

    )
}
