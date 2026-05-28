'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function useScrollToTopOnRouteChange() {
  const pathname = usePathname()
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (window.location.hash) {
      return
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname])
}
