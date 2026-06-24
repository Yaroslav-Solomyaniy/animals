import Link from 'next/link'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { createClient } from '@/lib/supabase/server'
import type { NewsPostRow } from '@/lib/admin-types'
import AdminNewsClient from './AdminNewsClient'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
  const posts = (data ?? []) as NewsPostRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Новини"
        title="Список новин"
        description="Керуй записами — публікуй, редагуй та видаляй новини центру."
        actions={
          <Link
            href="/admin/news/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600"
          >
            Додати новину
          </Link>
        }
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <AdminNewsClient posts={posts} />
    </AdminAuthGate>
  )
}
