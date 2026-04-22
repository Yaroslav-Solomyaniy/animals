'use client'

import {
  Award,
  CalendarDays,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { gsap } from 'gsap'

type MagicBentoProps = {
  disableAnimations?: boolean
  enableSpotlight?: boolean
  enableStars?: boolean
  enableTilt?: boolean
  enableMagnetism?: boolean
  clickEffect?: boolean
  particleCount?: number
  spotlightRadius?: number
  glowColor?: string
}

type BentoCard = {
  icon: LucideIcon
  label: string
  title: string
  description: string
  className: string
  accentClassName: string
  surfaceClassName: string
}

const DEFAULT_PARTICLE_COUNT = 10
const DEFAULT_SPOTLIGHT_RADIUS = 280
const DEFAULT_GLOW_COLOR = '249, 115, 22'
const MOBILE_BREAKPOINT = 768

const cards: Array<BentoCard> = [
  {
    icon: Heart,
    label: 'Адопція',
    title: 'Знайомство без поспіху',
    description:
      'Можна приїхати, поспілкуватися з собакою, поставити питання команді й обрати друга серцем.',
    className: 'lg:col-span-3 lg:row-span-2',
    accentClassName: 'bg-orange-50 text-primary',
    surfaceClassName: 'bg-[#FFF8F2]',
  },
  {
    icon: CalendarDays,
    label: 'Візит',
    title: 'Попередній запис',
    description:
      'Так команда може підготуватися до зустрічі й приділити вам достатньо уваги.',
    className: 'lg:col-span-3',
    accentClassName: 'bg-sky-50 text-sky-600',
    surfaceClassName: 'bg-white',
  },
  {
    icon: Users,
    label: 'Вихідні',
    title: 'Волонтерські прогулянки',
    description:
      'Прогулянки допомагають тваринам залишатися активними, соціальними і спокійнішими.',
    className: 'lg:col-span-3',
    accentClassName: 'bg-emerald-50 text-secondary',
    surfaceClassName: 'bg-[#F1FFF8]',
  },
  {
    icon: MessageCircle,
    label: 'Поруч',
    title: 'Поради після знайомства',
    description:
      'Підкажемо, як адаптувати тварину вдома та з чого почати перші дні разом.',
    className: 'lg:col-span-2',
    accentClassName: 'bg-orange-50 text-primary',
    surfaceClassName: 'bg-white',
  },
  {
    icon: Award,
    label: 'Потреби',
    title: 'Допомога без зайвого шуму',
    description:
      'Підтримка йде на конкретні речі: корм, лікування, догляд і комфорт тварин.',
    className: 'lg:col-span-2',
    accentClassName: 'bg-sky-50 text-sky-600',
    surfaceClassName: 'bg-white',
  },
  {
    icon: Sparkles,
    label: 'Дім',
    title: 'Маленький крок для людини',
    description:
      'Один візит, одна прогулянка або одна заявка можуть змінити чиєсь життя назавжди.',
    className: 'lg:col-span-2',
    accentClassName: 'bg-emerald-50 text-secondary',
    surfaceClassName: 'bg-white',
  },
]

function createParticleElement(
  x: number,
  y: number,
  color = DEFAULT_GLOW_COLOR,
): HTMLDivElement {
  const element = document.createElement('div')
  element.className = 'magic-bento-particle'
  element.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 0.9);
    box-shadow: 0 0 10px rgba(${color}, 0.35);
    pointer-events: none;
    z-index: 20;
    left: ${x}px;
    top: ${y}px;
  `

  return element
}

function updateCardGlowProperties(
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty('--glow-x', `${relativeX}%`)
  card.style.setProperty('--glow-y', `${relativeY}%`)
  card.style.setProperty('--glow-intensity', glow.toString())
  card.style.setProperty('--glow-radius', `${radius}px`)
}

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

function GlobalSpotlight({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>
  disableAnimations?: boolean
  enabled?: boolean
  spotlightRadius?: number
  glowColor?: string
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (disableAnimations || !gridRef.current || !enabled) return

    const spotlight = document.createElement('div')
    spotlight.style.cssText = `
      position: fixed;
      width: 640px;
      height: 640px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.07) 20%,
        rgba(${glowColor}, 0.025) 45%,
        transparent 70%
      );
      z-index: 20;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    `
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const handleMouseMove = (event: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return

      const section = gridRef.current.closest('.magic-bento-section')
      const rect = section?.getBoundingClientRect()
      const mouseInside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      const cardNodes = gridRef.current.querySelectorAll('.magic-bento-card')

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        })
        cardNodes.forEach((card) => {
          ;(card as HTMLElement).style.setProperty('--glow-intensity', '0')
        })
        return
      }

      let minDistance = Infinity
      const proximity = spotlightRadius * 0.5
      const fadeDistance = spotlightRadius * 0.85

      cardNodes.forEach((card) => {
        const cardElement = card as HTMLElement
        const cardRect = cardElement.getBoundingClientRect()
        const centerX = cardRect.left + cardRect.width / 2
        const centerY = cardRect.top + cardRect.height / 2
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2
        const effectiveDistance = Math.max(0, distance)

        minDistance = Math.min(minDistance, effectiveDistance)

        const glowIntensity =
          effectiveDistance <= proximity
            ? 1
            : effectiveDistance <= fadeDistance
              ? (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
              : 0

        updateCardGlowProperties(
          cardElement,
          event.clientX,
          event.clientY,
          glowIntensity,
          spotlightRadius,
        )
      })

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        opacity:
          minDistance <= proximity
            ? 0.7
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) *
                0.7
              : 0,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current)
    }
  }, [disableAnimations, enabled, glowColor, gridRef, spotlightRadius])

  return null
}

function ParticleCard({
  card,
  shouldDisableAnimations,
  particleCount,
  glowColor,
  enableStars,
  enableTilt,
  clickEffect,
  enableMagnetism,
}: {
  card: BentoCard
  shouldDisableAnimations: boolean
  particleCount: number
  glowColor: string
  enableStars: boolean
  enableTilt: boolean
  clickEffect: boolean
  enableMagnetism: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Array<HTMLDivElement>>([])
  const timeoutsRef = useRef<number[]>([])
  const isHoveredRef = useRef(false)
  const Icon = card.icon

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      })
    })
    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableStars) return

    const { width, height } = cardRef.current.getBoundingClientRect()

    Array.from({ length: particleCount }).forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return

        const particle = createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor,
        )
        cardRef.current.appendChild(particle)
        particlesRef.current.push(particle)

        gsap.fromTo(
          particle,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' },
        )
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 70,
          y: (Math.random() - 0.5) * 70,
          opacity: 0.2,
          duration: 1.6 + Math.random(),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }, index * 90)

      timeoutsRef.current.push(timeoutId)
    })
  }, [enableStars, glowColor, particleCount])

  useEffect(() => {
    const element = cardRef.current
    if (!element || shouldDisableAnimations) return

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      animateParticles()
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      clearAllParticles()
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        gsap.to(element, {
          rotateX: ((y - centerY) / centerY) * -4,
          rotateY: ((x - centerX) / centerX) * 4,
          duration: 0.15,
          ease: 'power2.out',
          transformPerspective: 1000,
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: (x - centerX) * 0.025,
          y: (y - centerY) * 0.025,
          duration: 0.2,
          ease: 'power2.out',
        })
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!clickEffect) return

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.18) 0%, rgba(${glowColor}, 0.08) 35%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 15;
      `

      element.appendChild(ripple)
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      )
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('click', handleClick)

    return () => {
      isHoveredRef.current = false
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('click', handleClick)
      clearAllParticles()
    }
  }, [
    animateParticles,
    clearAllParticles,
    clickEffect,
    enableMagnetism,
    enableTilt,
    glowColor,
    shouldDisableAnimations,
  ])

  const style = {
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '200px',
  } as CSSProperties

  return (
    <article
      ref={cardRef}
      style={style}
      className={`magic-bento-card group relative flex min-h-[176px] flex-col overflow-hidden rounded-3xl border border-gray-100 p-6 transition-transform duration-300 hover:-translate-y-1 ${card.surfaceClassName} ${card.className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(var(--magic-glow-color), calc(var(--glow-intensity) * 0.16)) 0%, transparent 60%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100">
        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background:
              'radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(var(--magic-glow-color), calc(var(--glow-intensity) * 0.5)) 0%, transparent 55%)',
            padding: 1,
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accentClassName}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-white/75 px-3 py-1 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase ring-1 ring-gray-100">
            {card.label}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="mb-3 text-xl leading-tight font-extrabold text-text-main">
            {card.title}
          </h3>
          <p className="leading-7 text-gray-500">{card.description}</p>
        </div>
      </div>
    </article>
  )
}

export default function MagicBento({
  disableAnimations = false,
  enableSpotlight = true,
  enableStars = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  particleCount = DEFAULT_PARTICLE_COUNT,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobileDetection()
  const shouldDisableAnimations = disableAnimations || isMobile

  return (
    <div
      className="magic-bento-section"
      style={{ '--magic-glow-color': glowColor } as CSSProperties}
    >
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div
        ref={gridRef}
        className="grid auto-rows-[176px] gap-4 lg:grid-cols-6"
      >
        {cards.map((card) => (
          <ParticleCard
            key={card.title}
            card={card}
            shouldDisableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableStars={enableStars}
            enableTilt={enableTilt}
            enableMagnetism={enableMagnetism}
            clickEffect={clickEffect}
          />
        ))}
      </div>
    </div>
  )
}
