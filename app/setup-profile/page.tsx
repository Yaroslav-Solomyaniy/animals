'use client'

import { useRef, useState } from 'react'
import { Camera, CheckCircle2, Loader2, PawPrint, Phone, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { updateProfileAction, getAvatarUploadUrlAction, saveAvatarUrlAction } from '@/app/admin/profile/actions'

export default function SetupProfilePage() {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const avatarRef = useRef<HTMLInputElement>(null)

  const initial = (name || 'A')[0].toUpperCase()

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const result = await updateProfileAction({ name, position, phone })
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => { window.location.href = '/admin' }, 1500)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-orange-950/50" />

      <div className="relative w-full max-w-[500px]">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="p-8 sm:p-10">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-white">Готово!</h2>
                <p className="text-sm text-white/50">Переходимо в адмін-панель...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-orange-300">
                    <PawPrint className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Налаштування профілю</h2>
                  <p className="mt-1.5 text-sm text-white/50">Розкажіть трохи про себе — це відображається в адмін-панелі</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Аватар"
                          className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/20"
                          onError={() => setAvatarError('Фото не вдалося відобразити — можливо невірний шлях у сховищі.')}
                        />
                      ) : (
                        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black text-white/60 ring-2 ring-white/10">
                          {initial}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => avatarRef.current?.click()}
                        disabled={avatarUploading}
                        className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/60 backdrop-blur-sm transition hover:bg-white/20 hover:text-white disabled:opacity-50"
                      >
                        {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                      </button>
                      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    {avatarError && (
                      <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-center text-xs font-semibold text-red-300">{avatarError}</p>
                    )}
                    <p className="text-xs text-white/30">Фото профілю (необов&apos;язково)</p>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-white/70">Ім&apos;я та прізвище</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Іван Іваненко"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-white/70">Посада</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="text"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          placeholder="Ветеринар"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-white/70">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+380 99 999 99 99"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-orange-400/20"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                      {error}
                    </p>
                  )}

                  <Button type="submit" variant="primary" size="md" showIcon={false} disabled={saving} className="w-full rounded-xl">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {saving ? 'Зберігаємо...' : 'Зберегти і продовжити'}
                  </Button>

                  <div className="text-center">
                    <a href="/admin" className="text-sm font-semibold text-white/30 transition hover:text-white/60">
                      Пропустити цей крок
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
