'use client'

import { type FormEvent, useRef, useState } from 'react'
import { Check, Loader2, Paperclip, PawPrint, Send, X } from 'lucide-react'

import { type ContactFormState, createContactAttachmentUploadAction, submitContactFormAction } from './actions'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import UkrainianPhoneInput from '@/components/ui/UkrainianPhoneInput'
import { AnimalPickerModal } from '@/components/admin/AnimalPickerModal'
import type { AnimalWithPhoto } from '@/lib/admin-types'

type UploadedAttachment = {
  name: string
  publicUrl: string
  r2Key: string
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [topic, setTopic] = useState('')
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalWithPhoto | null>(null)
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<UploadedAttachment[]>([])
  const [status, setStatus] = useState<ContactFormState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const isAdoptionTopic = topic === 'adoption'
  const MAX_FILES = 3

  const isFormValid =
    name.trim() !== '' &&
    phone.trim().replace(/\D/g, '').length >= 10 &&
    topic !== '' &&
    (topic === 'adoption' || message.trim() !== '') &&
    consentGiven

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = formRef.current
    if (!form || isSubmitting) return

    setIsSubmitting(true)
    setStatus(null)
    setUploadedAttachments([])

    try {
      const formData = new FormData(form)
      formData.delete('attachmentUrls')

      for (const file of selectedFiles) {
        const upload = await createContactAttachmentUploadAction({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
        })

        if (!upload.ok) {
          setStatus({ ok: false, message: upload.error })
          return
        }

        const response = await fetch(upload.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
        })

        if (!response.ok) {
          setStatus({ ok: false, message: `Не вдалося завантажити файл: ${file.name}` })
          return
        }

        formData.append('attachmentUrls', upload.publicUrl)
        setUploadedAttachments((current) => [
          ...current,
          { name: file.name, publicUrl: upload.publicUrl, r2Key: upload.r2Key },
        ])
      }

      const result = await submitContactFormAction(formData)
      setStatus(result)

      if (result.ok) {
        setSelectedFiles([])
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      ref={formRef}
      id="contact-form"
      encType="multipart/form-data"
      className="grid scroll-mt-28 gap-6 bg-white/86 p-4 sm:p-6 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] lg:gap-8 lg:p-8 xl:gap-10 xl:p-10"
      onSubmit={handleSubmit}
    >
      <div className="lg:pt-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Форма зв&#39;язку</p>
        <h2 className="mt-3 text-2xl font-extrabold text-text-main sm:text-3xl">Залиште повідомлення</h2>
        <p className="mt-3 max-w-xl leading-7 text-gray-600">
          Напишіть, з якого питання звертаєтесь. Для запису на прогулянку або усиновлення залиште телефон, щоб ми могли підтвердити деталі.
        </p>
      </div>

      <div className="min-w-0">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700">Ваше ім&#39;я</span>
            <Input
              name="name"
              type="text"
              required
              placeholder="Ім&#39;я та прізвище"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl border-gray-100 bg-gray-50 py-4 font-medium shadow-none transition hover:border-gray-200 focus:border-orange-300 focus:bg-white focus:ring-0"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700">Телефон</span>
            <UkrainianPhoneInput
              name="phone"
              required
              className="h-[52px]"
              placeholder="+38 (0__) ___-__-__"
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <Input name="email" type="email" placeholder="name@example.com" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-gray-700">Тема</span>
            <Select
              name="topic"
              required
              value={topic}
              onChange={(event) => {
                const value = event.currentTarget.value
                setTopic(value)
                if (value !== 'adoption') setSelectedAnimal(null)
              }}
            >
              <option value="">Оберіть тему звернення</option>
              <option value="adoption">Усиновлення</option>
              <option value="walk">Волонтерська прогулянка</option>
              <option value="services">Комерційні послуги</option>
              <option value="other">Інше питання</option>
            </Select>
          </label>
        </div>

        {isAdoptionTopic && (
          <div className="mt-4 rounded-3xl border border-orange-100 bg-orange-50/45 p-4">
            {selectedAnimal ? (
              <div className="flex items-center gap-4">
                {/* Photo with remove button */}
                <div className="relative h-16 w-16 shrink-0">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-orange-100">
                    {selectedAnimal.photo_url ? (
                      <img
                        src={selectedAnimal.photo_url}
                        alt={selectedAnimal.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        {selectedAnimal.gender === 'female' ? '🐱' : '🐶'}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAnimal(null)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 transition hover:bg-rose-50 hover:text-rose-500 hover:ring-rose-200"
                    aria-label="Прибрати тварину"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-gray-950">{selectedAnimal.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {selectedAnimal.approximate_age_label ? `${selectedAnimal.approximate_age_label} · ` : ''}
                    {selectedAnimal.gender === 'female' ? 'Дівчинка' : 'Хлопчик'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAnimalModalOpen(true)}
                    className="mt-1 text-xs font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    Змінити
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Собака для усиновлення</span>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Можна обрати собаку з каталогу або залишити поле порожнім.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAnimalModalOpen(true)}>
                  <PawPrint className="h-4 w-4" />
                  Обрати собаку
                </Button>
              </div>
            )}
            <input type="hidden" name="animal" value={selectedAnimal?.id ?? ''} />
            <input type="hidden" name="animalName" value={selectedAnimal?.name ?? ''} />
          </div>
        )}

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-semibold text-gray-700">Повідомлення</span>
          <Textarea
            name="message"
            rows={5}
            required={topic !== 'adoption'}
            placeholder="Коротко опишіть, чим можемо допомогти"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-0 rounded-2xl border-gray-100 bg-gray-50 py-4 font-medium shadow-none transition hover:border-gray-200 focus:border-orange-300 focus:bg-white focus:ring-0"
          />
        </label>

        {/* File upload */}
        <div className="mt-4 rounded-3xl border border-dashed border-orange-200 bg-orange-50/45 p-4 transition hover:border-orange-300 hover:bg-orange-50/70">
          <label className="flex cursor-pointer items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <Paperclip className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-text-main">
                Додати файли{' '}
                <span className="font-semibold text-gray-400">(до {MAX_FILES})</span>
              </span>
              <span className="mt-0.5 block text-xs text-gray-400">
                JPG, PNG, GIF, PDF, DOC, DOCX
              </span>
              <input
                ref={fileInputRef}
                name="attachments"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,.pdf,.doc,.docx"
                className="mt-3 block w-full text-sm font-semibold text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-sm file:font-extrabold file:text-primary hover:file:bg-orange-50"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []).slice(0, MAX_FILES)
                  setSelectedFiles(files)
                  if ((event.target.files?.length ?? 0) > MAX_FILES && fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              />
            </span>
          </label>

          {(selectedFiles.length > 0 || uploadedAttachments.length > 0) && (
            <div className="mt-3 space-y-2">
              {selectedFiles.map((file, i) => (
                <div
                  key={`${file.name}-${file.size}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
                      if (selectedFiles.length === 1 && fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="shrink-0 text-gray-300 transition hover:text-rose-400"
                    aria-label="Видалити файл"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {uploadedAttachments.map((file) => (
                <a
                  key={file.r2Key}
                  href={file.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-sm font-semibold text-emerald-700"
                >
                  <Check className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                </a>
              ))}
              {selectedFiles.length >= MAX_FILES && (
                <p className="text-xs text-orange-500">Максимум {MAX_FILES} файли</p>
              )}
            </div>
          )}
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-100 bg-white/78 p-4 text-sm leading-6 text-gray-600 transition hover:border-orange-100">
          <input
            name="personalDataConsent"
            type="checkbox"
            required
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/20"
          />
          <span>
            Надаю згоду на обробку та використання моїх персональних даних з метою розгляду звернення, комунікації зі мною та організації
            роботи підприємства відповідно до мого запиту.
          </span>
        </label>

        {status ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${status.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}
          >
            {status.message}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          showIcon={false}
          disabled={isSubmitting || !isFormValid}
          className="mt-6 h-auto min-h-13 w-full rounded-2xl px-5 py-3 sm:w-auto"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isSubmitting ? 'Надсилаємо...' : 'Надіслати повідомлення'}
        </Button>
      </div>

      <AnimalPickerModal
        open={isAnimalModalOpen}
        onOpenChange={(open) => { if (!open) setIsAnimalModalOpen(false) }}
        selectedId={selectedAnimal?.id ?? null}
        onSelect={(animal) => {
          setSelectedAnimal(animal)
          setIsAnimalModalOpen(false)
        }}
      />
    </form>
  )
}
