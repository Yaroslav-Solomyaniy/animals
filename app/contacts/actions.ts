'use server'

import { Resend } from 'resend'
import { SITE_CONTACTS } from '@/lib/site-config'
import { createServiceClient } from '@/lib/supabase/service'

export type ContactFormState =
  | { ok: true; message: string }
  | { ok: false; message: string }

type ContactMessage = {
  name: string
  phone: string
  email: string | null
  topic: string
  animal: string | null
  animalName: string | null
  message: string
}

export async function submitContactFormAction(formData: FormData): Promise<ContactFormState> {
  const consent = formData.get('personalDataConsent')

  if (consent !== 'on') {
    return { ok: false, message: 'Потрібна згода на обробку персональних даних.' }
  }

  const contactMessage: ContactMessage = {
    name: getRequiredString(formData, 'name'),
    phone: getRequiredString(formData, 'phone'),
    email: getOptionalString(formData, 'email'),
    topic: getRequiredString(formData, 'topic'),
    animal: getOptionalString(formData, 'animal'),
    animalName: getOptionalString(formData, 'animalName'),
    message: getRequiredString(formData, 'message'),
  }

  const messageRequired = contactMessage.topic !== 'adoption'
  if (!contactMessage.name || !contactMessage.phone || !contactMessage.topic || (messageRequired && !contactMessage.message)) {
    return { ok: false, message: "Заповніть всі обов'язкові поля." }
  }

  // Read file attachments from FormData
  const fileEntries = formData.getAll('attachments')
  const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = []

  for (const entry of fileEntries) {
    if (entry instanceof File && entry.size > 0) {
      const buffer = Buffer.from(await entry.arrayBuffer())
      attachments.push({
        filename: entry.name,
        content: buffer,
        contentType: entry.type || 'application/octet-stream',
      })
    }
  }

  // Save to DB first (so submission is always recorded)
  const supabase = createServiceClient()
  const { data: saved, error: dbError } = await supabase
    .from('contact_submissions')
    .insert({
      name: contactMessage.name,
      phone: contactMessage.phone,
      email: contactMessage.email,
      topic: contactMessage.topic,
      animal_id: contactMessage.animal || null,
      animal_name: contactMessage.animalName,
      message: contactMessage.message || null,
      attachment_urls: attachments.map((a) => a.filename),
      email_status: 'pending',
    })
    .select('id')
    .single()

  if (dbError) {
    console.error('contact_submissions insert error:', dbError.message)
  }

  const result = await sendContactMessageEmail(contactMessage, attachments)

  // Update email_status
  if (saved?.id) {
    await supabase
      .from('contact_submissions')
      .update({ email_status: result.ok ? 'sent' : 'failed', email_error: result.ok ? null : result.message })
      .eq('id', saved.id)
  }

  return result
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getOptionalString(formData: FormData, key: string) {
  const value = getRequiredString(formData, key)
  return value || null
}

async function sendContactMessageEmail(
  value: ContactMessage,
  attachments: Array<{ filename: string; content: Buffer; contentType: string }>,
): Promise<ContactFormState> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return { ok: false, message: 'Форма зібрана, але відправка email ще не налаштована на сервері.' }
  }

  const resend = new Resend(apiKey)
  const to = process.env.CONTACT_FORM_EMAIL_TO ?? process.env.EMAIL_TO ?? SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const topicLabel = getTopicLabel(value.topic)

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Нове звернення з сайту: ${topicLabel}`,
    html: renderContactMessageEmail(value, topicLabel),
    ...(value.email ? { replyTo: value.email } : {}),
    ...(attachments.length > 0 ? { attachments } : {}),
  })

  if (error) {
    return { ok: false, message: 'Не вдалося відправити повідомлення. Спробуйте ще раз або зателефонуйте нам.' }
  }

  return { ok: true, message: 'Повідомлення відправлено!' }
}

function getTopicLabel(topic: string) {
  const labels: Record<string, string> = {
    adoption: 'Усиновлення',
    walk: 'Волонтерська прогулянка',
    services: 'Комерційні послуги',
    other: 'Інше питання',
  }
  return labels[topic] ?? topic
}

function renderContactMessageEmail(value: ContactMessage, topicLabel: string) {
  return `
<div style="background:#f8fafc;padding:36px 18px;font-family:Arial,sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#fb923c,#f97316);padding:28px;color:#ffffff;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#ffedd5;">Контактна форма</p>
      <h1 style="margin:0;font-size:26px;line-height:1.25;">Нове звернення з сайту</h1>
      <p style="margin:10px 0 0;color:#fff7ed;">${escapeHtml(topicLabel)}</p>
    </div>
    <div style="padding:28px;">
      ${renderEmailRow('Тема', topicLabel)}
      ${renderEmailRow("Імʼя", value.name)}
      ${renderEmailRow('Телефон', value.phone)}
      ${renderEmailRow('Email', value.email ?? 'не вказано')}
      ${value.topic === 'adoption' && (value.animalName || value.animal) ? renderEmailRow('Тварина', value.animalName ?? value.animal ?? '') : ''}
      <div style="margin-top:22px;padding:18px;border-radius:18px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:8px;">Повідомлення</div>
        <div style="font-size:15px;line-height:1.7;color:#374151;white-space:pre-line;">${escapeHtml(value.message)}</div>
      </div>
    </div>
  </div>
</div>
`
}

function renderEmailRow(label: string, value: string) {
  return `
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:4px;">${escapeHtml(label)}</div>
      <div style="font-size:16px;font-weight:700;color:#111827;">${escapeHtml(value)}</div>
    </div>
  `
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
