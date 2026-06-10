'use client'

import {
  getFormProps,
  getInputProps,
  getSelectProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { useActionState, useMemo, type ComponentProps } from 'react'
import { createAnimalAction, updateAnimalAction } from '@/app/admin/animals/actions'
import { animalSchema } from '@/lib/admin-schemas'
import type { AnimalRow } from '@/lib/admin-types'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { EntityForm, Field, toDatetimeLocal } from '@/components/admin/forms/shared'

export function AnimalForm({ initial, mode }: { initial?: AnimalRow; mode: 'create' | 'edit' }) {
  const action = useMemo(
    () => (mode === 'create' ? createAnimalAction : updateAnimalAction.bind(null, initial!.id)),
    [initial, mode]
  )
  const [lastResult, formAction, pending] = useActionState(action, undefined)
  const [form, fields] = useForm({
    lastResult,
    defaultValue: animalDefaultValue(initial),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: animalSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <EntityForm
      action={formAction}
      formProps={getFormProps(form)}
      pending={pending}
      status={form.errors?.join(', ')}
      submitLabel={mode === 'create' ? 'Створити тварину' : 'Зберегти зміни'}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ім'я" errors={fields.name.errors}>
          <Input {...getInputProps(fields.name, { type: 'text' })} placeholder="Ім'я відсутнє" />
        </Field>
        <Field label="Стать" errors={fields.gender.errors}>
          <Select {...getSelectProps(fields.gender)}>
            <option value="male">Хлопчик</option>
            <option value="female">Дівчинка</option>
          </Select>
        </Field>
        <Field label="Розмір" errors={fields.size.errors}>
          <Select {...getSelectProps(fields.size)}>
            <option value="small">Малий</option>
            <option value="medium">Середній</option>
            <option value="large">Великий</option>
          </Select>
        </Field>
        <Field label="Статус" errors={fields.status.errors}>
          <Select {...getSelectProps(fields.status)}>
            <option value="draft">Чернетка</option>
            <option value="available">Доступний</option>
            <option value="reserved">Зарезервований</option>
            <option value="adopted">Прилаштований</option>
            <option value="hidden">Прихований</option>
          </Select>
        </Field>
        <Field label="Вік текстом" errors={fields.approximate_age_label.errors}>
          <Input {...getInputProps(fields.approximate_age_label, { type: 'text' })} />
        </Field>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Дата публікації" errors={fields.published_at.errors}>
          <Input {...getInputProps(fields.published_at, { type: 'datetime-local' })} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ConformCheckbox label="Вакциновано" inputProps={getInputProps(fields.is_vaccinated, { type: 'checkbox' })} />
        <ConformCheckbox label="Стерилізовано" inputProps={getInputProps(fields.is_neutered, { type: 'checkbox' })} />
      </div>
      <Field label="Бейдж на фото та фільтр" errors={fields.adoption_status.errors}>
        <Select {...getSelectProps(fields.adoption_status)}>
          <option value="">Без статусного бейджа</option>
          <option value="ready">Готовий до адопції</option>
          <option value="needs_care">Потребує турботи</option>
        </Select>
      </Field>
      <Field label="Короткий опис" errors={fields.short_description.errors}>
        <Textarea {...getTextareaProps(fields.short_description)} />
      </Field>
      <Field label="Повна історія" errors={fields.full_story.errors}>
        <Textarea className="min-h-56" {...getTextareaProps(fields.full_story)} />
      </Field>
      <Field label="Публічні бейджі" errors={fields.public_badges.errors}>
        <Textarea className="min-h-32" {...getTextareaProps(fields.public_badges)} />
      </Field>
    </EntityForm>
  )
}

function ConformCheckbox({label,
  inputProps,}: {
  label: string
  inputProps: ComponentProps<'input'>
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-800 shadow-sm transition hover:border-slate-300">
      <span>{label}</span>
      <span className="relative h-7 w-12">
        <input {...inputProps} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-primary" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function animalDefaultValue(initial?: AnimalRow) {
  return {
    name: initial?.name ?? '',
    gender: initial?.gender ?? 'male',
    size: initial?.size ?? 'medium',
    status: initial?.status ?? 'draft',
    short_description: initial?.short_description ?? null,
    full_story: initial?.full_story ?? null,
    approximate_age_label: initial?.approximate_age_label ?? null,
    is_vaccinated: initial?.is_vaccinated ? 'on' : undefined,
    is_neutered: initial?.is_neutered ? 'on' : undefined,
    adoption_status: initial?.adoption_status ?? '',
    public_badges: initial?.public_badges?.join('\n') ?? '',
    published_at: toDatetimeLocal(initial?.published_at),
  }
}
