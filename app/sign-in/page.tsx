'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import BorderGlow from '@/components/ui/BorderGlow'
import {useRouter} from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = getSupabaseBrowserClient()

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <BorderGlow
              borderRadius={32}
              glowRadius={22}
              colors={['#fb923c', '#22c55e', '#38bdf8']}
              glowColor="24 95 62"
              fillOpacity={0.08}
          >
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* HEADER */}
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                  З поверненням!
                </p>
                <h2 className="mt-3 text-3xl font-black text-gray-950">
                  Увійти в систему
                </h2>
                <p className="mt-3 text-gray-600">
                  Введіть email та пароль для входу
                </p>
              </div>

              {/* FIELDS */}
              <div className="space-y-4">
                {/* EMAIL */}
                <label className="block space-y-2">
                <span className="text-sm font-semibold text-gray-700">
                  Email
                </span>
                  <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Welcome@chistota.ck.ua"
                      className="mt-1"
                  />
                </label>

                {/* PASSWORD */}
                <label className="block space-y-2">
                <span className="text-sm font-semibold text-gray-700">
                  Пароль
                </span>
                  <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ваш пароль"
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white mt-1"
                  />
                </label>
              </div>

              {errorMessage ? (
                <div className="mt-4 rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-primary">
                  {errorMessage}
                </div>
              ) : null}

              {/* BUTTON */}
              <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full"
              >
                Увійти
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </BorderGlow>
        </div>
      </main>
  )
}
