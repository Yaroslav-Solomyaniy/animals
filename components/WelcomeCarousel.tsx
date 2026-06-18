import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, CalendarHeart, ChevronLeft, ChevronRight, Newspaper, Pause, PawPrint, Phone, Play, Stethoscope } from 'lucide-react'
import { SITE_ROUTES } from '@/lib/site-config'
import { LinkButton } from '@/components/ui/Button'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'

type HomeScreenSlide = {
  id: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  cta: string
  href: string
  icon: LucideIcon
}

const slides: Array<HomeScreenSlide> = [
  {
    id: 'animals',
    label: 'Каталог',
    title: 'Книга хвостиків',
    description: 'Познайомтеся з тваринами, які шукають дім, прогулянку або добру людську увагу.',
    href: SITE_ROUTES.animals,
    cta: 'Відкрити каталог',
    image: '/main_slider/1.png',
    imageAlt: 'Щасливі тварини',
    icon: PawPrint,
  },
  {
    id: 'walks',
    label: 'Прогулянки',
    title: 'Прогулянки з тваринами',
    description: 'Подаруйте тварині час поруч, рух і кілька спокійних щасливих хвилин.',
    href: SITE_ROUTES.walks,
    cta: 'Дізнатись більше',
    image: '/main_slider/2.png',
    imageAlt: 'Людина з собакою на прогулянці',
    icon: CalendarHeart,
  },
  {
    id: 'services',
    label: 'Послуги',
    title: 'Комерційні послуги центру',
    description: 'Консультації, догляд і допомога спеціалістів для власників тварин.',
    href: SITE_ROUTES.services,
    cta: 'Переглянути послуги',
    image: '/main_slider/3.png',
    imageAlt: 'Забота про тварин',
    icon: Stethoscope,
  },
  {
    id: 'contacts',
    label: 'Контакти',
    title: 'Графік і контакти',
    description: 'Адреса, телефон і вся інформація, щоб зручно запланувати візит.',
    href: SITE_ROUTES.contacts,
    cta: 'Відкрити контакти',
    image: '/main_slider/4.png',
    imageAlt: 'Тварина вітається з мапою та довідником',
    icon: Phone,
  },
  {
    id: 'news',
    label: 'Новини',
    title: 'Новини та звіти',
    description: 'Важливі оголошення, звіти центру та історії тварин, яким допомагаємо разом.',
    href: SITE_ROUTES.reportAndNews,
    cta: 'Читати новини',
    image: '/main_slider/5.png',
    imageAlt: 'Ілюстрація тварини, що читає газету',
    icon: Newspaper,
  },
]

const AUTOPLAY_DELAY = 2500

const WelcomeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHoverPaused, setIsHoverPaused] = useState(false)
  const [timerVersion, setTimerVersion] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const activeSlide = slides[activeIndex]
  const ActiveIcon = activeSlide.icon
  const isAutoplayPaused = isPaused || isHoverPaused

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

    if (isAutoplayPaused || prefersReducedMotion) {
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
  }, [activeIndex, isAutoplayPaused, prefersReducedMotion, timerVersion])

  const resetAutoplay = useCallback(() => {
    setTimerVersion((current) => current + 1)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index)
      resetAutoplay()
    },
    [resetAutoplay]
  )

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
    resetAutoplay()
  }, [resetAutoplay])

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slides.length)
    resetAutoplay()
  }, [resetAutoplay])

  const handlePauseAndPlayClick = () => {
    setIsPaused(!isPaused)
  }

  const handleMouseEnter = () => {
    setIsHoverPaused(true)
  }

  const handleMouseLeave = () => {
    setIsHoverPaused(false)
    resetAutoplay()
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Головна карусель центру допомоги тваринам"
      tabIndex={0}
      aria-roledescription="carousel"
      className="relative grid min-h-0 border-t border-gray-100 bg-[#f1f6f0] lg:border-t-0 lg:border-l"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={activeSlide.image}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.995 }}
          transition={{
            opacity: { duration: 0.5, ease: 'easeOut' },
            scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
          }}
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(15,23,42,0.08)_52%,rgba(15,23,42,0.38)_100%)]" />

      <div className="relative z-10 grid h-full content-between p-4 sm:p-6 lg:p-8">
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            aria-label="Попередній слайд"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:text-primary"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Пауза/Продовжити"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:text-primary"
            onClick={handlePauseAndPlayClick}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button
            type="button"
            aria-label="Наступний слайд"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:text-primary"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="rounded-[22px] bg-white/95 p-4 text-text-main shadow-[0_22px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:ml-4"
          >
            <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{activeSlide.label}</p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary sm:h-10 sm:w-10">
                <ActiveIcon className="h-5 w-5" />
              </span>
            </div>

            <h2 className="text-lg leading-tight font-black sm:text-[24px] lg:text-[26px]">{activeSlide.title}</h2>
            <p className="mt-2 text-sm leading-5 font-bold text-gray-600 sm:mt-3 sm:text-[15px] sm:leading-6">{activeSlide.description}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
              <LinkButton
                href={activeSlide.href}
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl px-0 text-primary hover:bg-transparent hover:text-orange-700"
              >
                {activeSlide.cta}
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Перейти до слайду ${index + 1}: ${slide.label}`}
                    className="group flex h-5 w-7 items-center justify-center rounded-full"
                    onClick={() => goToSlide(index)}
                  >
                    <span
                      className={`relative block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                        activeIndex === index ? 'w-8 bg-orange-200' : 'w-2 bg-gray-300 group-hover:bg-gray-400'
                      }`}
                    >
                      {activeIndex === index ? (
                        <motion.span
                          key={`${activeSlide.id}-progress`}
                          className="absolute inset-y-0 left-0 rounded-full bg-primary"
                          initial={{ width: '18%' }}
                          animate={{ width: prefersReducedMotion || isAutoplayPaused ? '55%' : '100%' }}
                          transition={{
                            duration: prefersReducedMotion || isAutoplayPaused ? 0.2 : AUTOPLAY_DELAY / 1000,
                            ease: 'linear',
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WelcomeCarousel
