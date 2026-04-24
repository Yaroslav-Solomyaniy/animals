'use client'

import {
  Children,
  isValidElement,
  type InputHTMLAttributes,
  type ReactElement,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-950 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-orange-200 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

type OptionElement = ReactElement<{
  value?: string | number
  disabled?: boolean
  children?: React.ReactNode
}>

type SelectOption = {
  value: string
  label: string
  disabled: boolean
}

export function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  name,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  const options = useMemo(() => extractOptions(children), [children])
  const initialValue = String(value ?? defaultValue ?? options[0]?.value ?? '')
  const [internalValue, setInternalValue] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  const currentValue = String(value ?? internalValue)
  const selected = options.find((option) => option.value === currentValue)

  function choose(nextValue: string) {
    setInternalValue(nextValue)
    setIsOpen(false)

    if (selectRef.current) {
      selectRef.current.value = nextValue
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }

    onChange?.({
      target: { value: nextValue, name },
      currentTarget: { value: nextValue, name },
    } as React.ChangeEvent<HTMLSelectElement>)
  }

  return (
    <div className="relative">
      <select
        ref={selectRef}
        name={name}
        value={currentValue}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        {children}
      </select>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
            setIsOpen(false)
          }
        }}
        className={cn(
          fieldClass,
          'flex min-h-[52px] items-center justify-between gap-3 text-left',
          isOpen && 'border-primary ring-4 ring-primary/10',
          className
        )}
      >
        <span className={cn('truncate', selected ? 'text-slate-950' : 'text-slate-400')}>
          {selected?.label ?? 'Оберіть значення'}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition', isOpen && 'rotate-180 text-primary')} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <div className="max-h-72 overflow-auto rounded-xl">
            {options.map((option) => {
              const isSelected = option.value === currentValue
              return (
                <button
                  key={option.value || option.label}
                  type="button"
                  disabled={option.disabled}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition',
                    isSelected
                      ? 'bg-orange-50 text-primary'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                    option.disabled && 'cursor-not-allowed opacity-45'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 text-primary" /> : null}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, 'min-h-32 resize-none', className)} {...props} />
}

function extractOptions(children: React.ReactNode): SelectOption[] {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => child as OptionElement)
    .map((child) => {
      const label = Children.toArray(child.props.children).join('')
      return {
        value: String(child.props.value ?? label),
        label,
        disabled: Boolean(child.props.disabled),
      }
    })
}
