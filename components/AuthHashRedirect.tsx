'use client'

import { useEffect } from 'react'

/**
 * Handles Supabase auth hash fragments at the root URL.
 * When Supabase invite/recovery links redirect to `/#access_token=...&type=invite`,
 * this component detects the hash and redirects to /reset-password preserving the hash.
 */
export default function AuthHashRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const type = params.get('type')
    const accessToken = params.get('access_token')

    if (accessToken && (type === 'invite' || type === 'recovery')) {
      // Preserve the hash so /reset-password can pick up the token
      window.location.replace(`/reset-password${hash}`)
    }
  }, [])

  return null
}
