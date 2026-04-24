import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AnimalForm } from '@/components/admin/admin-forms'
import { createClient } from '@/lib/supabase/server'
import type { AnimalRow } from '@/lib/admin-types'

export default async function EditAnimalPage(props: PageProps<'/admin/animals/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data, error } = await supabase.from('animals').select('*').eq('id', id).single()
  if (error || !data) notFound()

  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Тварини" title={`Редагування: ${(data as AnimalRow).name}`} description="Окрема сторінка редагування тварини." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <AnimalForm mode="edit" initial={data as AnimalRow} />
      </div>
    </AdminAuthGate>
  )
}
