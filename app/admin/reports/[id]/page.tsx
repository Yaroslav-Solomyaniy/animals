import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { ReportForm } from '@/components/admin/forms/ReportForm'
import { createClient } from '@/lib/supabase/server'
import type { ReportRow } from '@/lib/admin-types'

export default async function EditReportPage(props: PageProps<'/admin/reports/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data, error } = await supabase.from('reports').select('*').eq('id', id).single()
  if (error || !data) { notFound() }

  return (
    <AdminAuthGate>
      <ReportForm mode="edit" initial={data as ReportRow} />
    </AdminAuthGate>
  )
}
