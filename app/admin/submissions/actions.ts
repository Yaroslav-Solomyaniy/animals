'use server'

import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/service'
import { SITE_CONTACTS } from '@/lib/site-config'

export type ResendResult = { ok: true } | { ok: false; error: string }

const TOPIC_LABELS: Record<string, string> = {
  adoption: 'Усиновлення',
  walk: 'Волонтерська прогулянка',
  services: 'Комерційні послуги',
  other: 'Інше питання',
}

export async function resendSubmissionAction(
  type: 'contact' | 'volunteer' | 'service',
  id: string,
  overrideEmail?: string,
): Promise<ResendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY не налаштовано' }

  const supabase = createServiceClient()
  const defaultTo =
    process.env.CONTACT_FORM_EMAIL_TO ??
    process.env.VOLUNTEER_REQUEST_EMAIL_TO ??
    process.env.SERVICE_REQUEST_EMAIL_TO ??
    SITE_CONTACTS.email
  const to = overrideEmail || defaultTo
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const resend = new Resend(apiKey)

  if (type === 'contact') {
    const { data } = await supabase.from('contact_submissions').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const topicLabel = TOPIC_LABELS[data.topic] ?? data.topic
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[Повторна] Звернення з сайту: ${topicLabel}`,
      html: renderContactEmail({
        topicLabel,
        name: data.name,
        phone: data.phone,
        email: data.email,
        animalName: data.animal_name,
        message: data.message,
        attachmentNames: data.attachment_urls ?? [],
        isResend: true,
      }),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('contact_submissions').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  if (type === 'volunteer') {
    const { data } = await supabase.from('volunteer_requests').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[Повторна] Заявка волонтера: ${data.name}`,
      html: renderSimpleEmail({
        title: 'Заявка волонтера',
        accentColor: '#10b981',
        rows: [
          { label: "Ім'я", value: data.name },
          { label: 'Телефон', value: data.phone },
          { label: 'Email', value: data.email ?? 'не вказано' },
        ],
        isResend: true,
      }),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('volunteer_requests').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  if (type === 'service') {
    const { data } = await supabase.from('service_requests').select('*').eq('id', id).single()
    if (!data) return { ok: false, error: 'Запис не знайдено' }

    const rows = [
      { label: 'Послуга', value: data.category },
      { label: 'Телефон', value: data.phone },
      ...(data.weight ? [{ label: 'Вага тварини', value: `${data.weight} кг` }] : []),
      ...(data.desired_date ? [{ label: 'Бажана дата', value: data.desired_date }] : []),
    ]

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[Повторна] Замовлення послуги: ${data.category}`,
      html: renderSimpleEmail({
        title: 'Замовлення послуги',
        accentColor: '#7c3aed',
        rows,
        message: data.comment ?? undefined,
        isResend: true,
      }),
    })
    if (error) return { ok: false, error: String(error) }
    await supabase.from('service_requests').update({ email_status: 'sent', email_error: null }).eq('id', id)
    return { ok: true }
  }

  return { ok: false, error: 'Невідомий тип' }
}

// ─── HTML templates ───────────────────────────────────────────────────────────

function renderContactEmail(opts: {
  topicLabel: string
  name: string
  phone: string
  email: string | null
  animalName: string | null
  message: string | null
  attachmentNames: string[]
  isResend?: boolean
}) {
  const rows = [
    renderRow('Тема', opts.topicLabel),
    renderRow("Ім'я", opts.name),
    renderRow('Телефон', opts.phone),
    renderRow('Email', opts.email ?? 'не вказано'),
    ...(opts.animalName ? [renderRow('Тварина', opts.animalName)] : []),
  ].join('')

  const messageBlock = opts.message
    ? `<div style="margin-top:22px;padding:18px;border-radius:18px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:8px;">Повідомлення</div>
        <div style="font-size:15px;line-height:1.7;color:#374151;white-space:pre-line;">${esc(opts.message)}</div>
      </div>`
    : ''

  const filesBlock = opts.attachmentNames.length
    ? `<div style="margin-top:16px;padding:14px 18px;border-radius:14px;background:#fff7ed;border:1px solid #fed7aa;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#f97316;margin-bottom:8px;">Прикріплені файли</div>
        ${opts.attachmentNames.map((n) => `<div style="font-size:13px;color:#374151;">📎 ${esc(n)}</div>`).join('')}
      </div>`
    : ''

  return baseLayout({
    headerColor: '#f97316',
    badge: opts.isResend ? 'Повторна відправка' : 'Контактна форма',
    title: 'Звернення з сайту',
    subtitle: opts.topicLabel,
    body: `${rows}${messageBlock}${filesBlock}`,
  })
}

function renderSimpleEmail(opts: {
  title: string
  accentColor: string
  rows: Array<{ label: string; value: string }>
  message?: string
  isResend?: boolean
}) {
  const rows = opts.rows.map((r) => renderRow(r.label, r.value)).join('')
  const messageBlock = opts.message
    ? `<div style="margin-top:22px;padding:18px;border-radius:18px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:8px;">Коментар</div>
        <div style="font-size:15px;line-height:1.7;color:#374151;white-space:pre-line;">${esc(opts.message)}</div>
      </div>`
    : ''
  return baseLayout({
    headerColor: opts.accentColor,
    badge: opts.isResend ? 'Повторна відправка' : 'Заявка',
    title: opts.title,
    subtitle: '',
    body: `${rows}${messageBlock}`,
  })
}

function baseLayout(opts: { headerColor: string; badge: string; title: string; subtitle: string; body: string }) {
  return `<div style="background:#f8fafc;padding:36px 18px;font-family:Arial,sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:${opts.headerColor};padding:28px;color:#ffffff;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.8;">${esc(opts.badge)}</p>
      <h1 style="margin:0;font-size:26px;line-height:1.25;">${esc(opts.title)}</h1>
      ${opts.subtitle ? `<p style="margin:10px 0 0;opacity:.85;">${esc(opts.subtitle)}</p>` : ''}
    </div>
    <div style="padding:28px;">${opts.body}</div>
  </div>
</div>`
}

function renderRow(label: string, value: string) {
  return `<div style="margin-bottom:14px;">
    <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:4px;">${esc(label)}</div>
    <div style="font-size:16px;font-weight:700;color:#111827;">${esc(value)}</div>
  </div>`
}

function esc(v: string) {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
