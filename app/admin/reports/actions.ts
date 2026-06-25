'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { deleteR2Object, getPublicFilesBucketConfig } from '@/lib/r2'
import type { ReportFile } from '@/lib/admin-types'

export async function deleteReportAction(id: string) {
  const supabase = await createClient()

  // Delete all R2 files first
  const { data } = await supabase.from('reports').select('files').eq('id', id).single()
  if (data?.files && Array.isArray(data.files)) {
    const config = getPublicFilesBucketConfig()
    await Promise.all(
      (data.files as ReportFile[]).map((f) =>
        f.r2Key ? deleteR2Object({ key: f.r2Key, bucket: config.bucket }) : Promise.resolve()
      )
    )
  }

  const { error } = await supabase.from('reports').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/reports')
  revalidatePath('/news')
  return { success: true }
}
