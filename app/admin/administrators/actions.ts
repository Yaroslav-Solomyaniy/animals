'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { deleteR2Object, getAnimalPhotosBucketConfig } from '@/lib/r2'

export async function inviteAdminAction(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = createServiceClient()

    const { data: existing } = await supabase.auth.admin.listUsers()
    const alreadyExists = existing?.users.some((u) => u.email === email)
    if (alreadyExists) return { ok: false, error: 'Користувач з таким email вже існує або був запрошений' }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Не вдалося надіслати запрошення' }
  }
}

export async function deleteAdminAction(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = createServiceClient()

    // Get avatar URL before deleting the user
    const { data: { user } } = await supabase.auth.admin.getUserById(userId)
    const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) return { ok: false, error: error.message }

    // Delete avatar from R2 if exists
    if (avatarUrl) {
      try {
        const config = getAnimalPhotosBucketConfig()
        const publicUrlBase = config.publicUrl + '/'
        if (avatarUrl.startsWith(publicUrlBase)) {
          const key = decodeURIComponent(avatarUrl.slice(publicUrlBase.length))
          await deleteR2Object({ key, bucket: config.bucket })
        }
      } catch {
        // Avatar cleanup is best-effort — don't fail the whole action
      }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: 'Не вдалося видалити адміністратора' }
  }
}

export async function listAdminsAction() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return []
  return data.users
}
