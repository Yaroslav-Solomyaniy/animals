'use server'

import {
  listR2Objects,
  getR2BucketStats,
  deleteR2Object,
  getAnimalPhotosBucketConfig,
  type R2ListResult,
  type R2BucketStats,
} from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function getR2PublicUrlAction(): Promise<string> {
  return process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, '') ?? ''
}

export async function listFilesAction(prefix = '', flat = false): Promise<R2ListResult & { error?: string }> {
  try {
    return await listR2Objects(prefix, flat ? '' : '/')
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('listFilesAction error:', msg)
    return { objects: [], prefixes: [], error: msg }
  }
}

export async function getBucketStatsAction(): Promise<R2BucketStats> {
  try {
    return await getR2BucketStats()
  } catch (e) {
    console.error('getBucketStatsAction error:', e)
    return { totalSize: 0, objectCount: 0 }
  }
}

export type FileReference =
  | { type: 'animal_photo'; animalId: string; animalName: string; isMain: boolean; photoId: string }
  | { type: 'news_cover'; postId: string; postTitle: string }
  | { type: 'report_file'; reportId: string; reportTitle: string }
  | { type: 'admin_avatar'; userId: string; userName: string }

export async function checkFileReferencesAction(key: string): Promise<FileReference[]> {
  const supabase = await createClient()
  const serviceClient = createServiceClient()
  const refs: FileReference[] = []

  // 1. animal_photos — exact r2_key match
  const { data: photos } = await supabase
    .from('animal_photos')
    .select('id, is_main, animal_id, animals(name)')
    .eq('r2_key', key)

  for (const p of photos ?? []) {
    refs.push({
      type: 'animal_photo',
      animalId: p.animal_id,
      animalName: (p.animals as { name: string } | null)?.name ?? 'Невідома тварина',
      isMain: p.is_main ?? false,
      photoId: p.id,
    })
  }

  // 2. posts — exact cover_r2_key match
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title')
    .eq('cover_r2_key', key)

  for (const post of posts ?? []) {
    refs.push({ type: 'news_cover', postId: post.id, postTitle: post.title ?? 'Без назви' })
  }

  // 3. reports — JSONB files array contains entry with matching r2Key
  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, files')
    .contains('files', JSON.stringify([{ r2Key: key }]))

  for (const report of reports ?? []) {
    refs.push({ type: 'report_file', reportId: report.id, reportTitle: report.title ?? 'Без назви' })
  }

  // 4. admin avatars
  const { data: usersData } = await serviceClient.auth.admin.listUsers()
  for (const user of usersData?.users ?? []) {
    const avatarUrl = user.user_metadata?.avatar_url as string | undefined
    if (avatarUrl && (avatarUrl.endsWith(key) || avatarUrl.endsWith(encodeURIComponent(key)))) {
      const name = (user.user_metadata?.name as string | undefined) ?? user.email ?? user.id
      refs.push({ type: 'admin_avatar', userId: user.id, userName: name })
    }
  }

  return refs
}

export async function deleteFileAction(key: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createClient()
    const config = getAnimalPhotosBucketConfig()

    // 1. Delete from R2
    const ok = await deleteR2Object({ key, bucket: config.bucket })
    if (!ok) return { ok: false, error: 'Не вдалося видалити файл з R2' }

    // 2. Clean up animal_photos
    const { data: photos } = await supabase
      .from('animal_photos')
      .select('id, animal_id, is_main')
      .eq('r2_key', key)

    for (const photo of photos ?? []) {
      await supabase.from('animal_photos').delete().eq('id', photo.id)

      // If it was main photo — promote next one
      if (photo.is_main) {
        const { data: next } = await supabase
          .from('animal_photos')
          .select('id')
          .eq('animal_id', photo.animal_id)
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle()
        if (next) {
          await supabase.from('animal_photos').update({ is_main: true }).eq('id', next.id)
        }
      }
    }

    // 3. Clean up posts cover (by cover_r2_key — exact match)
    await supabase
      .from('posts')
      .update({ cover_url: null, cover_r2_key: null })
      .eq('cover_r2_key', key)

    // 4. Clean up reports — remove file entry from JSONB array
    const { data: reportsWithFile } = await supabase
      .from('reports')
      .select('id, files')
      .contains('files', JSON.stringify([{ r2Key: key }]))

    for (const report of reportsWithFile ?? []) {
      const updatedFiles = (report.files as Array<{ r2Key?: string }>).filter(f => f.r2Key !== key)
      await supabase.from('reports').update({ files: updatedFiles }).eq('id', report.id)
    }

    // 5. Clean up admin avatars
    const serviceClient = createServiceClient()
    const { data: usersData } = await serviceClient.auth.admin.listUsers()
    for (const user of usersData?.users ?? []) {
      const avatarUrl = user.user_metadata?.avatar_url as string | undefined
      if (avatarUrl && (avatarUrl.endsWith(key) || avatarUrl.endsWith(encodeURIComponent(key)))) {
        await serviceClient.auth.admin.updateUserById(user.id, {
          data: { avatar_url: null },
        })
      }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}
