'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminPreviewBar() {
  const [user, setUser] = useState<User | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!user || hidden) return null

  const meta = user.user_metadata
  const name = meta?.name as string | undefined
  const position = meta?.position as string | undefined
  const avatarUrl = meta?.avatar_url as string | undefined
  const initial = (name ?? user.email ?? 'A')[0].toUpperCase()

  async function handleSignOut() {
    await getSupabaseBrowserClient().auth.signOut()
    window.location.reload()
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl">
      {/* Avatar */}
      {avatarUrl ? (
        <img src={avatarUrl} alt={name ?? user.email} className="h-8 w-8 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">
          {initial}
        </span>
      )}

      {/* Info */}
      <div className="hidden sm:block">
        <p className="text-xs font-extrabold leading-none text-slate-950">
          {name ?? user.email}
        </p>
        {position && (
          <p className="mt-0.5 text-[11px] font-semibold leading-none text-slate-400">{position}</p>
        )}
        {!position && name && (
          <p className="mt-0.5 text-[11px] font-semibold leading-none text-slate-400">{user.email}</p>
        )}
      </div>

      <div className="mx-0.5 h-4 w-px shrink-0 bg-slate-200" />

      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Адмін-панель
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:block">Вийти</span>
      </button>

      <button
        type="button"
        onClick={() => setHidden(true)}
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
