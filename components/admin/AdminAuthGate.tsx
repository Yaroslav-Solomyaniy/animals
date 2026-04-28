'use client'

import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { LinkButton } from '@/components/ui/Button'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = getSupabaseBrowserClient()

type SessionState = 'loading' | 'authorized' | 'unauthorized'

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [sessionState, setSessionState] = useState<SessionState>('loading')

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!mounted) return
      setSessionState(data.session ? 'authorized' : 'unauthorized')
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSessionState(session ? 'authorized' : 'unauthorized')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (sessionState === 'loading') {
    return (
      <div className="rounded-[28px] border border-orange-200 bg-white p-8 text-center text-gray-500 shadow-soft">
        Перевіряю доступ до адмінки...
      </div>
    )
  }

  if (sessionState === 'unauthorized') {
    return (
      <div className="rounded-[28px] border border-orange-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-extrabold tracking-[0.22em] text-primary uppercase">
          Потрібен вхід
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-text-main">
          Спочатку авторизуйся
        </h2>
        <p className="mt-3 text-gray-500">
          Для роботи з адмінкою потрібна активна сесія Supabase.
        </p>
        <div className="mt-6">
          <LinkButton href="/sign-in">
            Перейти до входу
          </LinkButton>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
