'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Facebook, Link2, Send, Share2, X } from 'lucide-react'

type ShareMenuProps = {
  path: string
  title: string
  text?: string
  label?: string
  variant?: 'button' | 'icon'
  className?: string
}

const shareTargets = [
  {
    id: 'telegram',
    label: 'Telegram',
    icon: Send,
    buildUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    buildUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'x',
    label: 'X',
    icon: X,
    buildUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'viber',
    label: 'Viber',
    icon: Link2,
    buildUrl: (url: string, title: string) =>
      `viber://forward?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
]

export default function ShareMenu({
  path,
  title,
  text,
  label = 'Поділитись',
  variant = 'button',
  className = '',
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const shareText = text ?? title
  const canNativeShare =
    typeof navigator !== 'undefined' && 'share' in navigator

  const getShareUrl = () => {
    if (path.startsWith('http')) {
      return path
    }

    return `${window.location.origin}${path}`
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const nativeShare = async () => {
    if (!navigator.share) {
      setIsOpen(true)
      return
    }

    await navigator.share({
      title,
      text: shareText,
      url: getShareUrl(),
    })
  }

  const openShareTarget = (
    buildUrl: (url: string, title: string) => string,
  ) => {
    window.open(
      buildUrl(getShareUrl(), shareText),
      '_blank',
      'noopener,noreferrer,width=720,height=640',
    )
    setIsOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative z-[80] h-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          variant === 'icon'
            ? 'flex h-full min-h-12 w-full min-w-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-primary shadow-[0_16px_45px_rgba(242,116,56,0.14)] transition hover:bg-primary hover:text-white active:scale-[0.98] sm:w-14'
            : 'group relative inline-flex h-full min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-primary bg-white px-5 py-3 font-bold text-primary shadow-[0_16px_45px_rgba(242,116,56,0.14)] transition active:scale-[0.98]'
        }
        aria-expanded={isOpen}
        aria-label={label}
      >
        {variant === 'button' && (
          <span className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
        )}
        <Share2 className="relative z-10 h-4 w-4 transition group-hover:text-white" />
        {variant === 'button' && (
          <span className="relative z-10 transition group-hover:text-white">
            {label}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(260px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_26px_80px_rgba(15,23,42,0.18)]">
          <div className="pb-3">
            <p className="text-sm font-black text-gray-950">{label}</p>
            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-gray-500">
              {title}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {shareTargets.map((target) => {
              const Icon = target.icon

              return (
                <button
                  key={target.id}
                  type="button"
                  className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-primary transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:shadow-soft"
                  onClick={() => openShareTarget(target.buildUrl)}
                  aria-label={target.label}
                  title={target.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              )
            })}

            <button
              type="button"
              onClick={copyUrl}
              className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-primary transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:shadow-soft"
              aria-label={copied ? 'Посилання скопійовано' : 'Скопіювати посилання'}
              title={copied ? 'Скопійовано' : 'Скопіювати'}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>

            {canNativeShare && (
              <button
                type="button"
                onClick={nativeShare}
                className="flex aspect-square items-center justify-center rounded-2xl border border-primary bg-primary text-white transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-primary"
                aria-label="Системне меню"
                title="Системне меню"
              >
                <Share2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {copied && (
            <p className="mt-3 text-center text-xs font-bold text-emerald-600">
              Посилання скопійовано
            </p>
          )}
        </div>
      )}
    </div>
  )
}
