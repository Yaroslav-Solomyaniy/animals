'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAvatarKey, createR2PresignedPutUrl, getAnimalPhotosBucketConfig, getR2PublicUrl } from '@/lib/r2'

export async function updateProfileAction(data: {
  name: string
  position: string
  phone: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.updateUser({ data })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Не вдалося оновити профіль' }
  }
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.email) return { ok: false, error: 'Не авторизовано' }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (signInError) return { ok: false, error: 'Невірний поточний пароль' }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Не вдалося змінити пароль' }
  }
}

export async function getAvatarUploadUrlAction(
  fileName: string,
): Promise<{ ok: true; presignedUrl: string; publicUrl: string } | { ok: false; error: string }> {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { ok: false, error: 'Не авторизовано' }

    const config = getAnimalPhotosBucketConfig()
    const key = createAvatarKey(user.id, fileName)
    const presignedUrl = createR2PresignedPutUrl({ key, bucket: config.bucket })
    const publicUrl = getR2PublicUrl(config, key)

    return { ok: true, presignedUrl, publicUrl }
  } catch {
    return { ok: false, error: 'Не вдалося отримати URL для завантаження' }
  }
}

export async function saveAvatarUrlAction(
  url: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.updateUser({ data: { avatar_url: url } })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Не вдалося зберегти аватар' }
  }
}
