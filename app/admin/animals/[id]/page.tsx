import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AnimalEditorPage from '@/components/admin/AnimalEditorPage'
import { createClient } from '@/lib/supabase/server'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'

export default async function EditAnimalPage(props: PageProps<'/admin/animals/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: animal, error } = await supabase
    .from('animals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !animal) {
    notFound()
  }

  const { data: photos } = await supabase
    .from('animal_photos')
    .select('*')
    .eq('animal_id', id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <AdminAuthGate>
      <AnimalEditorPage
        initialAnimal={animal as AnimalRow}
        initialPhotos={(photos ?? []) as AnimalPhotoRow[]}
      />
    </AdminAuthGate>
  )
}
