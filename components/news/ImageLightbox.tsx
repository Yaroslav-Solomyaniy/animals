'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export type LightboxImageItem = {
  src: string
  alt: string
}

type ImageLightboxProps = {
  images: LightboxImageItem[]
  initialIndex?: number
  children: (open: () => void) => ReactNode
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  children,
}: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex === null ? null : images[activeIndex]
  const hasManyImages = images.length > 1

  useEffect(() => {
    if (activeIndex === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + images.length) % images.length,
        )
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % images.length,
        )
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, images.length])

  const open = () => setActiveIndex(initialIndex)
  const close = () => setActiveIndex(null)
  const portalTarget =
    typeof document === 'undefined' ? null : document.body

  const goPrev = () => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length,
    )
  }

  const goNext = () => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length,
    )
  }

  const overlay =
    activeImage && portalTarget
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/92 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-[10001] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur transition hover:bg-white hover:text-gray-950"
              aria-label="Закрити перегляд фото"
            >
              <X className="h-5 w-5" />
            </button>

            {hasManyImages && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goPrev()
                  }}
                  className="absolute left-4 top-1/2 z-[10001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur transition hover:bg-white hover:text-gray-950"
                  aria-label="Попереднє фото"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goNext()
                  }}
                  className="absolute right-4 top-1/2 z-[10001] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur transition hover:bg-white hover:text-gray-950"
                  aria-label="Наступне фото"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              className="relative z-[10000] max-h-[92vh] max-w-[92vw]"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[92vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_30px_120px_rgba(0,0,0,0.48)]"
              />
              {hasManyImages && activeIndex !== null && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-gray-950/70 px-4 py-2 text-sm font-black text-white backdrop-blur">
                  {activeIndex + 1} / {images.length}
                </span>
              )}
            </div>
          </div>,
          portalTarget,
        )
      : null

  return (
    <>
      {children(open)}
      {overlay}
    </>
  )
}

export function LightboxImage({
  image,
  images,
  index = 0,
  buttonClassName = '',
  imageClassName = '',
}: {
  image: LightboxImageItem
  images?: LightboxImageItem[]
  index?: number
  buttonClassName?: string
  imageClassName?: string
}) {
  const lightboxImages = images ?? [image]

  return (
    <ImageLightbox images={lightboxImages} initialIndex={index}>
      {(open) => (
        <button
          type="button"
          onClick={open}
          className={`group block overflow-hidden text-left ${buttonClassName}`}
          aria-label="Відкрити фото на весь екран"
        >
          <img
            src={image.src}
            alt={image.alt}
            className={imageClassName}
          />
        </button>
      )}
    </ImageLightbox>
  )
}
