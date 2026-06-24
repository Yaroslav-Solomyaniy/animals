'use server'

import { revalidatePath } from 'next/cache'
import type { NewsContentBlock } from '@/lib/news'
import { createClient } from '@/lib/supabase/server'

export type NewsFormPayload = {
  slug: string
  title: string
  excerpt: string | null
  content_blocks: NewsContentBlock[]
  cover_url: string | null
  cover_r2_key: string | null
  related_animal_id: string | null
  is_published: boolean
  published_at: string | null
}

export async function saveNewsPostAction(
  mode: 'create' | 'edit',
  id: string | null,
  payload: NewsFormPayload
) {
  await requireAdminSession()

  const supabase = await createClient()
  const title = payload.title.trim()

  if (mode === 'edit' && !id) {
    return { ok: false as const, error: 'Не знайдено ID новини для редагування.' }
  }

  if (!title) {
    return { ok: false as const, error: 'Вкажіть заголовок новини.' }
  }

  const existingPost =
    mode === 'edit' && id
      ? await supabase.from('news_posts').select('id, slug').eq('id', id).maybeSingle()
      : null

  if (existingPost?.error) {
    return { ok: false as const, error: existingPost.error.message }
  }

  const slug = await getAvailableSlug({
    supabase,
    requestedSlug: payload.slug,
    title,
    currentId: id,
  })
  const publishedAt = normalizePublishedAt(payload.published_at, payload.is_published)
  const normalizedPayload = {
    slug,
    title,
    excerpt: emptyToNull(payload.excerpt),
    content_blocks: Array.isArray(payload.content_blocks) ? payload.content_blocks : [],
    cover_url: emptyToNull(payload.cover_url),
    cover_r2_key: emptyToNull(payload.cover_r2_key),
    related_animal_id: emptyToNull(payload.related_animal_id),
    is_published: payload.is_published,
    published_at: publishedAt,
  }

  const result =
    mode === 'create'
      ? await supabase.from('news_posts').insert(normalizedPayload).select('id, slug').single()
      : await supabase.from('news_posts').update(normalizedPayload).eq('id', id).select('id, slug').single()

  if (result.error) {
    return { ok: false as const, error: result.error.message }
  }

  revalidateNewsPaths(result.data.id, result.data.slug, existingPost?.data?.slug)

  return {
    ok: true as const,
    id: result.data.id,
    slug: result.data.slug,
  }
}

async function getAvailableSlug({supabase,
  requestedSlug,
  title,
  currentId,}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  requestedSlug: string
  title: string
  currentId: string | null
}) {
  const baseSlug = slugify(requestedSlug || title) || `news-${Date.now()}`
  const { data } = await supabase
    .from('news_posts')
    .select('id, slug')
    .ilike('slug', `${baseSlug}%`)

  const usedSlugs = new Set(
    (data ?? [])
      .filter((post) => post.id !== currentId)
      .map((post) => post.slug)
  )

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug
  }

  let index = 2
  let candidate = `${baseSlug}-${index}`

  while (usedSlugs.has(candidate)) {
    index += 1
    candidate = `${baseSlug}-${index}`
  }

  return candidate
}

function revalidateNewsPaths(id: string, slug: string, previousSlug?: string | null) {
  revalidatePath('/admin/news')
  revalidatePath(`/admin/news/${id}`)
  revalidatePath('/report-and-news')
  revalidatePath(`/report-and-news/${slug}`)

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/report-and-news/${previousSlug}`)
  }
}

export async function deleteNewsPostAction(id: string) {
  await requireAdminSession()
  const supabase = await createClient()

  const { data: post } = await supabase.from('news_posts').select('id, slug').eq('id', id).single()

  const { error } = await supabase.from('news_posts').delete().eq('id', id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath('/report-and-news')
  if (post?.slug) {
    revalidatePath(`/report-and-news/${post.slug}`)
  }

  return { ok: true as const }
}

async function requireAdminSession() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error('Потрібна авторизація.')
  }
}

function normalizePublishedAt(value: string | null, isPublished: boolean) {
  const trimmed = emptyToNull(value)

  if (trimmed) {
    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
  }

  return isPublished ? new Date().toISOString() : null
}

function emptyToNull(value: string | null | undefined) {
  if (value == null) {return null}
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[іїєґ]/g, (char) => transliteration[char] ?? char)
    .replace(/[а-я]/g, (char) => transliteration[char] ?? '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

const transliteration: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
}
