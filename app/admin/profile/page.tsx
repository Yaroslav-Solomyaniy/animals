'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, Loader2, Lock, Mail, Phone, Save, UserCircle } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/Button'
import { updateProfileAction, changePasswordAction, getAvatarUploadUrlAction, saveAvatarUrlAction } from './actions'

function Section({ title, description, className, children }: { title: string; description?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm${className ? ` ${className}` : ''}`}>
      <h2 className="text-base font-extrabold text-slate-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}

function InputField({ label, icon: Icon, ...props }: { label: string; icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          {...props}
        />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const avatarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSupabaseBrowserClient().auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUser(data.user)
      const meta = data.user.user_metadata
      setName((meta?.name as string) ?? '')
      setPosition((meta?.position as string) ?? '')
      setPhone((meta?.phone as string) ?? '')
      const url = meta?.avatar_url as string | undefined
      setAvatarUrl(url ? `${url}?t=${Date.now()}` : null)
    })
  }, [])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)
    setProfileSaving(true)
    const result = await updateProfileAction({ name, position, phone })
    setProfileSaving(false)
    if (!result.ok) { setProfileError(result.error) } else { setProfileSuccess(true) }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)
    if (!currentPassword) { setPasswordError('Введіть поточний пароль'); return }
    if (password.length < 6) { setPasswordError('Мінімум 6 символів'); return }
    if (password !== passwordConfirm) { setPasswordError('Паролі не збігаються'); return }
    setPasswordSaving(true)
    const result = await changePasswordAction(currentPassword, password)
    setPasswordSaving(false)
    if (!result.ok) {
      setPasswordError(result.error)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirm('')
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    setAvatarError('')

    const urlResult = await getAvatarUploadUrlAction(file.name)
    if (!urlResult.ok) {
      setAvatarError(urlResult.error)
      setAvatarUploading(false)
      return
    }

    let uploadRes: Response
    try {
      uploadRes = await fetch(urlResult.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
    } catch {
      setAvatarError('Не вдалося з\'єднатись з сховищем. Перевірте CORS налаштування R2.')
      setAvatarUploading(false)
      return
    }

    if (!uploadRes.ok) {
      setAvatarError(`Помилка завантаження (${uploadRes.status}). Спробуйте ще раз.`)
      setAvatarUploading(false)
      return
    }

    await saveAvatarUrlAction(urlResult.publicUrl)
    // Cache-bust so browser doesn't show the old image (same R2 key every time)
    setAvatarUrl(`${urlResult.publicUrl}?t=${Date.now()}`)
    setAvatarUploading(false)
  }

  const initial = (name || user?.email || 'A')[0].toUpperCase()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Акаунт"
        title="Профіль"
        description="Ваша інформація та налаштування облікового запису."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left column: Avatar + Password */}
        <div className="space-y-6">
          <Section title="Фото профілю">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Аватар"
                    className="h-24 w-24 rounded-2xl object-cover"
                    onError={() => setAvatarError('Фото не вдалося відобразити — можливо невірний шлях у сховищі.')}
                  />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary">
                    {initial}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => avatarRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-primary/30 hover:bg-orange-50 hover:text-primary disabled:opacity-50"
                >
                  {avatarUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              {avatarError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">{avatarError}</p>
              )}
              <div className="text-center">
                <p className="text-sm font-extrabold text-slate-950">{name || 'Без імені'}</p>
                <p className="text-xs font-semibold text-slate-500">{user?.email}</p>
                {position && <p className="mt-0.5 text-xs font-semibold text-primary">{position}</p>}
              </div>
            </div>
          </Section>

          <Section title="Зміна пароля">
            <form onSubmit={handlePasswordSave} className="space-y-3">
              <InputField
                label="Поточний пароль"
                icon={Lock}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <InputField
                label="Новий пароль"
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <InputField
                label="Підтвердити пароль"
                icon={Lock}
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              {passwordError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Пароль змінено
                </p>
              )}

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="md" showIcon={false} disabled={passwordSaving}>
                  {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                  {passwordSaving ? 'Зберігаємо...' : 'Змінити пароль'}
                </Button>
              </div>
            </form>
          </Section>
        </div>

        {/* Right column: Personal info */}
        <Section title="Особиста інформація" description="Ця інформація відображається в адмін-панелі." className="self-start">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Ім'я та прізвище" icon={UserCircle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Іван Іваненко" />
              <InputField label="Посада" icon={UserCircle} value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Ветеринар" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Телефон" icon={Phone} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 99 999 99 99" />
              <InputField label="Email" icon={Mail} type="email" value={user?.email ?? ''} disabled />
            </div>

            {profileError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{profileError}</p>
            )}
            {profileSuccess && (
              <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Збережено
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" showIcon={false} disabled={profileSaving}>
                {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {profileSaving ? 'Зберігаємо...' : 'Зберегти'}
              </Button>
            </div>
          </form>
        </Section>
      </div>
    </div>
  )
}
