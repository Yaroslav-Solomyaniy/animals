'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { Dialog, DialogRawContent } from '@/components/ui/Dialog'

export type LightboxImageItem = {
  src: string
  alt: string
}

type ImageLightboxProps = {
  images: LightboxImageItem[]
  initialIndex?: number
  children: (open: () => void) => ReactNode
}

export default function ImageLightbox({images,
  initialIndex = 0,
  children,}: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex === null ? null : images[activeIndex]
  const hasManyImages = images.length > 1

  // Arrow keys handled via onKeyDown on Dialog content
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') goPrev()
    if (event.key === 'ArrowRight') goNext()
  }

  const open = () => setActiveIndex(initialIndex)
  const close = () => setActiveIndex(null)

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

  return (
    <>
      {children(open)}
      <Dialog open={activeIndex !== null} onOpenChange={(o) => { if (!o) close() }}>
        <DialogRawContent
          className="inset-0 flex items-center justify-center bg-gray-950/92 p-4 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
        >
          <IconButton
            type="button"
            label="Закрити перегляд фото"
            variant="ghost"
            onClick={close}
            className="absolute right-4 top-4 border-white/30 bg-white/12 text-white backdrop-blur hover:bg-white hover:text-gray-950"
          >
            <X className="h-5 w-5" />
          </IconButton>

          {hasManyImages && (
            <>
              <IconButton
                type="button"
                label="Попереднє фото"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 border-white/30 bg-white/12 text-white backdrop-blur hover:bg-white hover:text-gray-950"
              >
                <ArrowLeft className="h-5 w-5" />
              </IconButton>
              <IconButton
                type="button"
                label="Наступне фото"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 border-white/30 bg-white/12 text-white backdrop-blur hover:bg-white hover:text-gray-950"
              >
                <ArrowRight className="h-5 w-5" />
              </IconButton>
            </>
          )}

          {activeImage && (
            <div className="relative max-h-[92vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
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
          )}
        </DialogRawContent>
      </Dialog>
    </>
  )
}

export function LightboxImage({image,
  images,
  index = 0,
  buttonClassName = '',
  imageClassName = '',}: {
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
