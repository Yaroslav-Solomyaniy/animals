import { HandCoins } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminNotice from '@/components/admin/AdminNotice'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import { createClient } from '@/lib/supabase/server'

type DonationStatus = 'created' | 'processing' | 'success' | 'failure' | 'reversed'

const STATUS_LABELS: Record<DonationStatus, string> = {
  created: 'Очікує',
  processing: 'Обробляється',
  success: 'Успішно',
  failure: 'Помилка',
  reversed: 'Повернено',
}

const STATUS_COLORS: Record<DonationStatus, string> = {
  created: 'bg-slate-100 text-slate-600',
  processing: 'bg-sky-50 text-sky-700',
  success: 'bg-emerald-50 text-emerald-700',
  failure: 'bg-rose-50 text-rose-700',
  reversed: 'bg-amber-50 text-amber-700',
}

type DonationRow = {
  id: string
  invoice_id: string
  amount: number
  donor_name: string | null
  donor_comment: string | null
  status: DonationStatus
  created_at: string
  paid_at: string | null
  animal_id: string | null
  animals?: { name: string } | null
}

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const { status: filterStatus } = await searchParams

  const supabase = await createClient()
  let query = supabase
    .from('donations')
    .select('*, animals(name)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus)
  }

  const { data, error } = await query
  const donations = (data ?? []) as DonationRow[]

  const totalSuccess = donations
    .filter((d) => d.status === 'success')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Донати"
        title="Список донатів"
        description={`Усі платежі через Monobank. Статуси оновлюються автоматично через вебхук.`}
      />

      {/* Quick stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Всього донатів', value: donations.length },
          { label: 'Успішних', value: donations.filter((d) => d.status === 'success').length },
          { label: 'Зібрано (грн)', value: `${totalSuccess.toLocaleString('uk-UA')} ₴` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <form method="get" className="mb-4 flex flex-wrap gap-2">
        {(['all', 'created', 'processing', 'success', 'failure', 'reversed'] as const).map((s) => (
          <button
            key={s}
            name="status"
            value={s}
            type="submit"
            className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
              (filterStatus ?? 'all') === s
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200'
            }`}
          >
            {s === 'all' ? 'Всі' : STATUS_LABELS[s as DonationStatus]}
          </button>
        ))}
      </form>

      {error ? <AdminNotice>{error.message}</AdminNotice> : null}

      <AdminTable columns={['Дата', "Донор / Коментар", 'Тварина', 'Сума', 'Статус']}>
        {donations.map((d) => {
          const date = new Date(d.created_at).toLocaleString('uk-UA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          const statusColor = STATUS_COLORS[d.status] ?? 'bg-slate-100 text-slate-600'
          const statusLabel = STATUS_LABELS[d.status] ?? d.status

          return (
            <AdminTableRow
              key={d.id}
              columns={[
                <span key="date" className="whitespace-nowrap text-xs text-slate-500">{date}</span>,

                <div key="donor" className="flex min-w-0 flex-col">
                  <span className="font-semibold text-slate-950 truncate">
                    {d.donor_name || <span className="italic text-slate-400">Анонімно</span>}
                  </span>
                  {d.donor_comment && (
                    <span className="text-xs text-slate-400 truncate max-w-[180px]">{d.donor_comment}</span>
                  )}
                </div>,

                <span key="animal" className="text-slate-700">
                  {d.animals?.name ?? <span className="text-slate-400">—</span>}
                </span>,

                <span key="amount" className="font-extrabold text-slate-950">
                  {d.amount.toLocaleString('uk-UA')} ₴
                </span>,

                <span
                  key="status"
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${statusColor}`}
                >
                  {statusLabel}
                </span>,
              ]}
            />
          )
        })}
      </AdminTable>

      {donations.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 py-12 text-center">
          <HandCoins className="h-12 w-12 text-slate-300" />
          <p className="text-slate-500">Донатів поки немає</p>
        </div>
      )}
    </AdminAuthGate>
  )
}
