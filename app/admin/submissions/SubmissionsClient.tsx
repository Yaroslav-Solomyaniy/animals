'use client'

import React, { useState, useTransition } from 'react'
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { ChevronLeft, ChevronRight, Loader2, Mail, RefreshCw, X } from 'lucide-react'
import type { AnySubmission } from '@/lib/admin-types'
import { resendSubmissionAction } from './actions'

const FILTER_TYPES = ['all', 'contact', 'volunteer', 'service'] as const
type FilterType = typeof FILTER_TYPES[number]

const submissionsParsers = {
  type: parseAsStringLiteral(FILTER_TYPES).withDefault('all'),
  page: parseAsInteger.withDefault(0),
}

const TYPE_LABELS = {
  contact: 'Контактна форма',
  volunteer: 'Волонтер',
  service: 'Замовлення послуги',
} as const

const TYPE_COLORS = {
  contact: 'bg-sky-50 text-sky-700 ring-sky-200',
  volunteer: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  service: 'bg-violet-50 text-violet-700 ring-violet-200',
} as const

const EMAIL_STATUS_COLORS = {
  sent: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-rose-50 text-rose-700',
  not_configured: 'bg-slate-100 text-slate-500',
} as const

const EMAIL_STATUS_LABELS = {
  sent: 'Відправлено',
  failed: 'Помилка',
  not_configured: 'Не налаштовано',
} as const

function getSubmissionDetails(s: AnySubmission) {
  if (s._type === 'contact') {
    const topicLabels: Record<string, string> = {
      adoption: 'Усиновлення', walk: 'Прогулянка',
      services: 'Послуги', other: 'Інше',
    }
    return { name: s.name, phone: s.phone, email: s.email, detail: topicLabels[s.topic] ?? s.topic, extraText: s.message, attachments: s.attachment_urls?.length ?? 0 }
  }
  if (s._type === 'volunteer') {
    return { name: s.name, phone: s.phone, email: s.email, detail: 'Заявка', extraText: null, attachments: 0 }
  }
  return { name: null, phone: s.phone, email: null, detail: s.category, extraText: s.comment, attachments: 0 }
}

type Props = {
  items: AnySubmission[]
  counts: { all: number; contact: number; volunteer: number; service: number }
  type: FilterType
  page: number
  totalPages: number
  total: number
}

export default function SubmissionsClient({ items, counts, type, page, totalPages, total }: Props) {
  const [, setQuery] = useQueryStates(submissionsParsers, { history: 'push', shallow: false })
  const [resending, setResending] = useState<string | null>(null)
  const [resendResult, setResendResult] = useState<Record<string, 'ok' | 'error'>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [resendEmail, setResendEmail] = useState('')
  const [, startTransition] = useTransition()

  function navigate(newType: FilterType, newPage: number) {
    void setQuery({ type: newType, page: newPage })
  }

  function handleResend(s: AnySubmission) {
    setResending(s.id)
    startTransition(async () => {
      const result = await resendSubmissionAction(s._type, s.id, resendEmail || undefined)
      setResendResult((prev) => ({ ...prev, [s.id]: result.ok ? 'ok' : 'error' }))
      setResending(null)
      if (result.ok) window.setTimeout(() => setExpandedId(null), 1500)
    })
  }

  const PAGE_SIZE = 20

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'contact', 'volunteer', 'service'] as const).map((f) => (
          <button
            key={f}
            onClick={() => navigate(f, 0)}
            className={[
              'rounded-xl px-4 py-2 text-sm font-bold transition',
              type === f
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-primary/40',
            ].join(' ')}
          >
            {f === 'all' ? 'Усі' : TYPE_LABELS[f]}{' '}
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${type === f ? 'bg-white/20' : 'bg-slate-100'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-extrabold uppercase tracking-widest text-slate-400">
                <th className="px-5 py-3">Тип</th>
                <th className="px-5 py-3">Заявник / Телефон</th>
                <th className="px-5 py-3">Деталі</th>
                <th className="px-5 py-3">Email статус</th>
                <th className="px-5 py-3">Дата</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">Заявок немає</td>
                </tr>
              )}
              {items.map((s) => {
                const det = getSubmissionDetails(s)
                const isExpanded = expandedId === s.id
                const rResult = resendResult[s.id]

                return (
                  <React.Fragment key={s.id}>
                    <tr className="transition hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ${TYPE_COLORS[s._type]}`}>
                          {TYPE_LABELS[s._type]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {det.name && <p className="font-extrabold text-slate-900">{det.name}</p>}
                        <p className={det.name ? 'text-xs text-slate-500' : 'font-extrabold text-slate-900'}>{det.phone}</p>
                        {det.email && <p className="text-xs text-slate-400">{det.email}</p>}
                      </td>
                      <td className="max-w-xs px-5 py-3.5">
                        <p className="font-semibold text-slate-700">{det.detail}</p>
                        {det.extraText && <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{det.extraText}</p>}
                        {det.attachments > 0 && <p className="mt-0.5 text-xs text-slate-400">📎 {det.attachments} файл(и)</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${EMAIL_STATUS_COLORS[s.email_status]}`}>
                          {EMAIL_STATUS_LABELS[s.email_status]}
                        </span>
                        {s.email_error && (
                          <p className="mt-1 line-clamp-1 text-[11px] text-rose-500" title={s.email_error}>{s.email_error}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-400">
                        {s.created_at ? new Date(s.created_at).toLocaleString('uk-UA') : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-primary/40 hover:text-primary"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${s.id}-expand`} className="bg-orange-50/40">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                            <input
                              type="email"
                              value={resendEmail}
                              onChange={(e) => setResendEmail(e.target.value)}
                              placeholder="Email (залиш пустим для стандартного)"
                              className="min-w-48 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                            />
                            <button
                              type="button"
                              disabled={resending === s.id}
                              onClick={() => handleResend(s)}
                              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-60"
                            >
                              {resending === s.id
                                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Надсилаємо...</>
                                : <><RefreshCw className="h-3.5 w-3.5" /> Відправити</>}
                            </button>
                            {rResult === 'ok' && <span className="text-sm font-bold text-emerald-600">✓ Відправлено</span>}
                            {rResult === 'error' && <span className="text-sm font-bold text-rose-600">✗ Помилка</span>}
                            <button type="button" onClick={() => setExpandedId(null)} className="ml-auto text-slate-400 hover:text-slate-700">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Показано {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} з {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => navigate(type, page - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-slate-500">{page + 1} / {totalPages}</span>
            <button
              type="button"
              disabled={page === totalPages - 1}
              onClick={() => navigate(type, page + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
