'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button, LinkButton } from '@/components/ui/Button'
import { SITE_NAV_LINKS, SITE_ROUTES, SITE_SOCIAL_LINKS } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [isLgUp, setIsLgUp] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const updateHeader = () => {
      const nextIsCompact = window.scrollY > 48

      setIsCompact((current) => (current === nextIsCompact ? current : nextIsCompact))
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })

    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const updateIsLgUp = () => setIsLgUp(mql.matches)

    updateIsLgUp()
    mql.addEventListener('change', updateIsLgUp)

    return () => mql.removeEventListener('change', updateIsLgUp)
  }, [])

  // The floating/shrinking "pill" treatment is a desktop-only affordance.
  // On tablet and mobile the header always stays flush at the very top of the page.
  const isFloating = isCompact && isLgUp

  // Lightbox-style mobile/tablet menu: lock page scroll completely while it's open.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 px-0 py-0">
      <motion.nav
        initial={false}
        animate={{
          width: isFloating ? 'min(92vw, 84rem)' : '100%',
          marginTop: isFloating ? 12 : 0,
          borderTopLeftRadius: isFloating ? 999 : 0,
          borderTopRightRadius: isFloating ? 999 : 0,
          borderBottomLeftRadius: isFloating ? 999 : 0,
          borderBottomRightRadius: isFloating ? 999 : 0,
          boxShadow: isFloating ? '0 18px 60px rgba(15,23,42,0.12)' : '0 0 0 rgba(15,23,42,0)',
        }}
        transition={{
          duration: 0.26,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          'relative z-10 mx-auto overflow-hidden border bg-white/68 backdrop-blur-2xl will-change-[width,border-radius,box-shadow,margin-top] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.75)]',
          isFloating ? 'border-orange-100' : 'border-x-0 border-t-0 border-gray-100'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center gap-4 px-5 transition-[height,max-width] duration-700 ease-out sm:px-6 lg:px-8',
            isFloating ? 'h-16 max-w-336' : 'h-16 max-w-336 lg:h-20'
          )}
        >
          <div className="hidden items-center gap-1 lg:flex">
            {SITE_NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all xl:px-4',
                    isActive ? 'bg-orange-50 text-primary' : 'text-gray-600 hover:bg-orange-50 hover:text-primary'
                  )}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center lg:flex">
              <LinkButton href={SITE_ROUTES.help} size={isFloating ? 'sm' : 'md'}>
                Підтримати
              </LinkButton>
            </div>

            <LinkButton
              href={SITE_SOCIAL_LINKS.chystota.href}
              target="_blank"
              variant="ghost"
              size="icon"
              showIcon={false}
              aria-label={SITE_SOCIAL_LINKS.chystota.label}
              title={SITE_SOCIAL_LINKS.chystota.label}
              className="shrink-0 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-primary"
            >
              <Globe className="h-5 w-5" />
            </LinkButton>

            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-xl text-gray-700 hover:bg-orange-50 hover:text-primary"
                aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Lightbox-style backdrop: dims everything below the header so only the menu stands out. */}
            <motion.div
              key="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              className="fixed inset-x-0 top-16 bottom-0 z-40 bg-gray-950/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.2)] ring-1 ring-white/70 sm:inset-x-auto sm:left-auto sm:right-4 sm:w-[min(70vw,22rem)] lg:hidden"
            >
              <div className="max-h-[calc(100dvh-6rem)] space-y-1.5 overflow-y-auto px-3 py-3">
                {SITE_NAV_LINKS.map((link) => {
                  const isActive = link.href === '/' ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-base font-semibold transition-all',
                        isActive
                          ? 'border border-orange-200 bg-orange-50 text-primary'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-primary'
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                })}
                <div className="pt-2">
                  <LinkButton href={SITE_ROUTES.help} onClick={() => setIsOpen(false)} size="lg" className="w-full text-sm">
                    Підтримати
                  </LinkButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
