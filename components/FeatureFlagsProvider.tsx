'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { FeatureFlags } from '@/lib/feature-flags'
import { DEFAULT_FLAGS } from '@/lib/feature-flags'

const FeatureFlagsContext = createContext<FeatureFlags>(DEFAULT_FLAGS)

export function FeatureFlagsProvider({ flags, children }: { flags: FeatureFlags; children: ReactNode }) {
  return <FeatureFlagsContext.Provider value={flags}>{children}</FeatureFlagsContext.Provider>
}

export function useFeatureFlags(): FeatureFlags {
  return useContext(FeatureFlagsContext)
}
