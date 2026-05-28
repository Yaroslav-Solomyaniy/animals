'use client'

import { useState, type FocusEvent, type InputHTMLAttributes } from 'react'

import { Input } from '@/components/ui/FormControls'

type UkrainianPhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value'
>

export default function UkrainianPhoneInput({
  defaultValue,
  onBlur,
  onChange,
  onFocus,
  placeholder = '+380 (__) ___-__-__',
  ...props
}: UkrainianPhoneInputProps) {
  const [phone, setPhone] = useState(String(defaultValue ?? ''))

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    onFocus?.(event)
    if (!phone) setPhone('+380 ')
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur?.(event)
    if (!getUkrainianPhoneNationalDigits(phone)) setPhone('')
  }

  return (
    <Input
      {...props}
      type="tel"
      value={phone}
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={(event) => {
        setPhone(formatUkrainianPhone(event.target.value))
        onChange?.(event)
      }}
    />
  )
}

function getUkrainianPhoneNationalDigits(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) return ''
  if (digits.startsWith('380')) return digits.slice(3, 12)
  if (digits.startsWith('80')) return digits.slice(2, 11)
  if (digits.startsWith('0')) return digits.slice(1, 10)

  return digits.slice(0, 9)
}

function formatUkrainianPhone(value: string) {
  const nationalDigits = getUkrainianPhoneNationalDigits(value)
  const operator = nationalDigits.slice(0, 2)
  const first = nationalDigits.slice(2, 5)
  const second = nationalDigits.slice(5, 7)
  const third = nationalDigits.slice(7, 9)

  if (!nationalDigits) return ''

  let formatted = '+380'
  if (operator) formatted += ` (${operator}`
  if (operator.length === 2) formatted += ')'
  if (first) formatted += ` ${first}`
  if (second) formatted += `-${second}`
  if (third) formatted += `-${third}`

  return formatted
}
