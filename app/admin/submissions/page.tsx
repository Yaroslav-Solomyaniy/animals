import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { createClient } from '@/lib/supabase/server'
import type { AnySubmission, ContactSubmissionRow, ServiceRequestRow, VolunteerRequestRow } from '@/lib/admin-types'
import SubmissionsClient from './SubmissionsClient'
import { submissionsSearchParamsCache } from './search-params'

const PAGE_SIZE = 20

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const { type, page } = await submissionsSearchParamsCache.parse(searchParams)
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // Fetch counts for tab badges (cheap — count only)
  const [contactCount, volunteerCount, serviceCount] = await Promise.all([
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
    supabase.from('volunteer_requests').select('id', { count: 'exact', head: true }),
    supabase.from('service_requests').select('id', { count: 'exact', head: true }),
  ])

  const counts = {
    contact: contactCount.count ?? 0,
    volunteer: volunteerCount.count ?? 0,
    service: serviceCount.count ?? 0,
    all: (contactCount.count ?? 0) + (volunteerCount.count ?? 0) + (serviceCount.count ?? 0),
  }

  // Fetch only the selected type(s) with pagination
  let items: AnySubmission[] = []
  let total = 0

  if (type === 'contact') {
    const { data, count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    items = ((data ?? []) as ContactSubmissionRow[]).map((r) => ({ _type: 'contact' as const, ...r }))
    total = count ?? 0
  } else if (type === 'volunteer') {
    const { data, count } = await supabase
      .from('volunteer_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    items = ((data ?? []) as VolunteerRequestRow[]).map((r) => ({ _type: 'volunteer' as const, ...r }))
    total = count ?? 0
  } else if (type === 'service') {
    const { data, count } = await supabase
      .from('service_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    items = ((data ?? []) as ServiceRequestRow[]).map((r) => ({ _type: 'service' as const, ...r }))
    total = count ?? 0
  } else {
    // All: fetch one page worth across all 3 tables merged by date
    // Fetch slightly more than needed per table to ensure correct merged ordering
    const [contactRes, volunteerRes, serviceRes] = await Promise.all([
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).range(0, to + PAGE_SIZE),
      supabase.from('volunteer_requests').select('*').order('created_at', { ascending: false }).range(0, to + PAGE_SIZE),
      supabase.from('service_requests').select('*').order('created_at', { ascending: false }).range(0, to + PAGE_SIZE),
    ])
    const merged: AnySubmission[] = [
      ...((contactRes.data ?? []) as ContactSubmissionRow[]).map((r) => ({ _type: 'contact' as const, ...r })),
      ...((volunteerRes.data ?? []) as VolunteerRequestRow[]).map((r) => ({ _type: 'volunteer' as const, ...r })),
      ...((serviceRes.data ?? []) as ServiceRequestRow[]).map((r) => ({ _type: 'service' as const, ...r })),
    ].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())

    total = counts.all
    items = merged.slice(from, from + PAGE_SIZE)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Заявки"
        title="Всі звернення"
        description="Контактні форми, заявки волонтерів та замовлення послуг. Можна повторно відправити будь-яке звернення на потрібну адресу."
      />
      <div className="mt-6">
        <SubmissionsClient
          items={items}
          counts={counts}
          type={type}
          page={page}
          totalPages={totalPages}
          total={total}
        />
      </div>
    </AdminAuthGate>
  )
}
