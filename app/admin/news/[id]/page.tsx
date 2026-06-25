import { notFound } from 'next/navigation'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { NewsForm } from '@/components/admin/forms/NewsForm'
import { createClient } from '@/lib/supabase/server'
import type { AnimalWithPhoto, NewsPostRow } from '@/lib/admin-types'

export default async function EditNewsPage(props: PageProps<'/admin/news/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const { data: post, error } = await supabase.from('news_posts').select('*').eq('id', id).single()
  if (error || !post) { notFound() }

  let initialAnimal: AnimalWithPhoto | undefined
  if (post.related_animal_id) {
    const { data } = await supabase
      .from('animals')
      .select('*, animal_photos!inner(public_url)')
      .eq('id', post.related_animal_id)
      .eq('animal_photos.is_main', true)
      .single()
    if (data) {
      initialAnimal = {
        ...data,
        photo_url: (data.animal_photos as Array<{ public_url: string | null }>)?.[0]?.public_url ?? null,
      } as AnimalWithPhoto
    }
  }

  return (
    <AdminAuthGate>
      <NewsForm mode="edit" initial={post as NewsPostRow} initialAnimal={initialAnimal} />
    </AdminAuthGate>
  )
}
