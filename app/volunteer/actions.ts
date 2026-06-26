'use server'

import type { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { revalidatePath } from 'next/cache'
import { volunteerFormSchema } from '@/lib/admin-schemas'
import { sendVolunteerRequestEmail } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export type VolunteerRequestActionResult =
  | (SubmissionResult<string[]> & {
      message?: string
      emailSent?: boolean
      modalId?: string
    })
  | undefined

export async function createVolunteerRequestAction(
  _prevState: VolunteerRequestActionResult,
  formData: FormData
): Promise<VolunteerRequestActionResult> {
  const submission = parseWithZod(formData, {
    schema: volunteerFormSchema,
    disableAutoCoercion: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const emailResult = await sendVolunteerRequestEmail(submission.value)
  const supabase = await createClient()
  const { error } = await supabase
    .from('volunteer_requests')
    .insert({
      name: submission.value.name,
      phone: submission.value.phone,
      email: submission.value.email,
      animal_id: submission.value.animalId ?? null,
      animal_name: submission.value.animalName ?? null,
      email_status: emailResult.ok ? 'sent' : emailResult.status,
      email_error: emailResult.ok ? null : emailResult.error,
    })

  if (error) {
    return submission.reply({
      formErrors: ['Не вдалося зберегти заявку. Спробуйте ще раз або зателефонуйте нам.'],
    })
  }

  revalidatePath('/admin/volunteer-requests')

  return {
    ...submission.reply({ resetForm: true }),
    emailSent: emailResult.ok,
    modalId: crypto.randomUUID(),
    message: emailResult.ok
      ? 'Дякуємо! Заявку відправлено, ми звʼяжемося з вами.'
      : 'Заявку збережено, але email поки не відправився. Адміністратор побачить її в адмінці.',
  }
}
