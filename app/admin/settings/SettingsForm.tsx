'use client'

import { useTransition, useState, useRef, useCallback } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/FormControls'
import type { SiteSettings } from '@/lib/site-settings'
import { saveSettingsAction } from './actions'

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [donationsEnabled, setDonationsEnabled] = useState(settings.donationsEnabled)
  const [reportsBlockEnabled, setReportsBlockEnabled] = useState(settings.reportsBlockEnabled)

  const descriptionRef = useRef<HTMLInputElement>(null)
  const amountsRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback((overrides?: {
    donationsEnabled?: boolean
    reportsBlockEnabled?: boolean
  }) => {
    const de = overrides?.donationsEnabled ?? donationsEnabled
    const rbe = overrides?.reportsBlockEnabled ?? reportsBlockEnabled

    const formData = new FormData()
    if (de) formData.set('donations_enabled', 'on')
    if (rbe) formData.set('reports_block_enabled', 'on')
    formData.set('donation_description', descriptionRef.current?.value ?? settings.donationDescription ?? '')
    formData.set('donation_amounts', amountsRef.current?.value ?? settings.donationAmounts.join(', '))

    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveSettingsAction(formData)
      if (result.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError(result.error)
      }
    })
  }, [donationsEnabled, reportsBlockEnabled, settings])

  const debounceSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(), 800)
  }, [save])

  return (
    <div className="flex flex-col gap-4">
      {/* Status bar */}
      <div className="flex h-6 items-center gap-2 text-sm">
        {isPending && (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            <span className="text-slate-400">Збереження…</span>
          </>
        )}
        {!isPending && saved && (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-emerald-600">Збережено</span>
          </>
        )}
        {!isPending && error && (
          <span className="font-semibold text-rose-600">{error}</span>
        )}
      </div>

      {/* Donations toggle */}
      <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${donationsEnabled ? 'border-orange-200 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-200'}`}>
        <div className="flex-1">
          <p className="font-extrabold text-slate-950">
            {donationsEnabled ? 'Прийом донатів увімкнено' : 'Прийом донатів вимкнено'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {donationsEnabled
              ? 'Весь контент фінансової допомоги видно на сайті — форма донату, сторінка /donate та блок на /help-for-us.'
              : 'Форма донату схована, сторінка /donate показує заглушку, блок на /help-for-us прибирається.'}
          </p>
        </div>
        <input
          type="checkbox"
          checked={donationsEnabled}
          onChange={(e) => {
            const val = e.target.checked
            setDonationsEnabled(val)
            save({ donationsEnabled: val })
          }}
          className="peer sr-only"
        />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-primary after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      </label>

      {/* Collapsible description + amounts */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: donationsEnabled ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-6 pb-1 pt-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Опис донатів (необов'язково)
              </span>
              <Input
                ref={descriptionRef}
                name="donation_description"
                type="text"
                defaultValue={settings.donationDescription ?? ''}
                placeholder="Ваш донат іде на корм, ліки та щоденний догляд тварин."
                maxLength={300}
                onChange={debounceSave}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Відображається на сторінці /donate та картках тварин.
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Суми для швидкого вибору (через кому, грн)
              </span>
              <Input
                ref={amountsRef}
                name="donation_amounts"
                type="text"
                defaultValue={settings.donationAmounts.join(', ')}
                placeholder="100, 200, 500, 1000"
                onChange={debounceSave}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Від 1 до 8 цілих чисел. Наприклад: 50, 100, 250, 500, 1000
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Reports block toggle */}
      <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${reportsBlockEnabled ? 'border-orange-200 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-200'}`}>
        <div className="flex-1">
          <p className="font-extrabold text-slate-950">
            {reportsBlockEnabled ? 'Блок звітів увімкнено' : 'Блок звітів вимкнено'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {reportsBlockEnabled
              ? 'Блок звітів відображається на сторінці /help-for-us.'
              : 'Блок звітів прихований на сторінці /help-for-us.'}
          </p>
        </div>
        <input
          type="checkbox"
          checked={reportsBlockEnabled}
          onChange={(e) => {
            const val = e.target.checked
            setReportsBlockEnabled(val)
            save({ reportsBlockEnabled: val })
          }}
          className="peer sr-only"
        />
        <span className="relative h-7 w-12 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-primary after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      </label>
    </div>
  )
}
