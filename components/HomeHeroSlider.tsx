'use client'

import Image from 'next/image'
import type {KeyboardEvent} from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
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
import {AnimatePresence, motion} from 'motion/react'

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
    id: 'animals',
    label: 'Каталог',
    title: 'Книга хвостиків',
    description: 'Познайомтеся з тваринами, які шукають дім, прогулянку або добру людську увагу.',
    href: SITE_ROUTES.animals,
    cta: 'Відкрити каталог',
    image: '/Main_Catalog.png',
    imageAlt: 'Ілюстрація адопції тварини',
    icon: PawPrint,
  },
  {
    id: 'walks',
    label: 'Прогулянки',
    title: 'Прогулянки з тваринами',
    description: 'Подаруйте тварині час поруч, рух і кілька спокійних щасливих хвилин.',
    href: SITE_ROUTES.walks,
    cta: 'Дізнатись більше',
    image: '/Progulyanka.png',
    imageAlt: 'Собака чекає на прогулянку',
    icon: CalendarHeart,
  },
  {
    id: 'services',
    label: 'Послуги',
    title: 'Комерційні послуги центру',
    description: 'Консультації, догляд і допомога спеціалістів для власників тварин.',
    href: SITE_ROUTES.services,
    cta: 'Переглянути послуги',
    image: '/Kompos.png',
    imageAlt: 'Центр допомоги тваринам',
    icon: Stethoscope,
  },
  {
    id: 'center',
    label: 'Про центр',
    title: 'Центр допомоги тваринам',
    description: 'Рятуємо, лікуємо, соціалізуємо та допомагаємо тваринам знову довіряти людям.',
    href: SITE_ROUTES.contacts,
    cta: 'Дізнатись про центр',
    image: '/shelter_img.png',
    imageAlt: 'Ілюстрація центру допомоги тваринам',
    icon: ShieldCheck,
  },
  {
    id: 'contacts',
    label: 'Контакти',
    title: 'Графік і контакти',
    description: 'Адреса, телефон і вся інформація, щоб зручно запланувати візит.',
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
    description: 'Важливі оголошення, звіти центру та історії тварин, яким допомагаємо разом.',
    href: SITE_ROUTES.reportAndNews,
    cta: 'Читати новини',
    image: '/9328372.jpg',
    imageAlt: 'Ілюстрація тварини, що чекає на дім',
    icon: Newspaper,
  },
]

const AUTOPLAY_DELAY = 6500

export default function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [timerVersion, setTimerVersion] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)
  const activeSlide = slides[activeIndex]
  const Icon = activeSlide.icon

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener('change', updatePreference)

    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const updateVisibility = () => setIsPaused(document.hidden)

    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)

    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (isPaused || prefersReducedMotion) {
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, AUTOPLAY_DELAY)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [activeIndex, isPaused, prefersReducedMotion, timerVersion])

  const resetAutoplay = useCallback(() => {
    setTimerVersion((current) => current + 1)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index)
      resetAutoplay()
    },
    [resetAutoplay],
  )

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
    resetAutoplay()
  }, [resetAutoplay])

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slides.length)
    resetAutoplay()
  }, [resetAutoplay])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrevious()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  return (
    <section className="bg-transparent px-4 pt-5 pb-5 sm:px-6 sm:pt-7 sm:pb-6 lg:px-8 lg:pt-8 lg:pb-7">
      <div className="mx-auto w-full max-w-336">
        <div
          ref={sliderRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Головний слайдер"
          tabIndex={0}
          className="relative overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-[0_28px_90px_rgba(31,41,55,0.1)] outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false)
            resetAutoplay()
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="grid lg:h-[500px] lg:grid-cols-2 xl:h-[520px]">
            <div className="relative z-10 flex min-h-[260px] flex-col px-5 py-7 sm:min-h-[300px] sm:px-8 lg:min-h-0 lg:px-10 lg:py-12 xl:px-12 xl:py-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{opacity: 0, y: 18, filter: 'blur(8px)'}}
                  animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
                  exit={{opacity: 0, y: -14, filter: 'blur(8px)'}}
                  transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
                >
                  <div className="flex h-10 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary ring-1 ring-orange-100">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wide text-primary sm:text-sm">
                      {activeSlide.label}
                    </span>
                  </div>

                  <div className="mt-5 min-h-[10.5rem] max-w-xl sm:min-h-[12rem] lg:min-h-[13.5rem] xl:min-h-[14.5rem]">
                    <h1 className="text-[30px] leading-[1.03] font-black text-text-main sm:text-4xl lg:text-5xl xl:text-[56px]">
                      {activeSlide.title}
                    </h1>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-gray-600 sm:text-base sm:leading-7 lg:mt-5">
                      {activeSlide.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-auto w-full max-w-[270px] sm:max-w-[290px]">
                <LinkButton
                  href={activeSlide.href}
                  size="lg"
                  className="h-11 w-full justify-center rounded-xl px-5 text-sm sm:text-base lg:h-12"
                >
                  {activeSlide.cta}
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>

                <div className="mt-4 flex h-5 w-full items-center justify-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Перейти до слайду ${index + 1}`}
                      className="group flex h-5 w-8 items-center justify-center rounded-full"
                      onClick={() => goToSlide(index)}
                    >
                      <span
                        className={`block h-2.5 rounded-full transition-[width,background-color,box-shadow,transform] duration-300 ease-out ${
                          activeIndex === index
                            ? 'w-8 scale-105 bg-primary shadow-[0_6px_16px_rgba(242,116,56,0.28)]'
                            : 'w-2.5 bg-gray-300 group-hover:scale-110 group-hover:bg-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative h-[260px] overflow-hidden bg-gray-100 sm:h-[300px] md:h-[340px] lg:h-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.image}
                  initial={{opacity: 0, scale: 1.04}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 1.02}}
                  transition={{duration: 0.55, ease: [0.22, 1, 0.36, 1]}}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.imageAlt}
                    fill
                    preload={activeIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,41,55,0)_58%,rgba(31,41,55,0.18)_100%)] lg:bg-[linear-gradient(90deg,rgba(255,255,255,0.38)_0%,rgba(255,255,255,0.04)_30%,rgba(31,41,55,0)_100%)]" />

              <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 sm:right-6 sm:bottom-6">
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
        </div>
      </div>
    </section>
  )
}
