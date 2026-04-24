import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { NewsForm } from '@/components/admin/admin-forms'
import { createClient } from '@/lib/supabase/server'
import type { AnimalRow } from '@/lib/admin-types'

export default async function NewNewsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('animals').select('*').order('name')

  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Новини" title="Додати новину" description="Окрема сторінка створення нового запису." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <NewsForm mode="create" animals={(data ?? []) as AnimalRow[]} />
      </div>
    </AdminAuthGate>
  )
}
