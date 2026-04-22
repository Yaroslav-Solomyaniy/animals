'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

const canUseDOM = typeof window !== 'undefined'

const useMedia = (
  queries: Array<string>,
  values: Array<number>,
  defaultValue: number,
): number => {
  const get = () => {
    if (!canUseDOM) return defaultValue

    const index = queries.findIndex((q) => window.matchMedia(q).matches)
    return values[index] ?? defaultValue
  }

  const [value, setValue] = useState<number>(get)

  useEffect(() => {
    if (!canUseDOM) return

    const handler = () => setValue(get)
    const mediaQueries = queries.map((q) => window.matchMedia(q))

    mediaQueries.forEach((mq) => mq.addEventListener('change', handler))
    handler()

    return () =>
      mediaQueries.forEach((mq) => mq.removeEventListener('change', handler))
  }, [queries])

  return value
}

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current || !canUseDOM) return

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}

const preloadImages = async (urls: Array<string>): Promise<void> => {
  if (!canUseDOM) return

  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        }),
    ),
  )
}

export interface MasonryItem {
  id: string
  img: string
  url: string
  height: number
}

interface GridItem extends MasonryItem {
  x: number
  y: number
  w: number
  h: number
}

interface RenderGridItem extends GridItem {
  renderKey: string
}

interface MasonryProps {
  items: Array<MasonryItem>
  columns?: number
  autoScroll?: boolean
  scrollSpeed?: number
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random'
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
}

export default function Masonry({
  items,
  columns: fixedColumns,
  autoScroll = false,
  scrollSpeed = 40,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) {
  const queries = useMemo(
    () => [
      '(min-width:1500px)',
      '(min-width:1000px)',
      '(min-width:600px)',
      '(min-width:400px)',
    ],
    [],
  )
  const values = useMemo(() => [5, 4, 3, 2], [])
  const responsiveColumns = useMedia(queries, values, 1)
  const columns = fixedColumns ?? responsiveColumns

  const [containerRef, { width }] = useMeasure<HTMLDivElement>()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [imagesReady, setImagesReady] = useState(false)

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect || !canUseDOM) return { x: item.x, y: item.y }

    let direction = animateFrom
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'] as const
      direction = dirs[Math.floor(Math.random() * dirs.length)]
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 }
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 }
      case 'left':
        return { x: -200, y: item.y }
      case 'right':
        return { x: window.innerWidth + 200, y: item.y }
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    const reset = window.setTimeout(() => setImagesReady(false), 0)
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true))
    return () => window.clearTimeout(reset)
  }, [items])

  const grid = useMemo<Array<GridItem>>(() => {
    if (!width) return []

    const colHeights = new Array(columns).fill(0)
    const gap = 16
    const totalGaps = (columns - 1) * gap
    const columnWidth = (width - totalGaps) / columns

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = col * (columnWidth + gap)
      const height = child.height / 2
      const y = colHeights[col]

      colHeights[col] += height + gap
      return { ...child, x, y, w: columnWidth, h: height }
    })
  }, [columns, items, width])

  const contentHeight = useMemo(() => {
    if (!grid.length) return 0

    return Math.max(...grid.map((item) => item.y + item.h)) + 16
  }, [grid])

  const renderGrid = useMemo<Array<RenderGridItem>>(() => {
    const primary = grid.map((item) => ({ ...item, renderKey: item.id }))

    if (!autoScroll || !contentHeight) return primary

    return [
      ...primary,
      ...grid.map((item) => ({
        ...item,
        y: item.y + contentHeight,
        renderKey: `${item.id}-copy`,
      })),
    ]
  }, [autoScroll, contentHeight, grid])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    renderGrid.forEach((item, index) => {
      const selector = `[data-key="${item.renderKey}"]`
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        const start = getInitialPosition(item)
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        )
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto',
        })
      }
    })

    hasMounted.current = true
  }, [
    renderGrid,
    imagesReady,
    stagger,
    animateFrom,
    blurToFocus,
    duration,
    ease,
  ])

  useLayoutEffect(() => {
    if (!autoScroll || !imagesReady || !contentRef.current || !contentHeight) {
      return
    }

    gsap.set(contentRef.current, { y: 0 })
    const tween = gsap.to(contentRef.current, {
      y: -contentHeight,
      duration: contentHeight / scrollSpeed,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [autoScroll, contentHeight, imagesReady, scrollSpeed])

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 })
    }
  }

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 })
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div ref={contentRef} className="absolute inset-0">
        {renderGrid.map((item) => (
          <button
            key={item.renderKey}
            type="button"
            data-key={item.renderKey}
            className="absolute box-content cursor-pointer border-0 bg-transparent p-0"
            style={{ willChange: 'transform, width, height, opacity' }}
            onClick={() => window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={(e) =>
              handleMouseEnter(item.renderKey, e.currentTarget)
            }
            onMouseLeave={(e) =>
              handleMouseLeave(item.renderKey, e.currentTarget)
            }
            aria-label="Відкрити фото собаки"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-neutral-base text-[10px] leading-[10px] uppercase shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]">
              <img
                src={item.img}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {colorShiftOnHover && (
                <div className="color-overlay pointer-events-none absolute inset-0 rounded-[14px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
