'use client'

import { useState } from 'react'
import { submitServiceRequestAction } from '@/app/services/actions'
import { createVolunteerRequestAction } from '@/app/volunteer/actions'

type Status = 'idle' | 'loading' | 'ok' | 'error'

export default function DevTestButtons() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({})

  if (process.env.NODE_ENV !== 'development') return null

  const set = (key: string, val: Status) =>
    setStatuses((s) => ({ ...s, [key]: val }))

  async function testService() {
    set('service', 'loading')
    const fd = new FormData()
    fd.set('category', 'Прийом, терапія та діагностика')
    fd.set('phone', '+380 (93) 216-62-78')
    fd.set('weight', '12')
    fd.set('desired_date', '2026-07-01')
    fd.set('comment', 'Тестовий коментар')
    const res = await submitServiceRequestAction(fd)
    set('service', res.ok ? 'ok' : 'error')
  }

  async function testVolunteer() {
    set('volunteer', 'loading')
    const fd = new FormData()
    fd.set('name', 'Ярослав Тест')
    fd.set('phone', '+380 (93) 216-62-78')
    fd.set('email', 'test@test.com')
    const res = await createVolunteerRequestAction(undefined, fd)
    set('volunteer', res?.modalId ? 'ok' : 'error')
  }

  const btn = (key: string, label: string, action: () => void) => {
    const s = statuses[key] ?? 'idle'
    const colors: Record<Status, string> = {
      idle: '#334155',
      loading: '#6366f1',
      ok: '#16a34a',
      error: '#dc2626',
    }
    const icons: Record<Status, string> = { idle: '▶', loading: '…', ok: '✓', error: '✗' }
    return (
      <button
        key={key}
        onClick={action}
        disabled={s === 'loading'}
        style={{
          background: colors[s],
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          opacity: s === 'loading' ? 0.7 : 1,
        }}
      >
        <span>{icons[s]}</span> {label}
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        background: '#0f172a',
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,.4)',
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '.1em', marginBottom: 2 }}>
        DEV · TEST EMAILS
      </div>
      {btn('service',   '🩺 Замовлення послуги', testService)}
      {btn('volunteer', '🐾 Волонтерська заявка', testVolunteer)}
    </div>
  )
}
