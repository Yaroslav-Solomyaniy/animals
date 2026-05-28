import { Footprints } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import type { VolunteerRequestRow } from '@/lib/admin-types'
import { createClient } from '@/lib/supabase/server'

const statusLabels: Record<VolunteerRequestRow['status'], string> = {
  new: 'Нова',
  contacted: 'Звʼязалися',
  approved: 'Підтверджена',
  rejected: 'Відхилена',
  closed: 'Закрита',
}

const emailStatusLabels: Record<VolunteerRequestRow['email_status'], string> = {
  sent: 'Email відправлено',
  failed: 'Помилка email',
  not_configured: 'Email не налаштовано',
}

export default async function AdminVolunteerRequestsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('volunteer_requests')
    .select('*')
    .order('created_at', { ascending: false })
  const requests = (data ?? []) as VolunteerRequestRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Волонтерство"
        title="Заявки волонтерів"
        description="Контакти людей, які залишили заявку через форму на сайті."
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <div className="mt-6">
        <AdminTable columns={['Заявник', 'Контакти', 'Статус', 'Email', 'Дата']}>
          {requests.map((request) => (
            <AdminTableRow
              key={request.id}
              columns={[
                <div key="name" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <Footprints className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">{request.name}</p>
                    <p className="text-xs text-slate-500">ID: {request.id.slice(0, 8)}</p>
                  </div>
                </div>,
                <div key="contacts" className="space-y-1 text-slate-700">
                  <p>{request.phone}</p>
                  <p className="text-xs text-slate-500">{request.email ?? 'Email не вказано'}</p>
                </div>,
                <span key="status" className="font-semibold text-slate-700">
                  {statusLabels[request.status]}
                </span>,
                <div key="email" className="space-y-1">
                  <p className="font-semibold text-slate-700">{emailStatusLabels[request.email_status]}</p>
                  {request.email_error ? (
                    <p className="line-clamp-2 text-xs text-red-600" title={request.email_error}>
                      {request.email_error}
                    </p>
                  ) : null}
                </div>,
                <span key="date" className="text-slate-500">
                  {request.created_at ? new Date(request.created_at).toLocaleString('uk-UA') : '—'}
                </span>,
              ]}
            />
          ))}
        </AdminTable>
      </div>
    </AdminAuthGate>
  )
}
