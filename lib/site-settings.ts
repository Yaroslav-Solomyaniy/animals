import 'server-only'

import { createClient } from '@/lib/supabase/server'

export type SiteSettings = {
  donationsEnabled: boolean
  donationDescription: string | null
  donationAmounts: number[]
}

const DEFAULT_SETTINGS: SiteSettings = {
  donationsEnabled: false,
  donationDescription: null,
  donationAmounts: [100, 200, 500, 1000],
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('donations_enabled, donation_description, donation_amounts')
      .eq('id', 1)
      .single()

    if (error || !data) {
      return DEFAULT_SETTINGS
    }

    return {
      donationsEnabled: data.donations_enabled ?? false,
      donationDescription: data.donation_description ?? null,
      donationAmounts:
        Array.isArray(data.donation_amounts) && data.donation_amounts.length > 0
          ? (data.donation_amounts as number[])
          : DEFAULT_SETTINGS.donationAmounts,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}
