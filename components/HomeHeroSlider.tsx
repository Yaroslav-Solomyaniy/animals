'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'
import type {LucideIcon} from 'lucide-react'
import {
  ArrowRight,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  PawPrint,
  Phone,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'

import {LinkButton} from '@/components/ui/Button'
import {SITE_ROUTES} from '@/lib/site-config'

type Slide = {
  id: string
  label: string
  title: string
  description: string
  href: string
  cta: string
  image: string
  imageAlt: string
  icon: LucideIcon
}

const slides: Slide[] = [
  {
    id: 'walks',
    label: 'Прогулянки',
    title: 'Прогулянки з тваринами',
    description:
      'Оберіть хвостика, приходьте у зручний час і подаруйте йому увагу, рух та кілька щасливих хвилин поруч.',
    href: SITE_ROUTES.walks,
    cta: 'Дізнатись більше',
    image: '/DogHelp.png',
    imageAlt: 'Собака чекає на прогулянку',
    icon: CalendarHeart,
  },
  {
    id: 'services',
    label: 'Послуги',
    title: 'Комерційні послуги центру',
    description:
      'Окремі послуги для власників тварин: консультації, догляд і допомога спеціалістів центру.',
    href: SITE_ROUTES.services,
    cta: 'Переглянути послуги',
    image: '/shelter_img.png',
    imageAlt: 'Центр допомоги тваринам',
    icon: Stethoscope,
  },
  {
    id: 'center',
    label: 'Про центр',
    title: 'Про центр допомоги тваринам',
    description:
      'Ми рятуємо, лікуємо, соціалізуємо та допомагаємо безпритульним тваринам знову довіряти людям.',
    href: SITE_ROUTES.contacts,
    cta: 'Дізнатись про центр',
    image: '/shelter_img.png',
    imageAlt: 'Ілюстрація центру допомоги тваринам',
    icon: ShieldCheck,
  },
  {
    id: 'animals',
    label: 'Каталог',
    title: 'Книга хвостиків',
    description:
      'Познайомтеся з тваринами, які шукають родину, прогулянку або просто добру людську увагу.',
    href: SITE_ROUTES.animals,
    cta: 'Відкрити каталог',
    image: '/3811975.jpg',
    imageAlt: 'Ілюстрація адопції тварини',
    icon: PawPrint,
  },
  {
    id: 'contacts',
    label: 'Контакти',
    title: 'Контакти та графік роботи',
    description:
      'Адреса, телефон, пошта, графік роботи та вся інформація, щоб зручно запланувати візит.',
    href: SITE_ROUTES.contacts,
    cta: 'Відкрити контакти',
    image: '/DogHelp.png',
    imageAlt: 'Тварина поруч із людиною',
    icon: Phone,
  },
  {
    id: 'news',
    label: 'Новини',
    title: 'Звіти та новини',
    description:
      'Читайте новини центру, важливі оголошення, звіти та історії тварин, яким допомагаємо разом.',
    href: SITE_ROUTES.reportAndNews,
    cta: 'Читати новини',
    image: '/9328372.jpg',
    imageAlt: 'Ілюстрація тварини, що чекає на дім',
    icon: Newspaper,
  },
]

export default function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex]
  const Icon = activeSlide.icon

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 7000)

    return () => window.clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  return (

      <div className="relative mx-auto w-full max-w-336 mt-5">
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-[#fff8f1] shadow-[0_22px_70px_rgba(31,41,55,0.07)]">
          <div className="grid h-[620px] md:h-[430px] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-h-0 flex-col justify-center p-5 sm:p-8 lg:p-10 xl:p-12">
              <span className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <Icon className="h-6 w-6" />
              </span>

              <h3 className="max-w-xl text-3xl font-black leading-tight text-text-main sm:text-4xl lg:text-5xl">
                {activeSlide.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                {activeSlide.description}
              </p>

              <LinkButton
                  href={activeSlide.href}
                  className="mt-7 h-12 w-full justify-center rounded-xl px-6 text-sm sm:w-fit sm:text-base"
              >
                {activeSlide.cta}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>

            <div className="relative min-h-0 overflow-hidden bg-gray-100">
              <Image
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  preload={activeIndex === 0}
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="object-cover"
              />
            </div>
          </div>

          <div className="absolute right-4 bottom-4 z-20 flex gap-2 sm:right-6 sm:bottom-6">
            <button
                type="button"
                aria-label="Попередній слайд"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary"
                onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                type="button"
                aria-label="Наступний слайд"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary bg-primary text-white shadow-sm transition hover:bg-orange-600"
                onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
  )
}
