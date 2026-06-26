'use client'

import { useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'

type TreatAnimal = {
  id: string
  name: string
  imageUrl: string
  donateHref: string
}

export default function AnimalTreatCarousel({ animals }: { animals: TreatAnimal[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return
    setIsDragging(false)
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
    trackRef.current.style.cursor = 'grabbing'
    trackRef.current.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current || e.buttons !== 1) return
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    if (Math.abs(walk) > 4) setIsDragging(true)
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUp = useCallback(() => {
    if (!trackRef.current) return
    trackRef.current.style.cursor = 'grab'
    trackRef.current.style.userSelect = ''
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 680 : -680, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-6">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-orange-200 hover:text-primary"
        aria-label="Попередні"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-orange-200 hover:text-primary"
        aria-label="Наступні"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: 'grab' }}
      >
        {animals.map((animal) => (
          <a
            key={animal.id}
            href={isDragging ? undefined : animal.donateHref}
            onClick={(e) => { if (isDragging) e.preventDefault() }}
            draggable={false}
            className="group w-40 shrink-0 overflow-hidden rounded-2xl border-2 border-transparent bg-white transition-all duration-200 hover:border-primary"
          >
            {/* Photo */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src={animal.imageUrl}
                alt={animal.name}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
              />
              {/* Hover CTA */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-extrabold text-white shadow-lg">
                  <PawPrint className="h-3 w-3" />
                  Дати смаколик
                </span>
              </div>
            </div>

            {/* Name strip */}
            <div className="border-t border-orange-100 bg-white px-3 py-2">
              <p className="truncate text-sm font-extrabold text-gray-900">{animal.name || 'Без імені'}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
