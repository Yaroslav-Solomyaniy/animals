import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { NewsForm } from '@/components/admin/forms/NewsForm'
import { createClient } from '@/lib/supabase/server'
import type { AnimalRow, NewsPostRow } from '@/lib/admin-types'

export default async function EditNewsPage(props: PageProps<'/admin/news/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const [{ data: post, error }, { data: animals }] = await Promise.all([
    supabase.from('news_posts').select('*').eq('id', id).single(),
    supabase.from('animals').select('*').order('name'),
  ])
  if (error || !post) {notFound()}

  return (
    <AdminAuthGate>
      <NewsForm mode="edit" initial={post as NewsPostRow} animals={(animals ?? []) as AnimalRow[]} />
    </AdminAuthGate>
  )
}
