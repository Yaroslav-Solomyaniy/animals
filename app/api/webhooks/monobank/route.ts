import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const MONO_API = 'https://api.monobank.ua'
const MONO_TOKEN = process.env.MONOBANK_TOKEN ?? ''

// ── Public key cache ──────────────────────────────────────────────────────────
let cachedPubKey: CryptoKey | null = null
let pubKeyFetchedAt = 0
const PUB_KEY_TTL_MS = 60 * 60 * 1000 // 1h

async function getMonobankPublicKey(): Promise<CryptoKey | null> {
  const now = Date.now()
  if (cachedPubKey && now - pubKeyFetchedAt < PUB_KEY_TTL_MS) {
    return cachedPubKey
  }

  try {
    const res = await fetch(`${MONO_API}/api/merchant/pubkey`, {
      headers: { 'X-Token': MONO_TOKEN },
      cache: 'no-store',
    })
    if (!res.ok) return null

    const { key } = (await res.json()) as { key: string }
    // key is base64-encoded DER (SPKI)
    const der = Buffer.from(key, 'base64')
    cachedPubKey = await crypto.subtle.importKey(
      'spki',
      der,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    )
    pubKeyFetchedAt = now
    return cachedPubKey
  } catch (err) {
    console.error('[mono-webhook] pubkey fetch error', err)
    return null
  }
}

// ── Signature verification ────────────────────────────────────────────────────
async function verifySignature(rawBody: Uint8Array, signatureB64: string): Promise<boolean> {
  try {
    const pubKey = await getMonobankPublicKey()
    if (!pubKey) return false

    const signature = Buffer.from(signatureB64, 'base64')
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      pubKey,
      signature,
      rawBody.buffer.slice(rawBody.byteOffset, rawBody.byteOffset + rawBody.byteLength) as ArrayBuffer
    )
  } catch (err) {
    console.error('[mono-webhook] verify error', err)
    return false
  }
}

// ── Status mapping ────────────────────────────────────────────────────────────
type MonoStatus = 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired'

function mapStatus(monoStatus: MonoStatus): string {
  const map: Record<MonoStatus, string> = {
    created: 'created',
    processing: 'processing',
    hold: 'processing',
    success: 'success',
    failure: 'failure',
    reversed: 'reversed',
    expired: 'failure',
  }
  return map[monoStatus] ?? 'processing'
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const rawBody = new Uint8Array(await req.arrayBuffer())
  const xSign = req.headers.get('X-Sign') ?? ''

  // Verify signature (skip only if token not configured — dev mode)
  if (MONO_TOKEN) {
    const valid = await verifySignature(rawBody, xSign)
    if (!valid) {
      console.warn('[mono-webhook] invalid signature')
      return new Response('Unauthorized', { status: 401 })
    }
  }

  let payload: {
    invoiceId: string
    status: MonoStatus
    amount?: number
    finalAmount?: number
    createdDate?: number
    modifiedDate?: number
  }

  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody))
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  const { invoiceId, status, modifiedDate } = payload
  if (!invoiceId || !status) {
    return new Response('Bad Request', { status: 400 })
  }

  const dbStatus = mapStatus(status)
  const paidAt =
    status === 'success' && modifiedDate
      ? new Date(modifiedDate * 1000).toISOString()
      : null

  const supabase = await createClient()
  const { error } = await supabase
    .from('donations')
    .update({
      status: dbStatus,
      ...(paidAt ? { paid_at: paidAt } : {}),
    })
    .eq('invoice_id', invoiceId)

  if (error) {
    console.error('[mono-webhook] db update error', error)
    // Return 200 anyway so Monobank doesn't retry on DB hiccups
  }

  if (dbStatus === 'success') {
    revalidatePath('/donate')
  }

  return new Response('OK', { status: 200 })
}
