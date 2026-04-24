'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Facebook, Link2, Send, Share2, X } from 'lucide-react'
import { Button, IconButton } from '@/components/ui/Button'

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
  label = 'Поділитися',
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
      <Button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        variant="outline"
        size={variant === 'icon' ? 'icon' : 'md'}
        className={variant === 'icon' ? 'h-full min-h-12 w-full min-w-12 rounded-xl sm:w-14' : 'h-full w-full'}
        aria-expanded={isOpen}
        aria-label={label}
      >
        <Share2 className="h-4 w-4" />
        {variant === 'button' && <span>{label}</span>}
      </Button>

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
                <IconButton
                  key={target.id}
                  type="button"
                  variant="outline"
                  className="aspect-square rounded-2xl"
                  onClick={() => openShareTarget(target.buildUrl)}
                  label={target.label}
                >
                  <Icon className="h-5 w-5" />
                </IconButton>
              )
            })}

            <IconButton
              type="button"
              onClick={copyUrl}
              variant="outline"
              className="aspect-square rounded-2xl"
              label={copied ? 'Посилання скопійовано' : 'Скопіювати посилання'}
              title={copied ? 'Скопійовано' : 'Скопіювати'}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </IconButton>

            {canNativeShare && (
              <IconButton
                type="button"
                onClick={nativeShare}
                variant="primary"
                className="aspect-square rounded-2xl"
                label="Системне меню"
              >
                <Share2 className="h-5 w-5" />
              </IconButton>
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
