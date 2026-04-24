import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { NewsForm } from '@/components/admin/admin-forms'
import { createClient } from '@/lib/supabase/server'
import type { AnimalRow, NewsPostRow } from '@/lib/admin-types'

export default async function EditNewsPage(props: PageProps<'/admin/news/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const [{ data: post, error }, { data: animals }] = await Promise.all([
    supabase.from('news_posts').select('*').eq('id', id).single(),
    supabase.from('animals').select('*').order('name'),
  ])
  if (error || !post) notFound()

  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Новини" title={`Редагування: ${(post as NewsPostRow).title}`} description="Окрема сторінка редагування новини." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <NewsForm mode="edit" initial={post as NewsPostRow} animals={(animals ?? []) as AnimalRow[]} />
      </div>
    </AdminAuthGate>
  )
}
