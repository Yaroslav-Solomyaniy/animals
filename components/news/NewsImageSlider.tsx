'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ImageLightbox from './ImageLightbox'

type NewsImageSliderProps = {
  images: Array<{
    src: string
    alt: string
  }>
  className?: string
  imageClassName?: string
  controlsClassName?: string
  showCounter?: boolean
}

export default function NewsImageSlider({
  images,
  className = '',
  imageClassName = '',
  controlsClassName = '',
  showCounter = true,
}: NewsImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  if (!activeImage) {
    return null
  }

  const hasManyImages = images.length > 1

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length)
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % images.length)
  }

  return (
    <ImageLightbox images={images} initialIndex={activeIndex}>
      {(openLightbox) => (
        <div className={`relative overflow-hidden ${className}`}>
          <button
            type="button"
            onClick={openLightbox}
            className="block h-full w-full cursor-zoom-in overflow-hidden"
            aria-label="Відкрити фото на весь екран"
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className={`h-full w-full object-cover transition duration-500 ${imageClassName}`}
            />
          </button>

          {hasManyImages && (
            <>
              <div
                className={`absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3 ${controlsClassName}`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      goPrev()
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/88 text-gray-950 shadow-soft backdrop-blur transition hover:bg-primary hover:text-white"
                    aria-label="Попереднє фото"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      goNext()
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/88 text-gray-950 shadow-soft backdrop-blur transition hover:bg-primary hover:text-white"
                    aria-label="Наступне фото"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {showCounter && (
                  <span className="rounded-full border border-white/40 bg-white/88 px-4 py-2 text-sm font-black text-gray-950 shadow-soft backdrop-blur">
                    {activeIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/38 to-transparent" />
            </>
          )}
        </div>
      )}
    </ImageLightbox>
  )
}
