import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { ReportForm } from '@/components/admin/admin-forms'

export default function NewReportPage() {
  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Звіти" title="Додати звіт" description="Окрема сторінка створення нового запису." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <ReportForm mode="create" />
      </div>
    </AdminAuthGate>
  )
}
