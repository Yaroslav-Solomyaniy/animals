'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button, LinkButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Головна', href: '/' },
  { name: 'Книга хвостиків', href: '/animals' },
  { name: 'Послуги', href: '/services' },
  { name: 'Як можна допомогти', href: '/help-for-us' },
  { name: 'Звіти та новини', href: '/report-and-news' },
  { name: 'Контакти', href: '/contacts' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const updateHeader = () => setIsCompact(window.scrollY > 48)

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })

    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  return (
    <header className="sticky top-0 z-50 px-0 py-0">
      <motion.nav
        initial={false}
        animate={{
          width: isCompact ? 'min(92vw, 1248px)' : '100%',
          marginTop: isCompact ? 12 : 0,
          borderTopLeftRadius: isCompact ? 999 : 0,
          borderTopRightRadius: isCompact ? 999 : 0,
          borderBottomLeftRadius: isCompact ? 999 : 0,
          borderBottomRightRadius: isCompact ? 999 : 0,
          boxShadow: isCompact
            ? '0 18px 60px rgba(15,23,42,0.12)'
            : '0 0 0 rgba(15,23,42,0)',
        }}
        transition={{
          duration: 0.26,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          'mx-auto overflow-hidden border bg-white/68 backdrop-blur-2xl will-change-[width,border-radius,box-shadow,margin-top] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.75)]',
          isCompact
            ? 'border-orange-100'
            : 'border-x-0 border-t-0 border-gray-100'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between gap-4 px-4 transition-[height,max-width] duration-700 ease-out sm:px-6 lg:px-8',
            isCompact
              ? 'h-16 max-w-[calc(76rem+2rem)]'
              : 'h-20 max-w-[calc(80rem+4rem)]'
          )}
        >

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all xl:px-4',
                    isActive
                      ? 'bg-orange-50 text-primary'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-primary'
                  )}
                >
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LinkButton
              href="/help-for-us"
              size={isCompact ? 'sm' : 'md'}
            >
              Підтримати
            </LinkButton>
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl text-gray-700 hover:bg-orange-50 hover:text-primary"
              aria-label={isOpen ? 'Закрити меню' : 'Відкрити меню'}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-orange-100 bg-white lg:hidden"
            >
              <div className="space-y-2 px-4 pb-6 pt-3">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === link.href
                      : pathname === link.href || pathname.startsWith(`${link.href}/`)

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
                <div className="pt-4">
                  <LinkButton
                    href="/help-for-us"
                    onClick={() => setIsOpen(false)}
                    size="lg"
                    className="w-full"
                  >
                    Підтримати
                  </LinkButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
