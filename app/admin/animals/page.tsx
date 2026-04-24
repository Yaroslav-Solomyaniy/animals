import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminNotice from '@/components/admin/AdminNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminTable, AdminTableRow } from '@/components/admin/AdminTable'
import { createClient } from '@/lib/supabase/server'
import type { AnimalRow } from '@/lib/admin-types'

export default async function AdminAnimalsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('animals').select('*').order('updated_at', { ascending: false })
  const animals = (data ?? []) as AnimalRow[]

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Тварини"
        title="Каталог тварин"
        description="Табличний список записів з окремою сторінкою створення і окремою сторінкою редагування."
        actions={<Link href="/admin/animals/new" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-600">Додати тварину</Link>}
      />
      {error ? <AdminNotice>{error.message}</AdminNotice> : null}
      <div className="mt-6">
        <AdminTable columns={['Тварина', 'Тип', 'Статус', 'Оновлено', 'Дія']}>
          {animals.map((animal) => (
            <AdminTableRow
              key={animal.id}
              columns={[
                <div key="name" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <PawPrint className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-950">{animal.name}</p>
                    <p className="text-xs text-slate-500">{animal.slug}</p>
                  </div>
                </div>,
                <span key="species" className="font-semibold text-slate-700">{animal.species}</span>,
                <span key="status" className="font-semibold text-slate-700">{animal.status}</span>,
                <span key="updated" className="text-slate-500">{animal.updated_at ? new Date(animal.updated_at).toLocaleString() : '—'}</span>,
                <div key="action"><Link href={`/admin/animals/${animal.id}`} className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary">Редагувати</Link></div>,
              ]}
            />
          ))}
        </AdminTable>
      </div>
    </AdminAuthGate>
  )
}
