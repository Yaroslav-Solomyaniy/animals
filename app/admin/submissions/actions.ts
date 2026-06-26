'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { SITE_CONTACTS } from '@/lib/site-config'

export type ResendResult = { ok: true } | { ok: false; error: string }

export async function resendSubmissionAction(
  type: 'contact' | 'volunteer' | 'service',
  id: string,
  overrideEmail?: string,
): Promise<ResendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY не налаштовано' }

  const supabase = await createClient()
  const to = overrideEmail || process.env.EMAIL_TO || SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const resend = new Resend(apiKey)

  if (type === 'contact') {
    const { data } = await supabase.from('contact_submissions').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const topicLabels: Record<string, string> = {
      adoption: 'Усиновлення', walk: 'Волонтерська прогулянка',
      services: 'Комерційні послуги', other: 'Інше питання',
    }
    const topicLabel = topicLabels[data.topic] ?? data.topic
    const { error } = await resend.emails.send({
      from, to: [to],
      subject: `[Повторна] Звернення з сайту: ${topicLabel}`,
      text: [
        `Тема: ${topicLabel}`, `Ім'я: ${data.name}`, `Телефон: ${data.phone}`,
        `Email: ${data.email ?? 'не вказано'}`, `Тварина: ${data.animal_name ?? 'не обрано'}`,
        '', 'Повідомлення:', data.message ?? '',
        '', 'Файли:', ...(data.attachment_urls ?? []),
      ].join('\n'),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('contact_submissions').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  if (type === 'volunteer') {
    const { data } = await supabase.from('volunteer_requests').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const { error } = await resend.emails.send({
      from, to: [to],
      subject: `[Повторна] Заявка волонтера: ${data.name}`,
      text: [`Ім'я: ${data.name}`, `Телефон: ${data.phone}`, `Email: ${data.email ?? 'не вказано'}`].join('\n'),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('volunteer_requests').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  if (type === 'service') {
    const { data } = await supabase.from('service_requests').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const { error } = await resend.emails.send({
      from, to: [to],
      subject: `[Повторна] Замовлення послуги: ${data.category}`,
      text: [
        `Послуга: ${data.category}`, `Телефон: ${data.phone}`,
        data.weight ? `Вага: ${data.weight} кг` : null,
        data.desired_date ? `Дата: ${data.desired_date}` : null,
        data.comment ? `Коментар: ${data.comment}` : null,
      ].filter(Boolean).join('\n'),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('service_requests').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  return { ok: false, error: 'Невідомий тип' }
}
