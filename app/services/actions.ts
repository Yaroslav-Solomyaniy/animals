'use server'

import { createClient } from '@/lib/supabase/server'
import { sendServiceRequestEmail } from '@/lib/email'

export type ServiceRequestState =
  | { ok: true; message: string }
  | { ok: false; message: string }

export async function submitServiceRequestAction(formData: FormData): Promise<ServiceRequestState> {
  const category = formData.get('category')?.toString().trim() ?? ''
  const phone = formData.get('phone')?.toString().trim() ?? ''
  const weight = formData.get('weight')?.toString().trim() || null
  const desired_date = formData.get('desired_date')?.toString().trim() || null
  const comment = formData.get('comment')?.toString().trim() || null

  if (!category || !phone) {
    return { ok: false, message: 'Вкажіть послугу та телефон.' }
  }

  const emailResult = await sendServiceRequestEmail({ category, phone, weight: weight ?? undefined, desired_date: desired_date ?? undefined, comment: comment ?? undefined })

  const supabase = await createClient()
  await supabase.from('service_requests').insert({
    category,
    phone,
    weight,
    desired_date,
    comment,
    email_status: emailResult.ok ? 'sent' : emailResult.status,
    email_error: emailResult.ok ? null : emailResult.error,
  })

  if (!emailResult.ok) {
    return {
      ok: false,
      message: emailResult.status === 'not_configured'
        ? 'Заявку збережено, але email ще не налаштовано.'
        : 'Не вдалося відправити. Спробуйте ще раз або зателефонуйте нам.',
    }
  }

  return { ok: true, message: 'Заявку відправлено! Ми зв\'яжемось з вами найближчим часом.' }
}
