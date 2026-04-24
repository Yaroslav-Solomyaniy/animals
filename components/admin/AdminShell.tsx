'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  FilePlus2,
  LayoutDashboard,
  Newspaper,
  PanelLeft,
  PawPrint,
  Rocket,
  ScrollText,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cn } from '@/lib/utils'

const adminNavigation = [
  { href: '/admin', label: 'Огляд', icon: LayoutDashboard },
  { href: '/admin/animals', label: 'Тварини', icon: PawPrint },
  { href: '/admin/news', label: 'Новини', icon: Newspaper },
  { href: '/admin/reports', label: 'Звіти', icon: ScrollText },
]

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (!isAdminRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="storybook-bg flex flex-1 flex-col">{children}</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fb] text-slate-950">
      <aside className="sticky top-0 hidden h-screen w-[292px] shrink-0 border-r border-slate-200 bg-white/92 xl:block">
        <div className="flex h-full flex-col p-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <PanelLeft className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase text-primary">
                  Admin
                </p>
                <h1 className="text-xl font-extrabold text-slate-950">
                  Shelter CMS
                </h1>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {adminNavigation.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin'
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition-all',
                    isActive
                      ? 'border-orange-200 bg-orange-50 text-primary shadow-[0_16px_40px_rgba(242,116,56,0.12)]'
                      : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-extrabold text-slate-950">Швидкі дії</p>
            <div className="mt-3 space-y-2">
              <QuickLink href="/admin/animals/new" label="Додати тварину" />
              <QuickLink href="/admin/news/new" label="Додати новину" />
              <QuickLink href="/admin/reports/new" label="Додати звіт" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/88 text-slate-950 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[calc(100rem+4rem)] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-extrabold uppercase text-primary">
                  <Rocket className="h-3.5 w-3.5" />
                  Адмін панель сайту
                </p>
                <h1 className="mt-3 text-2xl font-extrabold text-slate-950 md:text-3xl">
                  Керування контентом і каталогом
                </h1>
              </div>

              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
              >
                На сайт
              </Link>
            </div>

            <nav className="flex flex-wrap gap-2 xl:hidden">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/admin'
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all',
                      isActive
                        ? 'border-orange-200 bg-orange-50 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-primary'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>

        <main className="flex-1 bg-[#f6f8fb] text-slate-950">
          <div className="mx-auto max-w-[calc(100rem+4rem)] px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-primary"
    >
      <FilePlus2 className="h-4 w-4" />
      {label}
    </Link>
  )
}
