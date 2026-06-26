import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client — bypasses RLS.
 * Use only in Server Actions / Route Handlers, never on the client.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
