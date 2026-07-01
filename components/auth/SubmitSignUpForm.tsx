'use client'

import { useEffect, useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BorderGlow from '@/components/ui/BorderGlow'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = getSupabaseBrowserClient()

type InviteSessionResult = {
  data: {
    session: {
      user: {
        email?: string | null
      }
    } | null
  }
  error: {
    message: string
  } | null
}

type InviteParams = {
  accessToken: string
  refreshToken: string
} | null

function getInviteParams(): InviteParams {
  if (typeof window === 'undefined') {
    return null
  }

  const hash = window.location.hash

  if (!hash) {
    return null
  }

  const params = new URLSearchParams(hash.slice(1))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  const type = params.get('type')

  if (type !== 'invite' || !accessToken || !refreshToken) {
    return null
  }

  return { accessToken, refreshToken }
}

export default function SubmitSignUpForm() {
  const router = useRouter()
  const [inviteParams] = useState(getInviteParams)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingInvite, setIsLoadingInvite] = useState(Boolean(inviteParams))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!inviteParams) {
      window.location.replace('/submit-sign-up/error')
      return
    }

    const invite = inviteParams

    async function acceptInvite() {
      const { data, error } = await supabase.auth.setSession({
        access_token: invite.accessToken,
        refresh_token: invite.refreshToken,
      }) as InviteSessionResult

      if (error) {
        window.location.replace('/submit-sign-up/error')
        return
      }

      setEmail(data.session?.user.email ?? '')
      window.history.replaceState(null, '', '/submit-sign-up')
      setIsLoadingInvite(false)
    }

    void acceptInvite()
  }, [inviteParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    if (!inviteParams) {
      router.push('/submit-sign-up/error')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Пароль має містити щонайменше 6 символів.')
      setIsSubmitting(false)
      return
    }

    if (password !== passwordConfirm) {
      setErrorMessage('Паролі не збігаються.')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <BorderGlow
        borderRadius={32}
        glowRadius={22}
        colors={['#fb923c', '#22c55e', '#38bdf8']}
        glowColor="24 95 62"
        fillOpacity={0.08}
      >
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Запрошення
            </p>
            <h2 className="mt-3 text-3xl font-black text-gray-950">
              Створіть пароль
            </h2>
            <p className="mt-3 text-gray-600">
              Завершіть реєстрацію нового облікового запису.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Email</span>
              <Input
                type="email"
                required
                value={email}
                disabled
                placeholder="welcome@chistota.ck.ua"
                className="mt-1"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Пароль</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Новий пароль"
                className="mt-1 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-700">Повторіть пароль</span>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Повторіть новий пароль"
                className="mt-1 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
              />
            </label>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-primary">
              {errorMessage}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isLoadingInvite || isSubmitting}
            className="mt-6 w-full text-sm"
          >
            {isLoadingInvite
              ? 'Перевіряємо запрошення...'
              : isSubmitting
                ? 'Зачекайте...'
                : 'Завершити реєстрацію'}
            <KeyRound className="h-4 w-4" />
          </Button>
        </form>
      </BorderGlow>
    </div>
  )
}
