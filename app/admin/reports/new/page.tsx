import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { ReportForm } from '@/components/admin/forms/ReportForm'

export default function NewReportPage() {
  return (
    <AdminAuthGate>
      <ReportForm mode="create" />
    </AdminAuthGate>
  )
}
