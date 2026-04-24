import Link from 'next/link'
import { ScrollText } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import { createClient } from '@/lib/supabase/server'
import type { ReportRow } from '@/lib/admin-types'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('reports').select('*').order('year', { ascending: false, nullsFirst: false })
  const reports = (data ?? []) as ReportRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Звіти"
        title="Список звітів"
        description="Таблиця звітів з окремими сторінками створення і редагування."
        actions={<Link href="/admin/reports/new" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600">Додати звіт</Link>}
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <div className="mt-6">
        <AdminTable columns={['Звіт', 'Період', 'Статус', 'Файл', 'Дія']}>
          {reports.map((report) => (
            <AdminTableRow
              key={report.id}
              columns={[
                <div key="title" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <ScrollText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">{report.title}</p>
                    <p className="text-xs text-slate-500">{report.summary ?? 'Без summary'}</p>
                  </div>
                </div>,
                <span key="period" className="text-slate-700">{[report.month, report.year].filter(Boolean).join(' ') || '—'}</span>,
                <span key="status" className="font-semibold text-slate-700">{report.is_published ? 'published' : 'draft'}</span>,
                <span key="file" className="text-slate-500">{report.file_url ?? report.file_r2_key ?? '—'}</span>,
                <div key="action"><Link href={`/admin/reports/${report.id}`} className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary">Редагувати</Link></div>,
              ]}
            />
          ))}
        </AdminTable>
      </div>
    </AdminAuthGate>
  )
}
