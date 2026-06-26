import 'server-only'
import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'
import type { FeatureFlags } from '@/lib/feature-flags'
import { DEFAULT_FLAGS } from '@/lib/feature-flags'

/** @deprecated Use FeatureFlags type instead */
export type SiteSettings = FeatureFlags

export const getSiteSettings = cache(async (): Promise<FeatureFlags> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('donations_enabled, donation_description, donation_amounts, reports_block_enabled')
      .eq('id', 1)
      .single()

    if (error || !data) return DEFAULT_FLAGS

    return {
      donationsEnabled: data.donations_enabled ?? false,
      donationDescription: data.donation_description ?? null,
      donationAmounts:
        Array.isArray(data.donation_amounts) && data.donation_amounts.length > 0
          ? (data.donation_amounts as number[])
          : DEFAULT_FLAGS.donationAmounts,
      reportsBlockEnabled: data.reports_block_enabled ?? DEFAULT_FLAGS.reportsBlockEnabled,
    }
  } catch {
    return DEFAULT_FLAGS
  }
})
