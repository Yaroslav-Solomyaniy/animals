'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

type StackItem = {
  id: string
  content: ReactNode
}

type StackProps = {
  items: StackItem[]
  className?: string
  cardClassName?: string
}

export default function Stack({ items, className, cardClassName }: StackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [attentionIndex, setAttentionIndex] = useState(0)
  const [canShowAttention, setCanShowAttention] = useState(false)

  const orderedItems = useMemo(() => {
    if (items.length === 0) {
      return []
    }

    return items.map((_, index) => items[(activeIndex + index) % items.length])
  }, [activeIndex, items])

  function pauseAttention() {
    setCanShowAttention(false)
    setAttentionIndex(0)
  }

  function showNext() {
    if (items.length === 0) {
      return
    }

    pauseAttention()
    setActiveIndex((current) => (current + 1) % items.length)
  }

  function showPrevious() {
    if (items.length === 0) {
      return
    }

    pauseAttention()
    setActiveIndex((current) => (current - 1 + items.length) % items.length)
  }

  function bringToFront(id: string) {
    const nextIndex = items.findIndex((item) => item.id === id)

    if (nextIndex >= 0) {
      pauseAttention()
      setActiveIndex(nextIndex)
    }
  }

  useEffect(() => {
    if (items.length <= 1) {
      return
    }

    if (!canShowAttention) {
      return
    }

    const interval = window.setInterval(() => {
      setAttentionIndex((current) => {
        const next = current + 1
        return next >= items.length ? 1 : next
      })
    }, 900)

    return () => window.clearInterval(interval)
  }, [canShowAttention, items.length])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAttentionIndex(1)
      setCanShowAttention(true)
    }, 5000)

    return () => window.clearTimeout(timeout)
  }, [activeIndex])

  return (
    <div
      className={cn(
        'relative mx-auto h-[370px] w-full max-w-[430px] overflow-visible sm:h-[360px] lg:h-[390px]',
        className,
      )}
      aria-label="Service steps stack"
    >
      {orderedItems.map((item, index) => {
        const isTop = index === 0
        const rotations = [-20, 0, 20, 40]
        const xOffsets = [0, 50, 100, 150]
        const yOffsets = [50, 0, -50, -70]
        const rotate = rotations[index] ?? 65
        const x = xOffsets[index] ?? 54
        const y = yOffsets[index] ?? 24
        const shouldBounce = index !== 0 && attentionIndex === index
        const scale = 1

        return (
          <motion.button
            key={item.id}
            type="button"
            aria-label={
              isTop ? 'Show next service card' : 'Bring service card to front'
            }
            onClick={() => {
              if (isTop) {
                showNext()
              } else {
                bringToFront(item.id)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') showNext()
              if (event.key === 'ArrowLeft') showPrevious()
            }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.28}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 80) {
                if (info.offset.x > 0) showNext()
                else showPrevious()
              }
            }}
            initial={false}
            animate={{
              x,
              y: shouldBounce ? [y, y - 24, y] : y,
              rotate,
              scale,
              // opacity: 1 - index * 0.04,
            }}
            transition={{
              y:
                shouldBounce
                  ? {
                      duration: 0.42,
                      ease: 'easeOut',
                    }
                  : {
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                    },
              x: {
                type: 'spring',
                stiffness: 260,
                damping: 24,
              },
              rotate: {
                type: 'spring',
                stiffness: 260,
                damping: 24,
              },
              scale: {
                type: 'spring',
                stiffness: 260,
                damping: 24,
              },
            }}
            whileHover={isTop ? { y: -6, rotate: 0 } : undefined}
            whileTap={isTop ? { scale: 0.98 } : undefined}
            className={cn(
              'absolute bottom-8 left-[calc(50%-105px)] flex h-[255px] w-[210px] cursor-pointer flex-col overflow-hidden rounded-[22px] border border-gray-100 bg-white opacity-100 p-5 text-left shadow-[0_22px_60px_-34px_rgba(15,23,42,0.55)] outline-none transition-colors focus-visible:ring-4 focus-visible:ring-orange-300/35 sm:h-[285px] sm:w-[230px] sm:left-[calc(50%-115px)] lg:h-[400px] lg:w-[330px] lg:left-[calc(50%-122.5px)]',
              cardClassName,
            )}
            style={{
              zIndex: index === 0 ? 30 : 20 - index,
              transformOrigin: '0% 100%',
            }}
          >
            {item.content}
          </motion.button>
        )
      })}
    </div>
  )
}
