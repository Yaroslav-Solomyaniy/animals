import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { NewsForm } from '@/components/admin/forms/NewsForm'
import type { AnimalRow } from '@/lib/admin-types'
import { createClient } from '@/lib/supabase/server'

export default async function NewNewsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('animals').select('*').order('name')

  return (
    <AdminAuthGate>
      <NewsForm mode="create" animals={(data ?? []) as AnimalRow[]} />
    </AdminAuthGate>
  )
}
