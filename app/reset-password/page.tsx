'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Lock, PawPrint } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  // While waiting for Supabase to exchange hash token for a session
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      // Explicitly exchange tokens for a session
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) {
            setError('Посилання недійсне або застаріло. Запросіть нове.')
          }
          // Clean up hash from URL
          history.replaceState(null, '', window.location.pathname)
          setSessionLoading(false)
        })
      return
    }

    // No token in hash — check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/sign-in'
      } else {
        setSessionLoading(false)
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Пароль має бути не менше 6 символів')
      return
    }
    if (password !== confirm) {
      setError('Паролі не збігаються')
      return
    }

    setLoading(true)
    const { error } = await getSupabaseBrowserClient().auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError('Не вдалося змінити пароль. Спробуйте ще раз або запросіть нове посилання.')
    } else {
      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/setup-profile'
      }, 1500)
    }
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-orange-950/50" />

      {/* Form */}
      <div className="relative flex w-full items-center justify-center p-6">
        <div className="w-full max-w-[500px]">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <div className="p-8 sm:p-10">
              {sessionLoading ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                  <p className="text-sm text-white/50">Перевірка посилання...</p>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Пароль встановлено!</h2>
                  <p className="text-sm text-white/50">Перенаправляємо в адмін-панель...</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-orange-300">
                      <PawPrint className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Новий пароль</h2>
                    <p className="mt-1.5 text-sm text-white/50">Введіть новий пароль для вашого акаунту</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-white/70">Новий пароль</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-white/70">Підтвердити пароль</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                        {error}
                      </p>
                    )}

                    <Button type="submit" variant="primary" size="md" showIcon={false} disabled={loading} className="w-full rounded-xl">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {loading ? 'Зберігаємо...' : 'Зберегти пароль'}
                    </Button>

                    <div className="text-center">
                      <a href="/sign-in" className="text-sm font-semibold text-white/40 transition hover:text-white/80">
                        Скасувати
                      </a>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
