'use client'

import { useTransition, useState } from 'react'
import { CreditCard, Heart, Loader2, PawPrint, User } from 'lucide-react'
import { createDonationAction } from '@/app/donate/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { cn } from '@/lib/utils'

type DonateFormProps = {
  amounts?: number[]
  description?: string | null
  animalId?: string | null
  animalName?: string | null
  compact?: boolean
}

export default function DonateForm({
  amounts = [100, 200, 500, 1000],
  description,
  animalId,
  animalName,
  compact = false,
}: DonateFormProps) {
  const [isPending, startTransition] = useTransition()

  const [selectedPreset, setSelectedPreset] = useState<number | null>(amounts[1] ?? amounts[0] ?? null)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorComment, setDonorComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = customAmount ? Number(customAmount) : (selectedPreset ?? 0)

  function handleCustomChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 7)
    setCustomAmount(digits)
    setSelectedPreset(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!effectiveAmount || effectiveAmount < 1) {
      setError('Вкажіть суму від 1 грн.')
      return
    }

    startTransition(async () => {
      const result = await createDonationAction({
        amount: effectiveAmount,
        animalId: animalId ?? null,
        donorName: donorName || null,
        donorComment: donorComment || null,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      window.location.href = result.pageUrl
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Description */}
      {description && (
        <p className="text-sm leading-6 text-gray-600">{description}</p>
      )}

      {/* Target label */}
      {animalName && (
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-600">
          <PawPrint className="h-4 w-4" />
          Для {animalName}
        </div>
      )}

      {/* Preset amounts */}
      <div>
        <p className="mb-3 text-sm font-bold text-gray-500">Оберіть суму</p>
        <div className={cn('grid gap-2', compact ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-4')}>
          {amounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelectedPreset(amt)
                setCustomAmount('')
              }}
              className={cn(
                'h-14 rounded-2xl border text-base font-extrabold transition-all',
                !customAmount && selectedPreset === amt
                  ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:bg-orange-50'
              )}
            >
              {amt} ₴
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-gray-500">Або інша сума</span>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Наприклад, 350"
          value={customAmount}
          onChange={(e) => handleCustomChange(e.target.value)}
        />
      </label>

      {!compact && (
        <>
          {/* Donor name */}
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-500">
              <User className="mr-1 inline h-3.5 w-3.5" />
              Ваше ім'я (необов'язково)
            </span>
            <Input
              type="text"
              placeholder="Анонімний доброчинець"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              maxLength={120}
            />
          </label>

          {/* Donor comment */}
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-500">
              Коментар (необов'язково)
            </span>
            <Input
              type="text"
              placeholder={animalName ? `Підтримка для ${animalName}` : 'Підтримка центру'}
              value={donorComment}
              onChange={(e) => setDonorComment(e.target.value)}
              maxLength={200}
            />
          </label>
        </>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="h-14 w-full text-sm"
        disabled={isPending || !effectiveAmount}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <CreditCard className="h-5 w-5" />
        )}
        {isPending
          ? 'Перенаправлення…'
          : `Задонатити ${effectiveAmount ? `${effectiveAmount} ₴` : ''}`}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Оплата через Monobank Acquiring. Безпечно та швидко.
        <Heart className="ml-1 inline h-3 w-3 text-rose-400" />
      </p>
    </form>
  )
}
