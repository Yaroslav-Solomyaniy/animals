'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ArrowUpLeft, HandCoins, HardDrive, Inbox, LayoutDashboard, LogOut, Newspaper, PawPrint, ScrollText, Settings, UserCircle, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useScrollToTopOnRouteChange } from '@/hooks/useScrollToTopOnRouteChange'
import { cn } from '@/lib/utils'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import AdminPreviewBar from '@/components/AdminPreviewBar'

const adminNavigation = [
  { href: '/admin', label: 'Огляд', icon: LayoutDashboard },
  { href: '/admin/animals', label: 'Тварини', icon: PawPrint },
  { href: '/admin/news', label: 'Новини', icon: Newspaper },
  { href: '/admin/reports', label: 'Звіти', icon: ScrollText },
  { href: '/admin/submissions', label: 'Звернення', icon: Inbox },
  { href: '/admin/donations', label: 'Донати', icon: HandCoins },
  { href: '/admin/settings', label: 'Налаштування', icon: Settings },
  { href: '/admin/files', label: 'Файли', icon: HardDrive },
  { href: '/admin/administrators', label: 'Адміністратори', icon: Users },
  { href: '/admin/profile', label: 'Профіль', icon: UserCircle },
]

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut()
    window.location.href = '/sign-in'
  }
  useScrollToTopOnRouteChange()
  const isAdminRoute = pathname.startsWith('/admin')
  const isAnimalEditorRoute = pathname.startsWith('/admin/animals/') && pathname !== '/admin/animals/'
  const isNewsEditorRoute = pathname.startsWith('/admin/news/')
  const isReportsEditorRoute = pathname.startsWith('/admin/reports/') && pathname !== '/admin/reports/'
  const isEditorRoute = isAnimalEditorRoute || isNewsEditorRoute || isReportsEditorRoute

  if (pathname === '/sign-in' || pathname === '/sign-in/forgot' || pathname === '/reset-password' || pathname === '/setup-profile') {
    return <>{children}</>
  }

  if (pathname === '/donate/success') {
    return (
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-50">
          <Header />
        </div>
        {children}
      </div>
    )
  }

  if (!isAdminRoute) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <AdminPreviewBar />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fb] text-slate-950">
      <aside className="sticky top-0 hidden h-screen w-73 shrink-0 border-r border-slate-200 bg-white/92 xl:block">
        <div className="flex h-full flex-col p-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <PawPrint className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Панель керування</p>
                <h1 className="text-sm font-black leading-snug text-slate-950">Черкаська служба чистоти</h1>
                <p className="mt-0.5 text-[11px] font-semibold leading-tight text-slate-400">Центр надання допомоги безпритульним тваринам</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {adminNavigation.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin' ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)

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

          <div className="mt-auto flex flex-col gap-2">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              <ArrowUpLeft className="h-4 w-4" />
              Повернутись на сайт
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Вийти
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {!isEditorRoute && (
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/88 backdrop-blur-xl xl:hidden">
            <nav className="flex flex-wrap gap-2 px-4 py-3 sm:px-6">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.href === '/admin' ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)

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
          </header>
        )}

        <main className="flex-1 bg-[#f6f8fb] text-slate-950">
          <div className={cn(
            'mx-auto max-w-[calc(100rem+4rem)] px-4 sm:px-6 lg:px-8',
            isEditorRoute ? 'p-0' : 'py-8'
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

