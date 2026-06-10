'use client'

import { useRef, useState, useTransition } from 'react'
import { ArrowLeft, Check, ImagePlus, Loader2, Plus, Star, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, IconButton } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { Field, toDatetimeLocal } from '@/components/admin/forms/shared'
import { createAnimalDraftAction, publishAnimalAction, updateAnimalDraftAction } from '@/app/admin/animals/actions'
import {
  createAnimalPhotoUploadAction,
  deleteAnimalPhotoAction,
  registerAnimalPhotoAction,
  setMainAnimalPhotoAction,
} from '@/app/admin/animals/photo-actions'
import type { AnimalPhotoRow, AnimalRow } from '@/lib/admin-types'
import { cn } from '@/lib/utils'

type Step = 'details' | 'photos' | 'publish'

export default function AnimalCreateModal({initialAnimal,
  initialPhotos = [],
  initialStep = 'details',
  triggerLabel = 'Додати тварину',
  triggerDisabled = false,}: {
  initialAnimal?: AnimalRow
  initialPhotos?: AnimalPhotoRow[]
  initialStep?: Step
  triggerLabel?: string
  triggerDisabled?: boolean
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('details')
  const [animalId, setAnimalId] = useState<string | null>(null)
  const [animalName, setAnimalName] = useState('')
  const [photos, setPhotos] = useState<AnimalPhotoRow[]>([])
  const [details, setDetails] = useState(() => getAnimalDetails(initialAnimal))
  const [detailsSaved, setDetailsSaved] = useState(Boolean(initialAnimal && isAnimalDetailsComplete(getAnimalDetails(initialAnimal))))
  const [status, setStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const mainPhoto = photos.find((photo) => photo.is_main)
  const isEditing = Boolean(initialAnimal)
  const hasPublication = Boolean(initialAnimal?.published_at)
  const detailsComplete = isAnimalDetailsComplete(details)
  const canUsePhotos = Boolean(animalId) && detailsComplete && detailsSaved
  const canUsePublish = canUsePhotos && Boolean(mainPhoto)

  function openModal() {
    const nextDetails = getAnimalDetails(initialAnimal)
    const nextDetailsComplete = isAnimalDetailsComplete(nextDetails)
    const nextHasMainPhoto = initialPhotos.some((photo) => photo.is_main)
    setAnimalId(initialAnimal?.id ?? null)
    setAnimalName(initialAnimal?.name ?? '')
    setDetails(nextDetails)
    setDetailsSaved(Boolean(initialAnimal && nextDetailsComplete))
    setPhotos(initialPhotos)
    setStatus('')
    setIsOpen(true)
    setStep(getAvailableStep(initialStep, {
      hasSavedDetails: Boolean(initialAnimal && nextDetailsComplete),
      hasMainPhoto: nextHasMainPhoto,
    }))
  }

  function closeModal() {
    setIsOpen(false)
    setStep('details')
    setAnimalId(null)
    setAnimalName('')
    setDetails(getAnimalDetails(initialAnimal))
    setDetailsSaved(Boolean(initialAnimal && isAnimalDetailsComplete(getAnimalDetails(initialAnimal))))
    setPhotos([])
    setStatus('')
    setIsUploading(false)
    if (fileInputRef.current) {fileInputRef.current.value = ''}
  }

  function saveDetails(formData: FormData) {
    if (!detailsComplete) {
      setStatus('Заповни всі поля з вкладки "Дані", після цього можна переходити до фото.')
      return
    }

    const intent = formData.get('intent')?.toString() ?? 'save-photos'
    setStatus('')
    startTransition(async () => {
      const result =
        initialAnimal
          ? await updateAnimalDraftAction(initialAnimal.id, formData)
          : await createAnimalDraftAction(formData)

      if (!result.ok) {
        setStatus(result.error)
        return
      }

      setAnimalId(result.animal.id)
      setAnimalName(result.animal.name)
      setDetailsSaved(true)
      router.refresh()

      if (intent === 'save-close') {
        closeModal()
        return
      }

      if (intent === 'save') {
        return
      }

      if (intent === 'save-publish') {
        if (!mainPhoto) {
          setStep('photos')
          setStatus('Перед публікацією обери головне фото.')
          return
        }

        setStep('publish')
        return
      }

      setStep('photos')
    })
  }

  function updateDetail<Key extends keyof AnimalDetails>(key: Key, value: AnimalDetails[Key]) {
    setDetails((current) => ({ ...current, [key]: value }))
    setDetailsSaved(false)
    if (key === 'name') {
      setAnimalName(String(value))
    }
  }

  function changeStep(nextStep: Step) {
    if (nextStep === 'photos' && !canUsePhotos) {
      setStatus('Спочатку заповни та збережи всі дані тварини.')
      return
    }

    if (nextStep === 'publish' && !canUsePublish) {
      setStatus('Для публікації потрібні заповнені дані та головне фото.')
      return
    }

    setStatus('')
    setStep(nextStep)
  }

  async function uploadPhotos(files: FileList | null) {
    if (!animalId || !files?.length) {return}
    setStatus('')
    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        const upload = await createAnimalPhotoUploadAction({
          animalId,
          fileName: file.name,
          contentType: file.type || 'image/jpeg',
        })

        if (!upload.ok) {
          setStatus(upload.error)
          continue
        }

        let response: Response
        try {
          response = await fetch(upload.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
          })
        } catch {
          setStatus('Браузер заблокував upload у R2. Перевір CORS policy для bucket paws-website.')
          continue
        }

        if (!response.ok) {
          const details = await response.text().catch(() => '')
          setStatus(`R2 upload failed: ${response.status} ${response.statusText}${details ? ` — ${details}` : ''}`)
          continue
        }

        const registered = await registerAnimalPhotoAction({
          animalId,
          r2Key: upload.r2Key,
          publicUrl: upload.publicUrl,
          alt: `${animalName} фото`,
        })

        if (!registered.ok) {
          setStatus(registered.error)
          continue
        }

        setPhotos((current) => [...current, registered.photo as AnimalPhotoRow])
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {fileInputRef.current.value = ''}
    }

    router.refresh()
  }

  function setMainPhoto(photoId: string) {
    if (!animalId) {return}
    setStatus('')
    startTransition(async () => {
      const result = await setMainAnimalPhotoAction(animalId, photoId)

      if (!result.ok) {
        setStatus(result.error)
        return
      }

      setPhotos((current) =>
        current.map((photo) => ({
          ...photo,
          is_main: photo.id === photoId,
        }))
      )
      router.refresh()
    })
  }

  function deletePhoto(photoId: string) {
    if (!animalId) {return}
    setStatus('')
    startTransition(async () => {
      const result = await deleteAnimalPhotoAction(animalId, photoId)

      if (!result.ok) {
        setStatus(result.error)
        return
      }

      setPhotos((current) =>
        current
          .filter((photo) => photo.id !== result.deletedPhotoId)
          .map((photo) => ({
            ...photo,
            is_main: result.nextMainPhotoId ? photo.id === result.nextMainPhotoId : photo.is_main,
          }))
      )

      if (!result.r2Deleted) {
        setStatus('Фото прибрано з сайту, але файл у R2 не видалився автоматично.')
      }

      router.refresh()
    })
  }

  function publish() {
    if (!animalId) {return}
    setStatus('')
    const formData = new FormData()
    formData.set('animalId', animalId)

    startTransition(async () => {
      const result = await publishAnimalAction(formData)

      if (!result.ok) {
        setStatus(result.error)
        return
      }

      closeModal()
      router.refresh()
    })
  }

  function savePublicationState(nextStatus: AnimalRow['status']) {
    if (!animalId) {return}
    setStatus('')

    const nextDetails = {
      ...details,
      status: nextStatus,
      published_at: nextStatus === 'draft' ? '' : details.published_at,
    }
    const formData = getAnimalFormData(nextDetails)

    startTransition(async () => {
      const result = await updateAnimalDraftAction(animalId, formData)

      if (!result.ok) {
        setStatus(result.error)
        return
      }

      setDetails(nextDetails)
      setAnimalName(result.animal.name)
      setDetailsSaved(true)
      closeModal()
      router.refresh()
    })
  }

  return (
    <>
      <Button onClick={openModal} variant={isEditing ? 'outline' : 'primary'} size={isEditing ? 'sm' : 'md'} disabled={triggerDisabled}>
        {!isEditing ? <Plus className="h-4 w-4" /> : null}
        {triggerLabel}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_90px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase text-primary">
                  {isEditing ? 'Картка тварини' : 'Нова тварина'}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                  {animalName || 'Створення запису'}
                </h2>
              </div>
              <IconButton label="Закрити" variant="ghost" onClick={closeModal}>
                <X className="h-5 w-5" />
              </IconButton>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-500">
              <StepTab active={step === 'details'} done={detailsSaved && detailsComplete} onClick={() => changeStep('details')}>
                Дані
              </StepTab>
              <StepTab active={step === 'photos'} done={Boolean(mainPhoto)} disabled={!canUsePhotos} onClick={() => changeStep('photos')}>
                Фото
              </StepTab>
              <StepTab active={step === 'publish'} done={hasPublication} disabled={!canUsePublish} onClick={() => changeStep('publish')}>
                Публікація
              </StepTab>
            </div>

            <div className="max-h-[calc(92vh-150px)] overflow-auto p-6">
              {status ? (
                <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {status}
                </div>
              ) : null}

              {step === 'details' ? (
                <form action={saveDetails} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Ім'я">
                      <Input name="name" placeholder="Ім'я відсутнє" value={details.name} onChange={(event) => updateDetail('name', event.target.value)} />
                    </Field>
                    <Field label="Стать">
                      <Select name="gender" value={details.gender} onChange={(event) => updateDetail('gender', event.target.value as AnimalDetails['gender'])}>
                        <option value="male">Хлопчик</option>
                        <option value="female">Дівчинка</option>
                      </Select>
                    </Field>
                    <Field label="Розмір">
                      <Select name="size" value={details.size} onChange={(event) => updateDetail('size', event.target.value as AnimalDetails['size'])}>
                        <option value="small">Малий</option>
                        <option value="medium">Середній</option>
                        <option value="large">Великий</option>
                      </Select>
                    </Field>
                    <Field label="Вік текстом">
                      <Input name="approximate_age_label" value={details.approximate_age_label} onChange={(event) => updateDetail('approximate_age_label', event.target.value)} />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Статус">
                      <Select name="status" value={details.status} onChange={(event) => updateDetail('status', event.target.value as AnimalDetails['status'])}>
                        <option value="draft">Чернетка</option>
                        <option value="available">Доступна</option>
                        <option value="reserved">Резерв</option>
                        <option value="adopted">Прилаштована</option>
                        <option value="hidden">Прихована</option>
                      </Select>
                    </Field>
                    <Field label="Дата публікації">
                      <Input name="published_at" type="datetime-local" value={details.published_at} onChange={(event) => updateDetail('published_at', event.target.value)} />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <CheckboxField name="is_vaccinated" label="Вакциновано" checked={details.is_vaccinated} onChange={(checked) => updateDetail('is_vaccinated', checked)} />
                    <CheckboxField name="is_neutered" label="Стерилізовано" checked={details.is_neutered} onChange={(checked) => updateDetail('is_neutered', checked)} />
                  </div>
                  <Field label="Бейдж на фото та фільтр">
                    <Select name="adoption_status" value={details.adoption_status ?? ''} onChange={(event) => updateDetail('adoption_status', event.target.value as AnimalDetails['adoption_status'])}>
                      <option value="">Без статусного бейджа</option>
                      <option value="ready">Готовий до адопції</option>
                      <option value="needs_care">Потребує турботи</option>
                    </Select>
                  </Field>
                  <Field label="Короткий опис">
                    <Textarea name="short_description" value={details.short_description} onChange={(event) => updateDetail('short_description', event.target.value)} />
                  </Field>
                  <Field label="Повна історія">
                    <Textarea name="full_story" className="min-h-44" value={details.full_story} onChange={(event) => updateDetail('full_story', event.target.value)} />
                  </Field>
                  <Field label="Публічні бейджі">
                    <Textarea
                      name="public_badges"
                      className="min-h-32"
                      placeholder={'Готовий до адопції\nШукає родину\nМає свою історію'}
                      value={details.public_badges}
                      onChange={(event) => updateDetail('public_badges', event.target.value)}
                    />
                  </Field>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Button type="submit" name="intent" value="save" variant="secondary" disabled={isPending || !detailsComplete} showIcon={false}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Зберегти
                    </Button>
                    <Button type="submit" name="intent" value="save-close" variant="outline" disabled={isPending || !detailsComplete} showIcon={false}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Зберегти і закрити
                    </Button>
                    <Button type="submit" name="intent" value="save-photos" disabled={isPending || !detailsComplete}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Перейти до фото
                    </Button>
                    <Button type="submit" name="intent" value="save-publish" disabled={isPending || !detailsComplete || !mainPhoto}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Перейти до публікації
                    </Button>
                  </div>
                </form>
              ) : null}

              {step === 'photos' ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-extrabold text-slate-950">Фото тварини</p>
                      <p className="mt-1 text-sm text-slate-500">Завантаж у R2 і познач головне фото зірочкою.</p>
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => uploadPhotos(event.target.files)}
                      />
                      <Button onClick={() => fileInputRef.current?.click()} disabled={!animalId || isUploading}>
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {isUploading ? 'Завантаження...' : 'Додати фото'}
                      </Button>
                    </div>
                  </div>

                  {photos.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {photos.map((photo) => (
                        <div key={photo.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className="relative aspect-[4/3] bg-slate-100">
                            {photo.public_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={photo.public_url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
                            ) : null}
                            <IconButton
                              label="Видалити фото"
                              variant="danger"
                              onClick={() => deletePhoto(photo.id)}
                              disabled={isPending}
                              className="absolute left-3 top-3 h-10 w-10 bg-white/90 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-5 w-5" />
                            </IconButton>
                            <button
                              type="button"
                              onClick={() => setMainPhoto(photo.id)}
                              disabled={isPending}
                              className={cn(
                                'absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 shadow-sm transition disabled:pointer-events-none disabled:opacity-50',
                                photo.is_main ? 'border-amber-300 text-amber-500' : 'border-slate-200 text-slate-400 hover:text-amber-500'
                              )}
                              aria-label="Зробити головним"
                              title="Зробити головним"
                            >
                              <Star className={cn('h-5 w-5', photo.is_main && 'fill-current')} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
                      Фото ще немає.
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setStep('details')} showIcon={false}>
                      <ArrowLeft className="h-4 w-4" />
                      Назад
                    </Button>
                    <Button onClick={() => changeStep('publish')} disabled={!canUsePublish}>
                      Далі
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 'publish' ? (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-extrabold uppercase text-slate-400">Поточний статус</p>
                      <div className="mt-3">
                        <StatusPill status={details.status} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        {getPublicationStatusCopy(details.status, hasPublication)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Button variant="outline" onClick={() => setStep('photos')} showIcon={false}>
                      <ArrowLeft className="h-4 w-4" />
                      Назад
                    </Button>
                    {details.status === 'draft' ? (
                      <>
                        <Button variant="secondary" onClick={() => savePublicationState('draft')} disabled={isPending} showIcon={false}>
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          Залишити чернеткою
                        </Button>
                        <Button onClick={publish} disabled={isPending || !mainPhoto}>
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Опублікувати
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => savePublicationState(details.status)} disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Зберегти
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function StepTab({active,
  done,
  disabled = false,
  onClick,
  children,}: {
  active: boolean
  done: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-3 transition hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-slate-500',
        active && 'bg-white text-slate-950'
      )}
    >
      {done ? <Check className="h-4 w-4 text-emerald-500" /> : null}
      {children}
    </button>
  )
}

function CheckboxField({name,
  label,
  checked,
  onChange,
  className,}: {
  name: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}) {
  return (
    <label className={cn('flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-slate-300', className)}>
      <span>{label}</span>
      <input name={name} className="peer sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="relative h-7 w-12 rounded-full bg-slate-200 transition peer-checked:bg-primary">
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function StatusPill({ status }: { status: AnimalRow['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold',
        status === 'available' && 'bg-emerald-50 text-emerald-700',
        status === 'reserved' && 'bg-amber-50 text-amber-700',
        (status === 'adopted' || status === 'hidden') && 'bg-rose-50 text-rose-700',
        status === 'draft' && 'bg-slate-200 text-slate-700'
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}

type AnimalDetails = {
  name: string
  gender: AnimalRow['gender']
  size: AnimalRow['size']
  status: AnimalRow['status']
  short_description: string
  full_story: string
  approximate_age_label: string
  public_badges: string
  adoption_status: AnimalRow['adoption_status'] | ''
  is_vaccinated: boolean
  is_neutered: boolean
  published_at: string
}

function getAnimalDetails(animal?: AnimalRow): AnimalDetails {
  return {
    name: animal?.name ?? '',
    gender: animal?.gender ?? 'male',
    size: animal?.size ?? 'medium',
    status: animal?.status ?? 'draft',
    short_description: animal?.short_description ?? '',
    full_story: animal?.full_story ?? '',
    approximate_age_label: animal?.approximate_age_label ?? '',
    public_badges: animal?.public_badges?.join('\n') ?? '',
    adoption_status: animal?.adoption_status ?? '',
    is_vaccinated: Boolean(animal?.is_vaccinated),
    is_neutered: Boolean(animal?.is_neutered),
    published_at: toDatetimeLocal(animal?.published_at),
  }
}

function getAnimalFormData(details: AnimalDetails) {
  const formData = new FormData()
  formData.set('name', details.name)
  formData.set('gender', details.gender)
  formData.set('size', details.size)
  formData.set('status', details.status)
  formData.set('short_description', details.short_description)
  formData.set('full_story', details.full_story)
  formData.set('approximate_age_label', details.approximate_age_label)
  formData.set('public_badges', details.public_badges)
  formData.set('adoption_status', details.adoption_status ?? '')
  formData.set('published_at', details.published_at)

  if (details.is_vaccinated) {formData.set('is_vaccinated', 'on')}
  if (details.is_neutered) {formData.set('is_neutered', 'on')}

  return formData
}

function isAnimalDetailsComplete(details: AnimalDetails) {
  return Boolean(
    details.name.trim() &&
    details.approximate_age_label.trim() &&
    details.short_description.trim() &&
    details.full_story.trim()
  )
}

function getAvailableStep(
  requestedStep: Step,
  state: {
    hasSavedDetails: boolean
    hasMainPhoto: boolean
  }
): Step {
  if (requestedStep === 'publish') {
    return state.hasSavedDetails && state.hasMainPhoto ? 'publish' : 'details'
  }

  if (requestedStep === 'photos') {
    return state.hasSavedDetails ? 'photos' : 'details'
  }

  return 'details'
}

function getStatusLabel(status: AnimalRow['status']) {
  const labels: Record<AnimalRow['status'], string> = {
    draft: 'Чернетка',
    available: 'Опублікована',
    reserved: 'Резерв',
    adopted: 'Прилаштована',
    hidden: 'Прихована',
  }

  return labels[status]
}

function getPublicationStatusCopy(status: AnimalRow['status'], hasPublication: boolean) {
  if (status === 'draft') {return 'Чернетка не показується в публічному каталозі.'}
  if (status === 'available') {return hasPublication ? 'Тварина доступна в публічному каталозі.' : 'Після збереження тварина буде доступна в каталозі.'}
  if (status === 'reserved') {return 'Тварина має резерв і не повинна виглядати як вільна до адопції.'}
  if (status === 'adopted') {return 'Тварину вже прилаштовано.'}
  return 'Прихований запис не показується на сайті.'
}
