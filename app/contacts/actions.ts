'use server'

import { Resend } from 'resend'
import {
  createContactAttachmentKey,
  createR2PresignedPutUrl,
  getPublicFilesBucketConfig,
  getR2PublicUrl,
} from '@/lib/r2'
import { SITE_CONTACTS } from '@/lib/site-config'
import { createClient } from '@/lib/supabase/server'

type UploadRequest = {
  fileName: string
  contentType: string
}

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
  attachmentUrls: string[]
}

export async function createContactAttachmentUploadAction(request: UploadRequest) {
  const allowedTypes = [
    'image/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const contentType = request.contentType || 'application/octet-stream'

  if (!allowedTypes.some((type) => contentType.startsWith(type) || contentType === type)) {
    return { ok: false as const, error: 'Можна завантажити фото, PDF або документ Word.' }
  }

  const bucket = getPublicFilesBucketConfig()
  const r2Key = createContactAttachmentKey(request.fileName)

  return {
    ok: true as const,
    uploadUrl: createR2PresignedPutUrl({ bucket: bucket.bucket, key: r2Key }),
    r2Key,
    publicUrl: getR2PublicUrl(bucket, r2Key),
  }
}

export async function submitContactFormAction(formData: FormData): Promise<ContactFormState> {
  const consent = formData.get('personalDataConsent')

  if (consent !== 'on') {
    return {
      ok: false,
      message: 'Потрібна згода на обробку персональних даних.',
    }
  }

  const attachmentUrls = formData.getAll('attachmentUrls').filter((value): value is string => typeof value === 'string')
  const attachmentsJson = JSON.stringify(attachmentUrls)

  formData.set('attachmentsJson', attachmentsJson)

  const contactMessage: ContactMessage = {
    name: getRequiredString(formData, 'name'),
    phone: getRequiredString(formData, 'phone'),
    email: getOptionalString(formData, 'email'),
    topic: getRequiredString(formData, 'topic'),
    animal: getOptionalString(formData, 'animal'),
    animalName: getOptionalString(formData, 'animalName'),
    message: getRequiredString(formData, 'message'),
    attachmentUrls,
  }

  if (!contactMessage.name || !contactMessage.phone || !contactMessage.topic || !contactMessage.message) {
    return {
      ok: false,
      message: 'Заповніть імʼя, телефон, тему та повідомлення.',
    }
  }

  const emailResult = await sendContactMessageEmail(contactMessage)

  // Always save to DB regardless of email result
  const supabase = await createClient()
  await supabase.from('contact_submissions').insert({
    name: contactMessage.name,
    phone: contactMessage.phone,
    email: contactMessage.email,
    topic: contactMessage.topic,
    animal_id: contactMessage.animal,
    animal_name: contactMessage.animalName,
    message: contactMessage.message,
    attachment_urls: contactMessage.attachmentUrls,
    email_status: emailResult.ok ? 'sent' : emailResult.status,
    email_error: emailResult.ok ? null : emailResult.error,
  })

  if (!emailResult.ok) {
    return {
      ok: false,
      message: emailResult.status === 'not_configured'
        ? 'Форма зібрана, але відправка email ще не налаштована на сервері.'
        : 'Не вдалося відправити повідомлення. Спробуйте ще раз або зателефонуйте нам.',
    }
  }

  return {
    ok: true,
    message: 'Повідомлення відправлено. Файли завантажені й додані до звернення.',
  }
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function getOptionalString(formData: FormData, key: string) {
  const value = getRequiredString(formData, key)
  return value || null
}

async function sendContactMessageEmail(value: ContactMessage): Promise<
  | { ok: true }
  | { ok: false; status: 'failed' | 'not_configured'; error: string }
> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      ok: false,
      status: 'not_configured',
      error: 'RESEND_API_KEY is not configured',
    }
  }

  const resend = new Resend(apiKey)
  const to = process.env.CONTACT_FORM_EMAIL_TO ?? process.env.EMAIL_TO ?? SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const topicLabel = getTopicLabel(value.topic)
  const subject = `Нове звернення з сайту: ${topicLabel}`
  const attachmentsText = value.attachmentUrls.length
    ? value.attachmentUrls.map((url) => `- ${url}`).join('\n')
    : 'Файлів немає'

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: [
      'Нове звернення з контактної форми',
      '',
      `Тема: ${topicLabel}`,
      `Імʼя: ${value.name}`,
      `Телефон: ${value.phone}`,
      `Email: ${value.email ?? 'не вказано'}`,
      `Тварина: ${value.animalName ?? value.animal ?? 'не обрано'}`,
      '',
      'Повідомлення:',
      value.message,
      '',
      'Файли:',
      attachmentsText,
    ].join('\n'),
    html: renderContactMessageEmail(value, topicLabel),
    ...(value.email ? { replyTo: value.email } : {}),
  })

  if (error) {
    return {
      ok: false,
      status: 'failed',
      error: formatEmailError(error),
    }
  }

  return { ok: true }
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
  const attachmentLinks = value.attachmentUrls.length
    ? value.attachmentUrls
        .map((url) => `<li><a href="${escapeHtml(url)}" style="color:#ea580c;font-weight:700;">${escapeHtml(url)}</a></li>`)
        .join('')
    : '<li>Файлів немає</li>'

  return `
<div style="background:#f8fafc;padding:36px 18px;font-family:Arial,sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#fb923c,#f97316);padding:28px;color:#ffffff;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#ffedd5;">Контактна форма</p>
      <h1 style="margin:0;font-size:26px;line-height:1.25;">Нове звернення з сайту</h1>
      <p style="margin:10px 0 0;color:#fff7ed;">${escapeHtml(topicLabel)}</p>
    </div>
    <div style="padding:28px;">
      ${renderEmailRow('Імʼя', value.name)}
      ${renderEmailRow('Телефон', value.phone)}
      ${renderEmailRow('Email', value.email ?? 'не вказано')}
      ${renderEmailRow('Тварина', value.animalName ?? value.animal ?? 'не обрано')}
      <div style="margin-top:22px;padding:18px;border-radius:18px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:8px;">Повідомлення</div>
        <div style="font-size:15px;line-height:1.7;color:#374151;white-space:pre-line;">${escapeHtml(value.message)}</div>
      </div>
      <div style="margin-top:22px;padding:18px;border-radius:18px;background:#fff7ed;border:1px solid #fed7aa;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9a3412;margin-bottom:8px;">Файли</div>
        <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#374151;">${attachmentLinks}</ul>
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

function formatEmailError(error: unknown) {
  if (typeof error === 'string') {return error}
  if (error && typeof error === 'object') {
    const message = 'message' in error ? error.message : null
    const name = 'name' in error ? error.name : null

    return [name, message]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(': ') || JSON.stringify(error)
  }

  return 'Unknown Resend error'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
