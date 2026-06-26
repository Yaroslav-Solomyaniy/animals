'use client'

import { useState, type ReactNode } from 'react'
import { useActionState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Footprints, Loader2, Send } from 'lucide-react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { createVolunteerRequestAction } from '@/app/volunteer/actions'
import { volunteerFormSchema } from '@/lib/admin-schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { Field } from '@/components/admin/forms/shared'
import UkrainianPhoneInput from '@/components/ui/UkrainianPhoneInput'
import SuccessApplication from '@/components/SuccessApplication'
import { SITE_CONTACTS } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export type AnimalInfo = {
  id: string
  name: string
  imageUrl: string
}

// Shared form — used both inline (HelpUs) and inside the modal
export function WalkForm({ animal, onSuccess }: { animal?: AnimalInfo; onSuccess?: () => void }) {
  const [lastResult, formAction, pending] = useActionState(createVolunteerRequestAction, undefined)
  const isSuccess = Boolean(lastResult?.modalId)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const isFormValid =
    name.trim().length > 0 &&
    phone.replace(/\D/g, '').length >= 10

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: volunteerFormSchema, disableAutoCoercion: true })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  // Notify parent when success changes
  if (isSuccess && onSuccess) {
    onSuccess()
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSuccess ? (
        <SuccessApplication />
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {animal && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Прогулянка з</p>
                <p className="text-base font-extrabold text-gray-900">{animal.name}</p>
              </div>
            </div>
          )}

          <form {...getFormProps(form)} action={formAction} className="space-y-4">
            {animal && (
              <>
                <input type="hidden" name="animalId" value={animal.id} />
                <input type="hidden" name="animalName" value={animal.name} />
              </>
            )}

            <Field label="ПІБ *">
              <Input
                {...getInputProps(fields.name, { type: 'text' })}
                placeholder="Ваше імʼя"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[0-9]/g, ''))}
              />
            </Field>

            <Field label="Телефон *">
              <UkrainianPhoneInput
                {...getInputProps(fields.phone, { type: 'tel' })}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>

            <Field label="Електронна пошта (необов'язково)">
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                placeholder="name@example.com"
              />
            </Field>

            <div className="rounded-xl border border-primary/20 bg-orange-50 px-4 py-3 text-xs font-bold text-primary">
              {SITE_CONTACTS.walkSchedule} — за попереднім записом.
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={pending || !isFormValid}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Відправляємо...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Залишити заявку
                </>
              )}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function WalkFormInner({ animal }: { animal?: AnimalInfo }) {
  const [isSuccess, setIsSuccess] = useState(false)

  return (
    <DialogContent
      className={cn(
        'transition-[max-width] duration-300 ease-out max-w-lg',
      )}
    >
      <AnimatePresence initial={false}>
        {!isSuccess && (
          <motion.div
            key="header"
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <DialogHeader>
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                <Footprints className="h-6 w-6" />
              </span>
              <DialogTitle>Записатися на прогулянку</DialogTitle>
              <DialogDescription>
                Залиште контакти — ми зв&apos;яжемося з вами для підтвердження запису.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        )}
      </AnimatePresence>
      <WalkForm animal={animal} onSuccess={() => setIsSuccess(true)} />
    </DialogContent>
  )
}

export function WalkOrderDialog({ trigger, animal }: { trigger: ReactNode; animal?: AnimalInfo }) {
  const [openCount, setOpenCount] = useState(0)
  return (
    <Dialog onOpenChange={(open) => { if (open) setOpenCount((c) => c + 1) }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <WalkFormInner key={openCount} animal={animal} />
    </Dialog>
  )
}
