import { z } from 'zod'

const emptyStringToNull = (value: unknown) => {
  if (typeof value !== 'string') {return value ?? null}
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

const nullableText = z
  .preprocess(emptyStringToNull, z.string().nullable().optional())
  .transform((value) => value ?? null)
const checkbox = z.preprocess((value) => value === 'on' || value === true, z.boolean())
const adoptionStatus = z
  .preprocess((value) => {
    if (value === 'ready' || value === 'needs_care') {return value}
    return null
  }, z.enum(['ready', 'needs_care']).nullable())
  .default(null)
const textList = z
  .preprocess((value) => {
    if (Array.isArray(value)) {return value}
    if (typeof value !== 'string') {return []}

    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, z.array(z.string()))
  .default([])

// vaccination_count: integer 0-20
const vaccinationCount = z
  .preprocess((value) => {
    if (value === '' || value == null) {return 0}
    const n = Number(value)
    return Number.isFinite(n) ? Math.round(n) : 0
  }, z.number().int().min(0).max(20))
  .default(0)

// character_traits: predefined list, max 5 items
const characterTraits = z
  .preprocess((value) => {
    if (Array.isArray(value)) {return value.filter(Boolean)}
    if (typeof value === 'string' && value.trim()) {
      return value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    return []
  }, z.array(z.string()).max(5))
  .default([])

export const animalSchema = z.object({
  name: z.string().trim().optional().default(''),
  gender: z.enum(['male', 'female']),
  size: z.enum(['small', 'medium', 'large']),
  status: z.enum(['draft', 'available', 'reserved', 'adopted', 'hidden']),
  short_description: nullableText,
  full_story: nullableText,
  public_badges: textList,
  adoption_status: adoptionStatus,
  approximate_age_label: nullableText,
  is_vaccinated: checkbox,
  is_neutered: checkbox,
  published_at: nullableText,
  animal_number: nullableText,
  color: nullableText,
  vaccination_count: vaccinationCount,
  character_traits: characterTraits,
})

export type AnimalFormValue = z.infer<typeof animalSchema>

export const volunteerFormSchema = z.object({
  name: z.string().trim().min(2, 'Вкажіть імʼя'),
  phone: z
    .string()
    .trim()
    .regex(/^\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}$/, 'Вкажіть повний український номер'),
  email: z
    .preprocess(emptyStringToNull, z.email('Вкажіть коректний email').nullable().optional())
    .transform((value) => value ?? null),
  animalId: z
    .preprocess(emptyStringToNull, z.string().nullable().optional())
    .transform((value) => value ?? null),
  animalName: z
    .preprocess(emptyStringToNull, z.string().nullable().optional())
    .transform((value) => value ?? null),
})

export type VolunteerFormValue = z.infer<typeof volunteerFormSchema>
