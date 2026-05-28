'use server'

import { revalidatePath } from 'next/cache'
import {
  createAnimalPhotoKey,
  createR2PresignedPutUrl,
  deleteR2Object,
  getAnimalPhotosBucketConfig,
  getR2PublicUrl,
} from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'

type UploadRequest = {
  animalId: string
  fileName: string
  contentType: string
}

type RegisterPhotoRequest = {
  animalId: string
  r2Key: string
  publicUrl: string
  alt?: string
}

export async function createAnimalPhotoUploadAction(request: UploadRequest) {
  await requireAdminSession()

  if (!request.contentType.startsWith('image/')) {
    return { ok: false as const, error: 'Можна завантажувати тільки зображення.' }
  }

  const supabase = await createClient()
  const { data: animal, error } = await supabase
    .from('animals')
    .select('id')
    .eq('id', request.animalId)
    .single()

  if (error || !animal) {
    return { ok: false as const, error: 'Тварину не знайдено.' }
  }

  const bucket = getAnimalPhotosBucketConfig()
  const r2Key = createAnimalPhotoKey(request.animalId, request.fileName)

  return {
    ok: true as const,
    uploadUrl: createR2PresignedPutUrl({ bucket: bucket.bucket, key: r2Key }),
    r2Key,
    publicUrl: getR2PublicUrl(bucket, r2Key),
  }
}

export async function registerAnimalPhotoAction(request: RegisterPhotoRequest) {
  await requireAdminSession()
  const supabase = await createClient()
  const { count } = await supabase
    .from('animal_photos')
    .select('id', { count: 'exact', head: true })
    .eq('animal_id', request.animalId)
  const isFirstPhoto = (count ?? 0) === 0

  const { data, error } = await supabase
    .from('animal_photos')
    .insert({
      animal_id: request.animalId,
      r2_key: request.r2Key,
      public_url: request.publicUrl,
      alt: request.alt?.trim() || null,
      sort_order: count ?? 0,
      is_main: isFirstPhoto,
    })
    .select('*')
    .single()

  if (error) {
    return { ok: false as const, error: error.message }
  }

  await revalidateAnimalPaths(supabase, request.animalId)
  return { ok: true as const, photo: data }
}

export async function setMainAnimalPhotoAction(animalId: string, photoId: string) {
  await requireAdminSession()
  const supabase = await createClient()

  const reset = await supabase
    .from('animal_photos')
    .update({ is_main: false })
    .eq('animal_id', animalId)

  if (reset.error) {
    return { ok: false as const, error: reset.error.message }
  }

  const update = await supabase
    .from('animal_photos')
    .update({ is_main: true })
    .eq('animal_id', animalId)
    .eq('id', photoId)

  if (update.error) {
    return { ok: false as const, error: update.error.message }
  }

  await revalidateAnimalPaths(supabase, animalId)
  return { ok: true as const }
}

export async function deleteAnimalPhotoAction(animalId: string, photoId: string) {
  await requireAdminSession()
  const supabase = await createClient()

  const { data: photo, error: photoError } = await supabase
    .from('animal_photos')
    .select('id, animal_id, r2_key, is_main')
    .eq('id', photoId)
    .eq('animal_id', animalId)
    .single()

  if (photoError || !photo) {
    return { ok: false as const, error: 'Фото не знайдено.' }
  }

  const deleted = await supabase
    .from('animal_photos')
    .delete()
    .eq('id', photoId)
    .eq('animal_id', animalId)

  if (deleted.error) {
    return { ok: false as const, error: deleted.error.message }
  }

  const { data: remainingPhotos, error: remainingError } = await supabase
    .from('animal_photos')
    .select('id, is_main')
    .eq('animal_id', animalId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (remainingError) {
    return { ok: false as const, error: remainingError.message }
  }

  let nextMainPhotoId: string | null = null
  const hasMainPhoto = (remainingPhotos ?? []).some((remainingPhoto) => remainingPhoto.is_main)

  if ((remainingPhotos?.length ?? 0) > 0 && !hasMainPhoto) {
    nextMainPhotoId = remainingPhotos?.[0]?.id ?? null

    if (nextMainPhotoId) {
      const mainResult = await supabase
        .from('animal_photos')
        .update({ is_main: true })
        .eq('id', nextMainPhotoId)
        .eq('animal_id', animalId)

      if (mainResult.error) {
        return { ok: false as const, error: mainResult.error.message }
      }
    }
  }

  let r2Deleted = true
  if (photo.r2_key) {
    const bucket = getAnimalPhotosBucketConfig()
    r2Deleted = await deleteR2Object({ bucket: bucket.bucket, key: photo.r2_key }).catch(() => false)
  }

  await revalidateAnimalPaths(supabase, animalId)
  return { ok: true as const, deletedPhotoId: photoId, nextMainPhotoId, r2Deleted }
}

async function revalidateAnimalPaths(supabase: Awaited<ReturnType<typeof createClient>>, animalId: string) {
  const { data } = await supabase
    .from('animals')
    .select('slug')
    .eq('id', animalId)
    .maybeSingle()

  revalidatePath('/admin/animals')
  revalidatePath(`/admin/animals/${animalId}`)
  revalidatePath('/animals')

  if (data?.slug) {
    revalidatePath(`/animals/${data.slug}`)
  }
}

async function requireAdminSession() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error('Потрібна авторизація.')
  }
}
