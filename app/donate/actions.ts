'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/site-settings'

const MONO_API = 'https://api.monobank.ua'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? ''
const MONO_TOKEN = process.env.MONOBANK_TOKEN ?? ''

export type CreateDonationInput = {
  amount: number
  animalId?: string | null
  donorName?: string | null
  donorComment?: string | null
}

export type CreateDonationResult =
  | { ok: true; pageUrl: string }
  | { ok: false; error: string }

export async function createDonationAction(
  input: CreateDonationInput
): Promise<CreateDonationResult> {
  if (!input.amount || input.amount < 1) {
    return { ok: false, error: 'Сума має бути не менше 1 грн.' }
  }

  const settings = await getSiteSettings()
  if (!settings.donationsEnabled) {
    return { ok: false, error: 'Донати тимчасово недоступні.' }
  }

  if (!MONO_TOKEN) {
    return { ok: false, error: 'Платіжний провайдер ще не налаштований.' }
  }

  const reference = `don-${Date.now()}`
  const destination = input.donorComment?.trim() || 'Підтримка центру допомоги тваринам'
  const comment = input.donorComment?.trim() || undefined

  let monoRes: Response
  try {
    monoRes = await fetch(`${MONO_API}/api/merchant/invoice/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': MONO_TOKEN,
      },
      body: JSON.stringify({
        amount: input.amount * 100,
        ccy: 980,
        merchantPaymInfo: { reference, destination, comment },
        redirectUrl: `${BASE_URL}/donate/success`,
        webHookUrl: `${BASE_URL}/api/webhooks/monobank`,
        validity: 3600,
        paymentType: 'debit',
      }),
      cache: 'no-store',
    })
  } catch (err) {
    console.error('[donation] Monobank fetch error', err)
    return { ok: false, error: "Не вдалося зв'язатися з платіжним провайдером." }
  }

  if (!monoRes.ok) {
    const body = await monoRes.text().catch(() => '')
    console.error('[donation] Monobank error', monoRes.status, body)
    return { ok: false, error: 'Помилка створення платежу. Спробуйте пізніше.' }
  }

  const mono = (await monoRes.json()) as { invoiceId: string; pageUrl: string }

  const supabase = await createClient()
  const { error: dbError } = await supabase.from('donations').insert({
    invoice_id: mono.invoiceId,
    amount: input.amount,
    animal_id: input.animalId ?? null,
    donor_name: input.donorName?.trim() || null,
    donor_comment: comment ?? null,
    status: 'created',
    page_url: mono.pageUrl,
  })

  if (dbError) {
    console.error('[donation] DB insert error', dbError)
  }

  const cookieStore = await cookies()
  cookieStore.set('donation_pending', mono.invoiceId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600,
    path: '/',
  })

  return { ok: true, pageUrl: mono.pageUrl }
}
