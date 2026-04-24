import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { ReportForm } from '@/components/admin/admin-forms'
import { createClient } from '@/lib/supabase/server'
import type { ReportRow } from '@/lib/admin-types'

export default async function EditReportPage(props: PageProps<'/admin/reports/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data, error } = await supabase.from('reports').select('*').eq('id', id).single()
  if (error || !data) notFound()

  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Звіти" title={`Редагування: ${(data as ReportRow).title}`} description="Окрема сторінка редагування звіту." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <ReportForm mode="edit" initial={data as ReportRow} />
      </div>
    </AdminAuthGate>
  )
}
