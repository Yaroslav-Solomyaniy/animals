import { AlertTriangle } from 'lucide-react'
import { AngryAnimation } from '@/components/animations'
import BorderGlow from '@/components/ui/BorderGlow'
import { LinkButton } from '@/components/ui/Button'

type ErrorPageProps = {
  searchParams: Promise<{
    code?: string
  }>
}

const errorMessages: Record<string, string> = {
  otp_expired: 'Посилання запрошення застаріло або вже було використане.',
}

export default async function SubmitSignUpErrorPage({ searchParams }: ErrorPageProps) {
  const { code } = await searchParams
  const message =
    code && errorMessages[code]
      ? errorMessages[code]
      : 'Посилання могло застаріти, вже бути використаним або бути відкритим без токена запрошення.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-4xl">
        <BorderGlow
          borderRadius={24}
          glowRadius={22}
          colors={['#fb923c', '#ef4444', '#38bdf8']}
          glowColor="239 68 68"
          fillOpacity={0.08}
        >
          <div className="grid items-center gap-2 p-6 text-center sm:p-8 md:grid-cols-[1fr_auto] md:gap-8 md:text-left">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-primary md:mx-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Запрошення недійсне
              </p>
              <h1 className="mt-3 text-3xl font-black text-gray-950">
                Не вдалося завершити реєстрацію
              </h1>
              <p className="mt-3 text-gray-600">
                {message}
              </p>
              <div className="mt-7">
                <LinkButton href="/sign-in" size="lg" className="w-full text-sm sm:w-auto">
                  Перейти до входу
                </LinkButton>
              </div>
            </div>
            <div className="order-first flex justify-center md:order-none">
              <AngryAnimation size="xl" />
            </div>
          </div>
        </BorderGlow>
      </div>
    </main>
  )
}
