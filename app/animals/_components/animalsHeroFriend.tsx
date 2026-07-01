'use client'

import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowDown, HeartHandshake, PawPrint, ShieldCheck, Smile, Sparkles, Stethoscope } from 'lucide-react'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { LinkButton } from '@/components/ui/Button'

type Benefit = {
  id: string
  short: string
  hint: string
  title: string
  text: string
  icon: LucideIcon
  accent: string
}

const benefits: Benefit[] = [
  {
    id: 'health',
    short: 'Здоров\'я',
    hint: 'огляд, щеплення',
    title: 'Оглянутий і вакцинований',
    text: 'Кожен хвостик проходить огляд ветеринара, щеплення та лікування ще до знайомства з вами.',
    icon: Stethoscope,
    accent: 'bg-orange-50 text-primary ring-orange-100',
  },
  {
    id: 'safe',
    short: 'Турбота',
    hint: 'стерилізація',
    title: 'Стерилізований відповідально',
    text: 'Ми наперед дбаємо про здоров\'я тварини — це безпечно для неї та спокійно для вас.',
    icon: ShieldCheck,
    accent: 'bg-emerald-50 text-secondary ring-emerald-100',
  },
  {
    id: 'social',
    short: 'Характер',
    hint: 'любить людей',
    title: 'Соціалізований і лагідний',
    text: 'Звик до людей, рук і прогулянок — готовий довіряти знову й любити свою родину.',
    icon: Smile,
    accent: 'bg-sky-50 text-sky-600 ring-sky-100',
  },
  {
    id: 'support',
    short: 'Підтримка',
    hint: 'завжди поруч',
    title: 'Ми поруч після адопції',
    text: 'Порада, супровід і відповіді на питання — навіть тоді, коли друг уже вдома у вас.',
    icon: HeartHandshake,
    accent: 'bg-rose-50 text-rose-500 ring-rose-100',
  },
]

const AUTO_ADVANCE = 4200

export default function AnimalsHeroFriend() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const pointerX = useMotionValue(50)
  const pointerY = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${pointerX}% ${pointerY}%, rgba(242,116,56,0.08), transparent 72%)`
  const tiltX = useSpring(useTransform(pointerY, [0, 100], [3, -3]), { stiffness: 150, damping: 20 })
  const tiltY = useSpring(useTransform(pointerX, [0, 100], [-3.5, 3.5]), { stiffness: 150, damping: 20 })

  const barWidth = useMotionValue('0%')

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % benefits.length)
    }, AUTO_ADVANCE)
    return () => window.clearInterval(timer)
  }, [isPaused, prefersReducedMotion])

  // Auto-advance bar
  useEffect(() => {
    if (hoveredIndex !== null) return
    barWidth.set('0%')
    if (isPaused || prefersReducedMotion) return
    const controls = animate(barWidth, '100%', { duration: AUTO_ADVANCE / 1000, ease: 'linear' })
    return () => controls.stop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused, prefersReducedMotion, hoveredIndex])

  // Hover: bar reaches hovered tab
  useEffect(() => {
    if (hoveredIndex === null) return
    animate(barWidth, `${((hoveredIndex + 1) / benefits.length) * 100}%`, {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIndex])

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width) * 100)
    pointerY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  function handlePointerLeave() {
    pointerX.set(50)
    pointerY.set(50)
    setIsPaused(false)
  }

  const active = benefits[index]
  const ActiveIcon = active.icon

  return (
    <div className="perspective-[1400px]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX: prefersReducedMotion ? 0 : tiltX, rotateY: prefersReducedMotion ? 0 : tiltY, transformStyle: 'preserve-3d' }}
        className="section-frame relative isolate overflow-hidden rounded-[28px] p-5 sm:p-6 lg:p-7"
      >
        <motion.span aria-hidden="true" style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />
        <PawPrint aria-hidden="true" className="storybook-float pointer-events-none absolute -top-8 -right-8 h-36 w-36 text-primary/6" />

        <div className="relative flex flex-wrap items-center justify-between gap-3" style={{ transform: 'translateZ(24px)' }}>
          <span className="inline-flex items-center gap-2 rounded-full border bg-orange-50 px-4 py-2.5 text-xs font-extrabold tracking-wider text-primary uppercase sm:px-6 sm:py-3">
            <Sparkles className="storybook-spark h-3.5 w-3.5 shrink-0" />
            тут на тебе вже чекає друг
          </span>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary ring-1 ring-orange-100">
            <PawPrint className="h-5 w-5" />
          </span>
        </div>

        {/* Spotlight benefit */}
        <div className="relative mt-6 py-6 px-2 sm:mt-10 sm:py-10 sm:px-5" style={{ transform: 'translateZ(18px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-start gap-3 sm:gap-4"
            >
              <motion.span
                initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl ring-1 sm:h-16 sm:w-16 ${active.accent}`}
              >
                <ActiveIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </motion.span>
              <div className="min-w-0 pt-1">
                <h3 className="text-xl leading-tight font-black text-text-main sm:text-2xl lg:text-[27px]">{active.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 font-bold text-gray-600 sm:text-base">{active.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Benefit tabs */}
        <div
          className="relative grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 sm:flex sm:items-start sm:justify-between sm:gap-4"
          style={{ transform: 'translateZ(12px)' }}
        >
          {benefits.map((benefit, i) => {
            const isActive = i === index
            const BenefitIcon = benefit.icon

            return (
              <button
                key={benefit.id}
                type="button"
                onClick={() => setIndex(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-pressed={isActive}
                className="group flex flex-col items-center gap-2 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:flex-1"
              >
                <motion.span
                  whileHover={{ scale: 1.08, rotate: -6 }}
                  whileTap={{ scale: 0.92, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-colors duration-200 sm:h-14 sm:w-14 ${
                    isActive ? active.accent : 'bg-white text-gray-300 ring-gray-100 group-hover:text-gray-500'
                  }`}
                >
                  <BenefitIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.span>
                <span className={`text-center text-[16px] leading-tight font-extrabold transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  {benefit.short}
                </span>
                <span className={`text-center text-[14px] leading-tight font-semibold transition-colors ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                  {benefit.hint}
                </span>
              </button>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100" style={{ transform: 'translateZ(12px)' }}>
          <motion.span className="block h-full rounded-full bg-primary" style={{ width: barWidth }} />
        </div>

        <div className="relative mt-5" style={{ transform: 'translateZ(12px)' }}>
          <LinkButton href="#animals-catalog" variant="outline" size="md" className="w-full sm:w-auto">
            Познайомитися з ними нижче
            <ArrowDown className="h-4 w-4" />
          </LinkButton>
        </div>
      </motion.div>
    </div>
  )
}
