'use server'

import { revalidatePath } from 'next/cache'
import {
  createNewsFileKey,
  createNewsImageKey,
  createNewsVideoKey,
  createR2PresignedPutUrl,
  deleteR2Object,
  getNewsImagesBucketConfig,
  getNewsVideosBucketConfig,
  getR2PublicUrl,
} from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'

type UploadRequest = {
  newsId: string
  fileName: string
  contentType: string
}

type CoverRequest = {
  newsId: string
  r2Key: string
  publicUrl: string
}

export async function createNewsImageUploadAction(request: UploadRequest) {
  await requireAdminSession()

  if (!request.contentType.startsWith('image/')) {
    return { ok: false as const, error: 'Можна завантажувати тільки зображення.' }
  }

  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('id')
    .eq('id', request.newsId)
    .single()

  if (error || !post) {
    return { ok: false as const, error: 'Новину не знайдено.' }
  }

  const bucket = getNewsImagesBucketConfig()
  const r2Key = createNewsImageKey(request.newsId, request.fileName)

  return {
    ok: true as const,
    uploadUrl: createR2PresignedPutUrl({ bucket: bucket.bucket, key: r2Key }),
    r2Key,
    publicUrl: getR2PublicUrl(bucket, r2Key),
  }
}

export async function setNewsCoverAction(request: CoverRequest) {
  await requireAdminSession()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_posts')
    .update({
      cover_url: request.publicUrl,
      cover_r2_key: request.r2Key,
    })
    .eq('id', request.newsId)
    .select('id, slug')
    .single()

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath(`/admin/news/${data.id}`)
  revalidatePath('/news')
  revalidatePath(`/news/${data.slug}`)

  return { ok: true as const }
}

export async function clearNewsCoverAction(newsId: string) {
  await requireAdminSession()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_posts')
    .update({
      cover_url: null,
      cover_r2_key: null,
    })
    .eq('id', newsId)
    .select('id, slug')
    .single()

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/admin/news')
  revalidatePath(`/admin/news/${data.id}`)
  revalidatePath('/news')
  revalidatePath(`/news/${data.slug}`)

  return { ok: true as const }
}

export async function deleteNewsImageAction(request: { newsId: string; r2Key: string }) {
  await requireAdminSession()
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('id')
    .eq('id', request.newsId)
    .single()

  if (error || !post) {
    return { ok: false as const, error: 'Новину не знайдено.' }
  }

  const bucket = getNewsImagesBucketConfig()
  const deleted = await deleteR2Object({ bucket: bucket.bucket, key: request.r2Key }).catch(() => false)

  return deleted
    ? { ok: true as const }
    : { ok: false as const, error: 'Не вдалося видалити файл з R2.' }
}


export async function createNewsVideoUploadAction(request: UploadRequest) {
  await requireAdminSession()

  const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg']
  if (!allowed.includes(request.contentType)) {
    return { ok: false as const, error: 'Підтримуються тільки відео файли (mp4, webm, mov, avi).' }
  }

  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('id')
    .eq('id', request.newsId)
    .single()

  if (error || !post) {
    return { ok: false as const, error: 'Новину не знайдено.' }
  }

  const bucket = getNewsVideosBucketConfig()
  const r2Key = createNewsVideoKey(request.newsId, request.fileName)

  return {
    ok: true as const,
    uploadUrl: createR2PresignedPutUrl({ bucket: bucket.bucket, key: r2Key }),
    r2Key,
    publicUrl: getR2PublicUrl(bucket, r2Key),
  }
}

export async function createNewsFileUploadAction(request: UploadRequest) {
  await requireAdminSession()

  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('id')
    .eq('id', request.newsId)
    .single()

  if (error || !post) {
    return { ok: false as const, error: 'Новину не знайдено.' }
  }

  const bucket = getNewsImagesBucketConfig()
  const r2Key = createNewsFileKey(request.newsId, request.fileName)

  return {
    ok: true as const,
    uploadUrl: createR2PresignedPutUrl({ bucket: bucket.bucket, key: r2Key }),
    r2Key,
    publicUrl: getR2PublicUrl(bucket, r2Key),
  }
}

async function requireAdminSession() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error('Потрібна авторизація.')
  }
}
