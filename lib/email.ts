import {Resend} from 'resend'
import {SITE_CONTACTS} from '@/lib/site-config'
import type {VolunteerFormValue} from '@/lib/admin-schemas'

type EmailSendResult = { ok: true } | { ok: false; status: 'failed' | 'not_configured'; error: string }

export async function sendVolunteerRequestEmail(value: VolunteerFormValue): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      ok: false,
      status: 'not_configured',
      error: 'RESEND_API_KEY not set',
    }
  }

  const to = process.env.VOLUNTEER_REQUEST_EMAIL_TO ?? process.env.EMAIL_TO ?? SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const subject = `${value.name} залишив(-ла) заявку на прогулянку`
  const resend = new Resend(apiKey)
  const text = [
    subject,
    '',
    `Імʼя: ${value.name}`,
    `Телефон: ${value.phone}`,
    `Email: ${value.email ?? 'не вказано'}`,
    value.animalName ? `Тварина: ${value.animalName}` : null,
    value.animalId ? `Посилання: https://paws.ck.ua/animals/${value.animalId}` : null,
  ].filter(Boolean).join('\n')

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
    html: renderVolunteerEmail(value),
    ...(value.email ? { replyTo: value.email } : {}),
  })

  if (error) {
    return {
      ok: false,
      status: 'failed',
      error: formatResendError(error),
    }
  }

  return { ok: true }
}

function formatResendError(error: unknown) {
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    const message = 'message' in error ? error.message : null
    const name = 'name' in error ? error.name : null

    return (
      [name, message].filter((value): value is string => typeof value === 'string' && value.length > 0).join(': ') || JSON.stringify(error)
    )
  }

  return 'Unknown Resend error'
}

function renderVolunteerEmail(value: VolunteerFormValue) {
  const animalUrl = value.animalId ? `https://paws.ck.ua/animals/${value.animalId}` : null
  const rows: EmailRow[] = [
    { label: "Імʼя",    val: value.name },
    { label: "Телефон", val: value.phone },
    ...(value.email ? [{ label: "Email", val: value.email }] : []),
    ...(value.animalName ? [{ label: "Тварина", val: value.animalName, link: animalUrl ?? undefined }] : []),
  ]
  return renderEmailShell({
    gradient: 'linear-gradient(135deg,#059669 0%,#10b981 55%,#34d399 100%)',
    title: "Нова заявка на прогулянку",
    subtitle: `${value.name} залишив(-ла) заявку через форму на сайті.`,
    rows,
  })
}

type ServiceRequestEmailValue = {
  category: string
  phone: string
  weight?: string
  desired_date?: string
  comment?: string
}

export async function sendServiceRequestEmail(value: ServiceRequestEmailValue): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, status: 'not_configured', error: 'RESEND_API_KEY not set' }

  const resend = new Resend(apiKey)
  const to = process.env.SERVICE_REQUEST_EMAIL_TO ?? process.env.EMAIL_TO ?? SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const subject = `Замовлення послуги: ${value.category}`

  const rows = [
    `Послуга: ${value.category}`,
    `Телефон: ${value.phone}`,
    value.weight ? `Вага тварини: ${value.weight} кг` : null,
    value.desired_date ? `Бажана дата: ${value.desired_date}` : null,
    value.comment ? `Коментар: ${value.comment}` : null,
  ].filter(Boolean).join('\n')

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text: `Нове замовлення послуги з сайту\n\n${rows}`,
    html: renderServiceRequestEmail(value),
  })

  if (error) return { ok: false, status: 'failed', error: formatResendError(error) }
  return { ok: true }
}

function renderServiceRequestEmail(value: ServiceRequestEmailValue) {
  const rows: EmailRow[] = [
    { label: 'Послуга',      val: value.category },
    { label: 'Телефон',      val: value.phone },
    ...(value.weight       ? [{ label: 'Вага тварини', val: `${value.weight} кг` }]  : []),
    ...(value.desired_date ? [{ label: 'Бажана дата',  val: value.desired_date }]    : []),
    ...(value.comment      ? [{ label: 'Коментар',     val: value.comment }]         : []),
  ]
  return renderEmailShell({
    badge: 'Замовлення послуги',
    title: 'Нове замовлення послуги',
    subtitle: 'Клієнт залишив заявку через форму на сайті.',
    rows,
  })
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

type EmailRow = { label: string; val: string; link?: string }

type EmailShellOptions = {
  title: string
  subtitle: string
  badge?: string
  gradient?: string
  rows: EmailRow[]
}

function renderEmailShell({ title, subtitle, badge, gradient, rows }: EmailShellOptions): string {
  const now = new Date().toLocaleString('uk-UA', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  })

  const rowsHtml = rows.map(({ label, val, link }, i) => [
    '<tr><td style="padding:0;">',
    i > 0 ? '<div style="height:1px;background:#f3f4f6;margin-bottom:18px;"></div>' : '',
    '<div style="margin-bottom:18px;">',
    `<div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">${escapeHtml(label)}</div>`,
    link
      ? `<a href="${escapeHtml(link)}" style="font-size:16px;font-weight:700;color:#059669;text-decoration:none;line-height:1.45;word-break:break-word;">${escapeHtml(val)} &rarr;</a>`
      : `<div style="font-size:16px;font-weight:600;color:#111827;line-height:1.45;word-break:break-word;">${escapeHtml(val)}</div>`,
    '</div></td></tr>',
  ].join('')).join('')

  const headerBg = gradient ?? 'linear-gradient(135deg,#ea580c 0%,#f97316 55%,#fb923c 100%)'
  const badgeHtml = badge
    ? `<div style="display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 14px;font-size:11px;font-weight:800;color:rgba(255,255,255,.85);letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px;">${escapeHtml(badge)}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">

  <tr><td style="padding-bottom:20px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-size:14px;font-weight:700;color:#374151;">
        🐾 <span style="vertical-align:middle;">paws.ck.ua</span>
      </td>
      <td align="right" style="font-size:12px;color:#9ca3af;">${escapeHtml(now)}</td>
    </tr></table>
  </td></tr>

  <tr><td style="background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 2px 16px rgba(0,0,0,.06);">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">

      <tr><td style="background:${headerBg};padding:32px 36px;">
        ${badgeHtml}
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">${escapeHtml(title)}</h1>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,.75);line-height:1.6;">${escapeHtml(subtitle)}</p>
      </td></tr>

      <tr><td style="padding:32px 36px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rowsHtml}
        </table>
      </td></tr>

      <tr><td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:18px 36px;">
        <span style="font-size:12px;color:#9ca3af;">
          Автоматичний лист із форми на сайті &nbsp;&middot;&nbsp;
          <a href="https://paws.ck.ua" style="color:#f97316;text-decoration:none;font-weight:600;">paws.ck.ua</a>
        </span>
      </td></tr>

    </table>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`
}
