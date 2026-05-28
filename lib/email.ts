import { Resend } from 'resend'
import { SITE_CONTACTS } from '@/lib/site-config'
import type { VolunteerFormValue } from '@/lib/admin-schemas'

type EmailSendResult =
  | { ok: true }
  | { ok: false; status: 'failed' | 'not_configured'; error: string }

export async function sendVolunteerRequestEmail(value: VolunteerFormValue): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      ok: false,
      status: 'not_configured',
      error: 'RESEND_API_KEY не веддено ключ',
    }
  }

  const to = process.env.VOLUNTEER_REQUEST_EMAIL_TO ?? process.env.EMAIL_TO ?? SITE_CONTACTS.email
  const from = process.env.EMAIL_FROM ?? 'Shelter <onboarding@resend.dev>'
  const subject = `Нова заявка на волонтерство: ${value.name}`
  const resend = new Resend(apiKey)
  const text = [
    'Нова заявка на волонтерство',
    '',
    `Імʼя: ${value.name}`,
    `Телефон: ${value.phone}`,
    `Email: ${value.email ?? 'не вказано'}`,
  ].join('\n')

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
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    const message = 'message' in error ? error.message : null
    const name = 'name' in error ? error.name : null

    return [name, message]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(': ') || JSON.stringify(error)
  }

  return 'Unknown Resend error'
}

function renderVolunteerEmail(value: VolunteerFormValue) {
  return `
<div style="background:#f3f7f1;padding:40px 20px;font-family:Arial,sans-serif;color:#1f2937;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 18px 45px rgba(31,41,55,0.10);">

    <div style="background:linear-gradient(135deg,#fb923c,#f97316);padding:34px 30px;color:#ffffff;">
      <div style="display:inline-block;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.28);border-radius:999px;padding:7px 12px;font-size:12px;font-weight:bold;letter-spacing:.04em;margin-bottom:16px;">
        🐾 Нова заявка з сайту
      </div>

      <h1 style="margin:0;font-size:27px;line-height:1.25;font-weight:800;">
        Кандидат хоче стати волонтером
      </h1>

      <p style="margin:12px 0 0;font-size:15px;line-height:1.65;color:#fff7ed;">
        На сайті <strong>paws.ck.ua</strong> щойно залишили заявку на волонтерство.
        Можливо, це ще одна добра людина для допомоги хвостикам ❤️
      </p>
    </div>

    <div style="padding:30px;">

      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:22px;">
        <p style="margin:0 0 18px;font-size:13px;color:#9a3412;font-weight:800;text-transform:uppercase;letter-spacing:.09em;">
          Дані кандидата
        </p>

        <div style="margin-bottom:14px;">
          <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:bold;margin-bottom:4px;">Імʼя</div>
          <div style="font-size:17px;font-weight:700;color:#111827;">${escapeHtml(value.name)}</div>
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:bold;margin-bottom:4px;">Телефон</div>
          <a href="tel:${escapeHtml(value.phone)}" style="font-size:16px;font-weight:700;color:#ea580c;text-decoration:none;">${escapeHtml(value.phone)}</a>
        </div>

        <div>
          <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:bold;margin-bottom:4px;">Email</div>
          <a href="mailto:${escapeHtml(value.email ?? '')}" style="font-size:16px;font-weight:700;color:#2563eb;text-decoration:none;">
            ${escapeHtml(value.email ?? 'не вказано')}
          </a>
        </div>
      </div>

      <div style="margin-top:22px;padding:18px 20px;background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb;">
        <p style="margin:0;font-size:15px;line-height:1.65;color:#4b5563;">
          Будь ласка, зв’яжіться з кандидатом найближчим часом, щоб уточнити деталі участі у волонтерстві 🐶🐱
        </p>
      </div>

      <div style="margin-top:24px;">
        <a href="tel:${escapeHtml(value.phone)}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;border-radius:12px;padding:12px 18px;font-size:14px;font-weight:700;margin-right:8px;">
          Подзвонити
        </a>

        <a href="mailto:${escapeHtml(value.email ?? '')}" style="display:inline-block;background:#fff7ed;color:#9a3412;text-decoration:none;border-radius:12px;padding:12px 18px;font-size:14px;font-weight:700;border:1px solid #fed7aa;">
          Написати email
        </a>
      </div>

    </div>

    <div style="padding:22px 30px;background:#fffaf5;border-top:1px solid #ffedd5;">
      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.7;">
        Центр надання допомоги безпритульним тваринам<br />
        <a href="https://paws.ck.ua" style="color:#ea580c;font-weight:700;text-decoration:none;">paws.ck.ua</a>
      </p>
    </div>

  </div>
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
