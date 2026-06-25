'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type SaveSettingsResult = { ok: true } | { ok: false; error: string }

async function requireAdminSession() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Unauthorized')
}

export async function saveSettingsAction(formData: FormData): Promise<SaveSettingsResult> {
  try {
    await requireAdminSession()
  } catch {
    return { ok: false, error: 'Необхідна авторизація.' }
  }

  const donationsEnabled = formData.get('donations_enabled') === 'on'
  const donationDescription = (formData.get('donation_description') as string | null)?.trim() || null

  // Parse comma-separated integers for donation_amounts
  const amountsRaw = (formData.get('donation_amounts') as string | null) ?? ''
  const donationAmounts = amountsRaw
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 8)

  if (donationAmounts.length === 0) {
    return { ok: false, error: 'Вкажіть хоча б одну суму для донату.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({
      donations_enabled: donationsEnabled,
      donation_description: donationDescription,
      donation_amounts: donationAmounts,
    })
    .eq('id', 1)

  if (error) {
    console.error('[admin/settings] save error', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/donate')
  revalidatePath('/help-for-us')
  revalidatePath('/animals/[id]', 'page')

  return { ok: true }
}
