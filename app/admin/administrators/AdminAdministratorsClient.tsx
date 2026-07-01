'use client'

import { useState } from 'react'
import { Loader2, Mail, Send, Trash2, UserCircle, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { inviteAdminAction, deleteAdminAction } from './actions'
import { Button } from '@/components/ui/Button'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(value))
}

function AdminCard({ user, onDeleted }: { user: User; onDeleted: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const name = user.user_metadata?.name as string | undefined
  const initial = (name ?? user.email ?? 'A')[0].toUpperCase()

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteAdminAction(user.id)
    setDeleting(false)
    if (!result.ok) {
      setError(result.error)
      setConfirmDelete(false)
    } else {
      onDeleted(user.id)
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      {/* Avatar */}
      {user.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url as string}
          alt={name ?? user.email}
          className="h-11 w-11 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-black text-primary">
          {initial}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-slate-950">
          {name ?? <span className="italic text-slate-400">Без імені</span>}
        </p>
        <p className="truncate text-xs font-semibold text-slate-500" title={user.email}>{user.email}</p>
        {user.user_metadata?.position && (
          <p className="mt-0.5 text-xs font-semibold text-primary">{user.user_metadata.position as string}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
          user.confirmed_at ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {user.confirmed_at ? 'Активний' : 'Запрошений'}
        </span>
        <p className="text-[11px] font-semibold text-slate-400">
          {formatDate(user.created_at)}
        </p>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-2">
        {confirmDelete ? (
          <>
            <Button type="button" variant="danger" size="sm" showIcon={false} disabled={deleting} onClick={handleDelete}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {deleting ? 'Видалення...' : 'Підтвердити'}
            </Button>
            <Button type="button" variant="outline" size="sm" showIcon={false} disabled={deleting} onClick={() => setConfirmDelete(false)}>
              <X className="h-4 w-4" />
              Скасувати
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            title="Видалити адміністратора"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  )
}

export default function AdminAdministratorsClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleDeleted(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const result = await inviteAdminAction(email.trim())
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
    } else {
      setSuccess(`Запрошення надіслано на ${email}`)
      setEmail('')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* List */}
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <UserCircle className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-400">Адміністраторів поки немає</p>
          </div>
        ) : (
          users.map((user) => (
            <AdminCard key={user.id} user={user} onDeleted={handleDeleted} />
          ))
        )}
      </div>

      {/* Invite form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Send className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-extrabold text-slate-950">Запросити адміністратора</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          На вказану адресу буде надіслано лист із посиланням для входу. Після переходу за посиланням адміністратор зможе встановити пароль.
        </p>

        <form onSubmit={handleInvite} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {success}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" showIcon={false} disabled={loading} className="w-full rounded-xl">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? 'Надсилаємо...' : 'Надіслати запрошення'}
          </Button>
        </form>
      </div>
    </div>
  )
}
