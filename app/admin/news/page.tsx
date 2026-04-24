import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import { createClient } from '@/lib/supabase/server'
import type { NewsPostRow } from '@/lib/admin-types'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('news_posts').select('*').order('published_at', { ascending: false, nullsFirst: false })
  const posts = (data ?? []) as NewsPostRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Новини"
        title="Список новин"
        description="Таблиця новин з окремими сторінками створення і редагування."
        actions={<Link href="/admin/news/new" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600">Додати новину</Link>}
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <div className="mt-6">
        <AdminTable columns={['Новина', 'Slug', 'Статус', 'Дата', 'Дія']}>
          {posts.map((post) => (
            <AdminTableRow
              key={post.id}
              columns={[
                <div key="title" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <Newspaper className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">{post.title}</p>
                    <p className="text-xs text-slate-500">{post.excerpt ?? 'Без опису'}</p>
                  </div>
                </div>,
                <span key="slug" className="text-slate-700">{post.slug}</span>,
                <span key="status" className="font-semibold text-slate-700">{post.is_published ? 'published' : 'draft'}</span>,
                <span key="date" className="text-slate-500">{post.published_at ? new Date(post.published_at).toLocaleString() : '—'}</span>,
                <div key="action"><Link href={`/admin/news/${post.id}`} className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary">Редагувати</Link></div>,
              ]}
            />
          ))}
        </AdminTable>
      </div>
    </AdminAuthGate>
  )
}
