'use server'

import type { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { animalSchema, type AnimalFormValue } from '@/lib/admin-schemas'
import { createClient } from '@/lib/supabase/server'

export type AnimalActionResult = SubmissionResult<string[]> | undefined

const UNNAMED_ANIMAL_NAME = "Ім'я відсутнє"

export async function createAnimalAction(
  _prevState: AnimalActionResult,
  formData: FormData
): Promise<AnimalActionResult> {
  const submission = parseWithZod(formData, { schema: animalSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const supabase = await createClient()
  const authResult = await supabase.auth.getUser()

  if (authResult.error || !authResult.data.user) {
    return submission.reply({ formErrors: ['You must be signed in to save animals.'] })
  }

  const name = getAnimalDisplayName(submission.value.name)
  const slug = await getUniqueAnimalSlug(supabase, name)
  const result = await supabase
    .from('animals')
    .insert(toAnimalPayload(submission.value, slug, name))
    .select('id')
    .single()

  if (result.error) {
    return submission.reply({ formErrors: [result.error.message] })
  }

  revalidatePath('/admin/animals')
  redirect(`/admin/animals/${result.data.id}`)
}

export async function updateAnimalAction(
  id: string,
  _prevState: AnimalActionResult,
  formData: FormData
): Promise<AnimalActionResult> {
  const submission = parseWithZod(formData, { schema: animalSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const supabase = await createClient()
  const authResult = await supabase.auth.getUser()

  if (authResult.error || !authResult.data.user) {
    return submission.reply({ formErrors: ['You must be signed in to save animals.'] })
  }

  const name = getAnimalDisplayName(submission.value.name)
  const slug = await getUniqueAnimalSlug(supabase, name, id)
  const result = await supabase
    .from('animals')
    .update(toAnimalPayload(submission.value, slug, name))
    .eq('id', id)
    .select('id')
    .single()

  if (result.error) {
    return submission.reply({ formErrors: [result.error.message] })
  }

  revalidatePath('/admin/animals')
  revalidatePath(`/admin/animals/${id}`)
  revalidatePath('/animals')
  revalidatePath(`/animals/${slug}`)
  redirect(`/admin/animals/${id}`)
}

export async function createAnimalDraftAction(formData: FormData) {
  const submission = parseWithZod(formData, { schema: animalSchema })

  if (submission.status !== 'success') {
    return { ok: false as const, error: 'Перевір поля форми.' }
  }

  const supabase = await createClient()
  const authResult = await supabase.auth.getUser()

  if (authResult.error || !authResult.data.user) {
    return { ok: false as const, error: 'Потрібна авторизація.' }
  }

  const name = getAnimalDisplayName(submission.value.name)
  const slug = await getUniqueAnimalSlug(supabase, name)
  const result = await supabase
    .from('animals')
    .insert({
      ...toAnimalPayload(submission.value, slug, name),
      status: 'draft',
      published_at: null,
    })
    .select('id, name')
    .single()

  if (result.error) {
    return { ok: false as const, error: result.error.message }
  }

  revalidatePath('/admin/animals')
  return { ok: true as const, animal: result.data }
}

export async function updateAnimalDraftAction(id: string, formData: FormData) {
  const submission = parseWithZod(formData, { schema: animalSchema })

  if (submission.status !== 'success') {
    return { ok: false as const, error: 'Перевір поля форми.' }
  }

  const supabase = await createClient()
  const authResult = await supabase.auth.getUser()

  if (authResult.error || !authResult.data.user) {
    return { ok: false as const, error: 'Потрібна авторизація.' }
  }

  const name = getAnimalDisplayName(submission.value.name)
  const slug = await getUniqueAnimalSlug(supabase, name, id)
  const result = await supabase
    .from('animals')
    .update(toAnimalPayload(submission.value, slug, name))
    .eq('id', id)
    .select('id, name')
    .single()

  if (result.error) {
    return { ok: false as const, error: result.error.message }
  }

  revalidatePath('/admin/animals')
  revalidatePath(`/admin/animals/${id}`)
  revalidatePath('/animals')
  revalidatePath(`/animals/${slug}`)
  return { ok: true as const, animal: result.data }
}

const publishAnimalSchema = z.object({
  animalId: z.string().uuid(),
})

export async function publishAnimalAction(formData: FormData) {
  const parsed = publishAnimalSchema.safeParse({
    animalId: formData.get('animalId'),
  })

  if (!parsed.success) {
    return { ok: false as const, error: 'Некоректний ID тварини.' }
  }

  const supabase = await createClient()
  const authResult = await supabase.auth.getUser()

  if (authResult.error || !authResult.data.user) {
    return { ok: false as const, error: 'Потрібна авторизація.' }
  }

  const { data: mainPhoto, error: photoError } = await supabase
    .from('animal_photos')
    .select('id')
    .eq('animal_id', parsed.data.animalId)
    .eq('is_main', true)
    .maybeSingle()

  if (photoError) {
    return { ok: false as const, error: photoError.message }
  }

  if (!mainPhoto) {
    return { ok: false as const, error: 'Перед публікацією обери головне фото.' }
  }

  const result = await supabase
    .from('animals')
    .update({
      status: 'available',
      published_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.animalId)
    .select('slug')
    .single()

  if (result.error) {
    return { ok: false as const, error: result.error.message }
  }

  revalidatePath('/admin/animals')
  revalidatePath(`/admin/animals/${parsed.data.animalId}`)
  revalidatePath('/animals')
  revalidatePath(`/animals/${result.data.slug}`)
  return { ok: true as const }
}

function toAnimalPayload(value: AnimalFormValue, slug: string, name = getAnimalDisplayName(value.name)) {
  return {
    slug,
    name,
    gender: value.gender,
    size: value.size,
    status: value.status,
    short_description: value.short_description,
    full_story: value.full_story,
    public_badges: value.public_badges,
    adoption_status: value.adoption_status,
    approximate_age_label: value.approximate_age_label,
    is_vaccinated: value.is_vaccinated,
    is_neutered: value.is_neutered,
    published_at: value.published_at,
  }
}

function getAnimalDisplayName(value: string | null | undefined) {
  const name = value?.trim()
  return name || UNNAMED_ANIMAL_NAME
}

async function getUniqueAnimalSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
  currentId?: string
) {
  const baseSlug = slugifyAnimalName(name)
  const { data } = await supabase
    .from('animals')
    .select('id, slug')
    .ilike('slug', `${baseSlug}%`)

  const used = new Set(
    (data ?? [])
      .filter((animal) => animal.id !== currentId)
      .map((animal) => animal.slug)
  )

  if (!used.has(baseSlug)) return baseSlug

  let index = 2
  while (used.has(`${baseSlug}-${index}`)) index += 1
  return `${baseSlug}-${index}`
}

function slugifyAnimalName(value: string) {
  const transliterated = value
    .trim()
    .toLowerCase()
    .replace(/[а-яіїєґ]/g, (letter) => transliteration[letter] ?? letter)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return transliterated || `animal-${Date.now()}`
}

const transliteration: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ie',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'iu',
  я: 'ia',
}
