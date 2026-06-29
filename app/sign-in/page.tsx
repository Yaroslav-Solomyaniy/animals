'use client'

import { useState } from 'react'
import { ArrowUpLeft, Loader2, PawPrint, Send } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button, LinkButton } from '@/components/ui/Button'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email, password })

    if (error) {
      setError('Невірний email або пароль')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-orange-950/50" />

      {/* Branding — left side (desktop) */}
      <div className="relative hidden flex-col justify-between p-12 lg:flex lg:w-1/2 xl:p-16">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_24px_rgba(242,116,56,0.4)]">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="text-lg font-black text-white">Центр надання допомоги безпритульним тваринам м.Черкаси</span>
        </div>

        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-300">Адмін панель</p>
          <h1 className="mt-3 text-5xl font-black leading-tight text-white xl:text-6xl">
            Керуй
            <br />
            контентом
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-primary bg-clip-text text-transparent">та каталогом</span>
          </h1>
          <p className="mt-5 max-w-[500px] text-lg leading-7 text-white/60">Тварини, новини, звернення, послуги — все в одному місці.</p>
        </div>

        <p className="text-sm text-white/30">© {new Date().getFullYear()} Центр надання допомоги безпритульним тваринам м. Черкаси.</p>
      </div>

      {/* Form — right side */}
      <div className="relative flex w-full flex-col items-center p-6 lg:w-1/2 lg:p-12 xl:p-16">
        {/* "На сайт" — same row height as logo, constrained to form width */}
        <div className="flex h-11 w-full max-w-[500px] shrink-0 items-center justify-end">
          <LinkButton href="/" variant="light" size="sm" showIcon={false}>
            <ArrowUpLeft className="h-4 w-4" />
            Перейти на головну сторінку
          </LinkButton>
        </div>

        <div className="flex flex-1 w-full items-center justify-center">
          <div className="w-full max-w-[500px]">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="p-8 sm:p-10">
                <div className="mb-8 flex flex-col items-center justify-center">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-orange-300">
                    <PawPrint className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white text-center">Вхід в систему</h2>
                  <p className="mt-1.5 text-sm text-white/50 text-center">Введіть email та пароль для входу</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-white/70">Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="welcome@chistota.ck.ua"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-white/70">Пароль</label>
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                      {error}
                    </p>
                  )}

                  <Button type="submit" variant="primary" size="md" showIcon={false} disabled={loading} className="w-full rounded-xl">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? 'Входимо...' : 'Увійти'}
                  </Button>

                  <div className="text-center">
                    <a href="/sign-in/forgot" className="text-sm font-semibold text-white/40 transition hover:text-white/80">
                      Забули пароль?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
