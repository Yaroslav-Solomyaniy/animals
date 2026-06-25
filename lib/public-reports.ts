import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { ReportFile } from '@/lib/admin-types'

export type PublicReport = {
  id: string
  title: string
  period: string | null
  description: string | null
  files: ReportFile[]
  publishedAt: string
  date: string
}

export async function getPublishedReports(): Promise<PublicReport[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reports')
    .select('id, title, period, description, files, published_at')
    .eq('is_published', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Failed to load published reports', error)
    return []
  }

  return (data ?? []).map((r) => {
    const parsedDate = r.published_at ? new Date(r.published_at) : null
    return {
      id: r.id,
      title: r.title,
      period: r.period ?? null,
      description: r.description ?? null,
      files: Array.isArray(r.files) ? (r.files as ReportFile[]) : [],
      publishedAt: r.published_at ?? '',
      date: parsedDate
        ? new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(parsedDate)
        : '',
    }
  })
}
