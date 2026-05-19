'use client'

import { useEffect } from 'react'

const LOADER_DELAY_MS = 10000

export default function SupabaseInviteRedirect() {
  useEffect(() => {
    const hash = window.location.hash

    if (!hash || window.location.pathname === '/submit-sign-up') {
      return
    }

    const params = new URLSearchParams(hash.slice(1))
    const isSupabaseAuthError = params.has('error') || params.has('error_code')

    if (isSupabaseAuthError) {
      const searchParams = new URLSearchParams()
      const errorCode = params.get('error_code')

      if (errorCode) {
        searchParams.set('code', errorCode)
      }

      document.documentElement.setAttribute('data-auth-callback', 'pending')
      window.setTimeout(() => {
        window.location.replace(`/submit-sign-up/error?${searchParams.toString()}`)
      }, LOADER_DELAY_MS)
      return
    }

    const isSupabaseInvite =
      params.get('type') === 'invite' &&
      params.has('access_token') &&
      params.has('refresh_token')

    if (!isSupabaseInvite) {
      return
    }

    document.documentElement.setAttribute('data-auth-callback', 'pending')
    window.setTimeout(() => {
      window.location.replace(`/submit-sign-up${hash}`)
    }, LOADER_DELAY_MS)
  }, [])

  return null
}
