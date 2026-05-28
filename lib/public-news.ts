import 'server-only'

import type { NewsPostRow } from '@/lib/admin-types'
import type { NewsContentBlock, NewsItem } from '@/lib/news'
import { createClient } from '@/lib/supabase/server'

const FALLBACK_NEWS_IMAGE = '/dog.png'
const NEWS_CATEGORY = 'Новини центру'

export async function getPublishedNews(limit?: number): Promise<NewsItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from('news_posts')
    .select('*')
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to load published news', error)
    return []
  }

  return (data ?? []).map((post) => mapNewsPost(post as NewsPostRow))
}

export async function getPublishedNewsBySlugOrId(slugOrId: string): Promise<NewsItem | null> {
  const supabase = await createClient()
  const selector = isUuid(slugOrId)
    ? supabase.from('news_posts').select('*').eq('id', slugOrId)
    : supabase.from('news_posts').select('*').eq('slug', slugOrId)

  const { data, error } = await selector
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error) {
    console.error('Failed to load published news item', error)
    return null
  }

  return data ? mapNewsPost(data as NewsPostRow) : null
}

export async function getRelatedPublishedNews(currentId: string, limit = 3): Promise<NewsItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load related news', error)
    return []
  }

  return (data ?? []).map((post) => mapNewsPost(post as NewsPostRow))
}

function mapNewsPost(post: NewsPostRow): NewsItem {
  const publishedAt = post.published_at ? new Date(post.published_at) : null
  const content = normalizeNewsBlocks(post.content_blocks, post.excerpt)

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    date: formatDate(publishedAt),
    category: NEWS_CATEGORY,
    image: post.cover_url || FALLBACK_NEWS_IMAGE,
    readingTime: getReadingTime(content),
    publishedTime: formatTime(publishedAt),
    relatedAnimalId: post.related_animal_id ?? undefined,
    content,
  }
}

function normalizeNewsBlocks(value: unknown, excerpt: string | null): NewsContentBlock[] {
  if (!Array.isArray(value)) {
    return excerpt ? [{ type: 'paragraph', width: 'narrow', text: excerpt }] : []
  }

  const blocks = value.filter(isNewsContentBlock)

  if (blocks.length > 0) {
    return blocks
  }

  return excerpt ? [{ type: 'paragraph', width: 'narrow', text: excerpt }] : []
}

function isNewsContentBlock(value: unknown): value is NewsContentBlock {
  if (!value || typeof value !== 'object' || !('type' in value)) {
    return false
  }

  const block = value as { type?: unknown }
  return (
    block.type === 'paragraph' ||
    block.type === 'image' ||
    block.type === 'video' ||
    block.type === 'table' ||
    block.type === 'buttons' ||
    block.type === 'gallery' ||
    block.type === 'slider'
  )
}

function getReadingTime(blocks: NewsContentBlock[]) {
  const words = blocks
    .map(extractBlockText)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 180))

  return `${minutes} хв читання`
}

function extractBlockText(block: NewsContentBlock): string {
  switch (block.type) {
    case 'paragraph':
      return block.text
    case 'table':
      return [block.title, ...block.columns, ...block.rows.flat()].filter(Boolean).join(' ')
    case 'buttons':
      return block.buttons.map((button) => button.label).join(' ')
    case 'image':
    case 'video':
    case 'gallery':
    case 'slider':
      return ''
  }
}

function formatDate(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) {
    return 'Без дати'
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatTime(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
