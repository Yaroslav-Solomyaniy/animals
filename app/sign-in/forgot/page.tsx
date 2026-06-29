'use client'

import { useState } from 'react'
import { Loader2, Mail, PawPrint } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button, LinkButton } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError('Не вдалося надіслати листа. Перевірте email.')
    } else {
      setSuccess(true)
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
      <div className="relative flex w-full flex-col items-center justify-center p-6">
        <div className="flex w-full items-center justify-center">
          <div className="w-full max-w-[500px]">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="p-8 sm:p-10">
                {success ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                      <Mail className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Лист надіслано!</h2>
                    <p className="text-sm text-white/50">
                      Перевірте пошту та перейдіть за посиланням для скидання пароля.
                    </p>
                    <LinkButton href="/sign-in" variant="secondary" size="sm" showIcon={false} className="mt-2 rounded-xl">
                      Повернутись до входу
                    </LinkButton>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-orange-300">
                        <PawPrint className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black text-white">Відновлення паролю</h2>
                      <p className="mt-1.5 text-sm text-white/50">
                        Введіть email — надішлемо посилання для скидання пароля.
                      </p>
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

                      {error && (
                        <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                          {error}
                        </p>
                      )}

                      <Button type="submit" variant="primary" size="md" showIcon={false} disabled={loading} className="w-full rounded-xl">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                        {loading ? 'Надсилаємо...' : 'Надіслати'}
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
    </div>
  )
}
