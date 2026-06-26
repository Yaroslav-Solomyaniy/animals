export type FeatureFlags = {
  donationsEnabled: boolean
  donationDescription: string | null
  donationAmounts: number[]
  reportsBlockEnabled: boolean
}

export const DEFAULT_FLAGS: FeatureFlags = {
  donationsEnabled: false,
  donationDescription: null,
  donationAmounts: [100, 200, 500, 1000],
  reportsBlockEnabled: true,
}
