'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, Facebook, Globe, Send, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function ViberIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.998 2C6.48 2 2 6.282 2 11.556c0 2.9 1.388 5.508 3.556 7.22V22l3.13-1.656c.74.194 1.524.3 2.333.3h.01c5.51 0 9.97-4.282 9.97-9.556S17.51 2 12 2h-.002zm.97 12.86l-2.48-2.627-4.846 2.627 5.327-5.638 2.54 2.627 4.787-2.627-5.328 5.638z" />
    </svg>
  )
}

type ShareMenuProps = {
  path: string
  title: string
  text?: string
  image?: string | null
  label?: string
  variant?: 'button' | 'icon'
  className?: string
}

const shareTargets = [
  {
    id: 'telegram',
    label: 'Telegram',
    bg: 'linear-gradient(135deg,#2AABEE,#229ED9)',
    Icon: Send,
    buildUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'viber',
    label: 'Viber',
    bg: 'linear-gradient(135deg,#7360F2,#5A4BCC)',
    Icon: ViberIcon,
    buildUrl: (url: string, title: string) =>
      `viber://forward?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    bg: 'linear-gradient(135deg,#1877F2,#0C5DC7)',
    Icon: Facebook,
    buildUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    bg: 'linear-gradient(135deg,#14171A,#000000)',
    Icon: X,
    buildUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
]

export default function ShareMenu({
  path,
  title,
  text,
  image,
  label = 'Поділитися',
  variant = 'button',
  className = '',
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const shareText = text ?? title

  const getShareUrl = () =>
    path.startsWith('http') ? path : `${window.location.origin}${path}`

  const getHostname = () => {
    try {
      return new URL(getShareUrl()).hostname.replace('www.', '')
    } catch {
      return window.location.hostname.replace('www.', '')
    }
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const openShareTarget = (buildUrl: (url: string, title: string) => string) => {
    window.open(buildUrl(getShareUrl(), shareText), '_blank', 'noopener,noreferrer,width=720,height=640')
    setIsOpen(false)
  }

  return (
    <>
      <div className={cn('flex', className)}>
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="md"
          className={variant === 'icon' ? 'min-h-12 w-full min-w-12 rounded-xl sm:w-14' : 'min-h-11 w-full'}
          aria-label={label}
        >
          <Share2 className="h-4 w-4" />
          {variant === 'button' && <span>{label}</span>}
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[32px] bg-white shadow-[0_32px_100px_rgba(15,23,42,0.28)] sm:rounded-[32px]">

            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            <div className="px-5 pb-6 pt-3 sm:px-6 sm:pt-5">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-base font-black text-gray-950">{label}</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* OG Preview card */}
              <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                {image ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={image} alt={title} className="h-full w-full object-cover object-top" />
                  </div>
                ) : (
                  <div className="flex aspect-[1200/630] items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#1e3a5f_25%,#155e75_45%,#4c1d95_65%,#be185d_85%,#f27438_100%)]">
                    <span className="px-6 text-center text-lg font-black leading-snug text-white/90 drop-shadow">
                      {title}
                    </span>
                  </div>
                )}
                <div className="px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <Globe className="h-3 w-3" />
                    {getHostname()}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm font-bold text-slate-800">{title}</p>
                  {text && <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{text}</p>}
                </div>
              </div>

              {/* Share buttons — 2×2 grid */}
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {shareTargets.map(({ id, label: targetLabel, Icon, bg, buildUrl }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openShareTarget(buildUrl)}
                    className="group flex flex-col items-center gap-2 rounded-2xl px-2 py-3 transition hover:bg-slate-50"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow transition group-hover:scale-105 group-hover:shadow-md"
                      style={{ background: bg }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-slate-600">{targetLabel}</span>
                  </button>
                ))}
              </div>

              {/* Copy link */}
              <button
                type="button"
                onClick={copyUrl}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
                  copied
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50 hover:border-orange-200 hover:bg-orange-50'
                )}
              >
                <span className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition',
                  copied ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-500 shadow-sm'
                )}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-bold', copied ? 'text-emerald-700' : 'text-slate-700')}>
                    {copied ? 'Скопійовано!' : 'Скопіювати посилання'}
                  </p>
                  <p className="truncate text-xs text-slate-400">{getHostname()}{path}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
