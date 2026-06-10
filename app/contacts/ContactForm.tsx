'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Check, Loader2, Paperclip, PawPrint, Send, X } from 'lucide-react'

import { createContactAttachmentUploadAction, submitContactFormAction, type ContactFormState } from './actions'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormControls'
import UkrainianPhoneInput from '@/components/ui/UkrainianPhoneInput'
import type { Animal } from '@/types'

type ContactFormProps = {
  animals: Animal[]
}

type UploadedAttachment = {
  name: string
  publicUrl: string
  r2Key: string
}

export default function ContactForm({ animals }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [topic, setTopic] = useState('')
  const [selectedAnimalId, setSelectedAnimalId] = useState('')
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<UploadedAttachment[]>([])
  const [status, setStatus] = useState<ContactFormState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAnimal = animals.find((animal) => animal.id === selectedAnimalId)
  const isAdoptionTopic = topic === 'adoption'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = formRef.current
    if (!form || isSubmitting) {return}

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
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        })

        if (!response.ok) {
          setStatus({ ok: false, message: `Не вдалося завантажити файл: ${file.name}` })
          return
        }

        formData.append('attachmentUrls', upload.publicUrl)
        setUploadedAttachments((current) => [
          ...current,
          {
            name: file.name,
            publicUrl: upload.publicUrl,
            r2Key: upload.r2Key,
          },
        ])
      }

      const result = await submitContactFormAction(formData)
      setStatus(result)

      if (result.ok) {
        setSelectedFiles([])
        if (fileInputRef.current) {fileInputRef.current.value = ''}
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
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
          Форма зв&#39;язку
        </p>
        <h2 className="mt-3 text-2xl font-extrabold text-text-main sm:text-3xl">
          Залиште повідомлення
        </h2>
        <p className="mt-3 max-w-xl leading-7 text-gray-600">
          Напишіть, з якого питання звертаєтесь. Для запису на прогулянку або усиновлення залиште телефон, щоб ми могли підтвердити деталі.
        </p>
      </div>

      <div className="min-w-0">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-gray-700">Ваше ім&#39;я</span>
          <input
            name="name"
            type="text"
            required
            placeholder="Ім&#39;я та прізвище"
            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-gray-700">Телефон</span>
          <UkrainianPhoneInput
            name="phone"
            required
            className="h-[52px]"
            placeholder="+38 (0__) ___-__-__"
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
              if (value !== 'adoption') {setSelectedAnimalId('')}
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

      {isAdoptionTopic ? (
        <div className="mt-4 rounded-3xl border border-orange-100 bg-orange-50/45 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-700">Собака для усиновлення</span>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {selectedAnimal ? selectedAnimal.name : 'Можна обрати собаку з каталогу або залишити поле порожнім.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedAnimal ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedAnimalId('')}>
                  Прибрати
                </Button>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAnimalModalOpen(true)}>
                <PawPrint className="h-4 w-4" />
                Обрати собаку
              </Button>
            </div>
          </div>
          <input type="hidden" name="animal" value={selectedAnimalId} />
          <input type="hidden" name="animalName" value={selectedAnimal?.name ?? ''} />
        </div>
      ) : null}

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-gray-700">Повідомлення</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Коротко опишіть, чим можемо допомогти"
          className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
        />
      </label>

      <label className="mt-4 block cursor-pointer rounded-3xl border border-dashed border-orange-200 bg-orange-50/45 p-4 transition hover:border-orange-300 hover:bg-orange-50/70">
        <span className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <Paperclip className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-extrabold text-text-main">Додати файли</span>
            <span className="mt-1 block text-sm leading-6 text-gray-600">
              Файли лишаються локальними до відправки. Після натискання кнопки вони завантажаться, а в заявку потраплять їх URL.
            </span>
            <input
              ref={fileInputRef}
              name="attachments"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="mt-3 block w-full text-sm font-semibold text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2.5 file:text-sm file:font-extrabold file:text-primary hover:file:bg-orange-50"
              onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
            />
          </span>
        </span>
      </label>

      {selectedFiles.length || uploadedAttachments.length ? (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file) => (
            <p key={`${file.name}-${file.size}`} className="rounded-2xl border border-gray-100 bg-white/78 px-4 py-2 text-sm font-semibold text-gray-600">
              {file.name}
            </p>
          ))}
          {uploadedAttachments.map((file) => (
            <a
              key={file.r2Key}
              href={file.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-sm font-semibold text-emerald-700"
            >
              Завантажено: {file.name}
            </a>
          ))}
        </div>
      ) : null}

      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-gray-100 bg-white/78 p-4 text-sm leading-6 text-gray-600">
        <input
          name="personalDataConsent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary/20"
        />
        <span>
          Надаю згоду на обробку та використання моїх персональних даних з метою розгляду звернення, комунікації зі мною та організації роботи підприємства відповідно до мого запиту.
        </span>
      </label>

      {status ? (
        <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${status.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          {status.message}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        showIcon={false}
        disabled={isSubmitting}
        className="mt-6 h-auto min-h-13 w-full rounded-2xl px-5 py-3 sm:w-auto"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? 'Надсилаємо...' : 'Надіслати повідомлення'}
      </Button>

      <AnimalPickerModal
        animals={animals}
        selectedAnimalId={selectedAnimalId}
        isOpen={isAnimalModalOpen}
        onClose={() => setIsAnimalModalOpen(false)}
        onSelect={(animalId) => {
          setSelectedAnimalId(animalId)
          setIsAnimalModalOpen(false)
        }}
      />
      </div>
    </form>
  )
}

function AnimalPickerModal({animals,
  selectedAnimalId,
  isOpen,
  onClose,
  onSelect,}: {
  animals: Animal[]
  selectedAnimalId: string
  isOpen: boolean
  onClose: () => void
  onSelect: (animalId: string) => void
}) {
  if (!isOpen) {return null}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[82vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-xl font-extrabold text-text-main">Обрати собаку</h3>
            <p className="mt-1 text-sm text-slate-500">Показуємо доступних тварин з каталогу сайту.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" showIcon={false} onClick={onClose} aria-label="Закрити">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid max-h-[62vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2">
          {animals.length > 0 ? (
            animals.map((animal) => {
              const isSelected = selectedAnimalId === animal.id

              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => onSelect(animal.id)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
                >
                  <span>
                    <span className="block font-extrabold text-text-main">{animal.name}</span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {[animal.age, animal.gender, animal.size].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  {isSelected ? <Check className="h-5 w-5 text-primary" /> : null}
                </button>
              )
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-500 sm:col-span-2">
              Собак у каталозі поки немає.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
