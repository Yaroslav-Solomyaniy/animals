import Link from 'next/link'
import { FileText, ScrollText } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import { createClient } from '@/lib/supabase/server'
import type { ReportFile, ReportRow } from '@/lib/admin-types'
import { DeleteReportButton } from '@/components/admin/DeleteReportButton'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
  const reports = (data ?? []) as ReportRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Звіти"
        title="Список звітів"
        description="Фінансові звіти, потреби центру та інші документи."
        actions={
          <Link
            href="/admin/reports/new"
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600"
          >
            Додати звіт
          </Link>
        }
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <div className="mt-6">
        <AdminTable columns={['Звіт', 'Період', 'Файлів', 'Статус', 'Дії']}>
          {reports.map((report) => {
            const files = Array.isArray(report.files) ? (report.files as ReportFile[]) : []
            return (
              <AdminTableRow
                key={report.id}
                columns={[
                  <div key="title" className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                      <ScrollText className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-950">{report.title}</p>
                      {report.description && (
                        <p className="max-w-xs truncate text-xs text-slate-500">{report.description}</p>
                      )}
                    </div>
                  </div>,
                  <span key="period" className="text-slate-700">{report.period ?? '—'}</span>,
                  <span key="files" className="flex items-center gap-1.5 text-slate-600">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    {files.length}
                  </span>,
                  <span
                    key="status"
                    className={report.is_published ? 'inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700' : 'inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-500'}
                  >
                    {report.is_published ? 'Опубліковано' : 'Чернетка'}
                  </span>,
                  <div key="actions" className="flex items-center gap-2">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
                    >
                      Редагувати
                    </Link>
                    <DeleteReportButton id={report.id} />
                  </div>,
                ]}
              />
            )
          })}
        </AdminTable>
      </div>
    </AdminAuthGate>
  )
}
