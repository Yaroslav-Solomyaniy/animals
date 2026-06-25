'use client'

import { useTransition, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import type { SiteSettings } from '@/lib/site-settings'
import { saveSettingsAction } from './actions'

type SettingsFormProps = {
  settings: SiteSettings
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await saveSettingsAction(formData)
      if (result.ok) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Toggle */}
      <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-orange-200">
        <div className="flex-1">
          <p className="font-extrabold text-slate-950">Прийом донатів увімкнено</p>
          <p className="mt-1 text-sm text-slate-500">
            Коли вимкнено — форма донату схована, сторінки /donate та /help-for-us покажуть заглушку.
          </p>
        </div>
        <input
          type="checkbox"
          name="donations_enabled"
          defaultChecked={settings.donationsEnabled}
          className="h-5 w-5 cursor-pointer rounded border-slate-300 accent-primary"
        />
      </label>

      {/* Description */}
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-600">
          Опис донатів (необов'язково)
        </span>
        <Input
          name="donation_description"
          type="text"
          defaultValue={settings.donationDescription ?? ''}
          placeholder="Ваш донат іде на корм, ліки та щоденний догляд тварин."
          maxLength={300}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Відображається на сторінці /donate та картках тварин.
        </p>
      </label>

      {/* Amounts */}
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-600">
          Суми для швидкого вибору (через кому, грн)
        </span>
        <Input
          name="donation_amounts"
          type="text"
          defaultValue={settings.donationAmounts.join(', ')}
          placeholder="100, 200, 500, 1000"
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Від 1 до 8 цілих чисел. Наприклад: 50, 100, 250, 500, 1000
        </p>
      </label>

      {/* Feedback */}
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{error}</p>
      )}
      {success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
          Налаштування збережено!
        </p>
      )}

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? 'Збереження…' : 'Зберегти'}
        </Button>
      </div>
    </form>
  )
}
