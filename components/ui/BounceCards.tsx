'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BounceCardsProps {
  className?: string
  images?: string[]
  selectedIndex?: number
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  enableHover?: boolean
  onSelect?: (index: number) => void
}

export default function BounceCards({
  className = '',
  images = [],
  selectedIndex = 0,
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-100px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(100px)',
  ],
  enableHover = false,
  onSelect,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [animationDelay, animationStagger, easeType])

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr)

    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
    }

    if (transformStr === 'none') {
      return 'rotate(0deg)'
    }

    return `${transformStr} rotate(0deg)`
  }

  const getPushedTransform = (baseTransform: string, offsetX: number): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/
    const match = baseTransform.match(translateRegex)

    if (match) {
      const currentX = Number.parseFloat(match[1])
      const newX = currentX + offsetX
      return baseTransform.replace(translateRegex, `translate(${newX}px)`)
    }

    return baseTransform === 'none'
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`
  }

  const pushSiblings = (hoveredIdx: number) => {
    const q = gsap.utils.selector(containerRef)

    if (!enableHover || !containerRef.current) {
      return
    }

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`)
      gsap.killTweensOf(selector)

      const baseTransform = transformStyles[i] || 'none'

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform)
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
        })
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160
        const pushedTransform = getPushedTransform(baseTransform, offsetX)
        const distance = Math.abs(hoveredIdx - i)
        const delay = distance * 0.05

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto',
        })
      }
    })
  }

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) {
      return
    }

    const q = gsap.utils.selector(containerRef)

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`)
      gsap.killTweensOf(selector)

      const baseTransform = transformStyles[i] || 'none'
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      })
    })
  }

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      ref={containerRef}
      style={{
        width: `min(100%, ${containerWidth}px)`,
        height: containerHeight,
      }}
    >
      {images.map((src, idx) => (
        <button
          key={`${src}-${idx}`}
          type="button"
          className={[
            `card card-${idx} absolute h-[108px] w-[148px] overflow-hidden rounded-[22px] border-[6px] bg-[#f4f1ea] shadow-[0_10px_28px_-18px_rgba(15,23,42,0.65)] ring-4 transition-shadow sm:h-[170px] sm:w-[200px]`,
            selectedIndex === idx
              ? 'border-white ring-orange-300/60'
              : 'border-white ring-transparent',
          ].join(' ')}
          style={{
            transform: transformStyles[idx] || 'none',
          }}
          onClick={() => onSelect?.(idx)}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          aria-label={`Показати фото ${idx + 1}`}
        >
          <img
            className="h-full w-full object-cover"
            src={src}
            alt={`Фото ${idx + 1}`}
            referrerPolicy="no-referrer"
          />
        </button>
      ))}
    </div>
  )
}
