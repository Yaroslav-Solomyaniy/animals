import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'dark'
  | 'light'
  | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const baseButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-primary bg-primary text-white shadow-primary hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_18px_45px_rgba(242,116,56,0.28)]',
  secondary:
    'border border-secondary bg-secondary text-white hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-[0_18px_45px_rgba(45,106,79,0.22)]',
  outline:
    'border border-orange-200 bg-white text-primary shadow-[0_14px_38px_rgba(242,116,56,0.10)] hover:-translate-y-0.5 hover:border-primary hover:bg-orange-50 hover:shadow-[0_18px_45px_rgba(242,116,56,0.18)]',
  ghost:
    'border border-transparent bg-transparent text-gray-600 hover:bg-orange-50 hover:text-primary',
  dark:
    'border border-gray-950 bg-gray-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:shadow-[0_22px_55px_rgba(242,116,56,0.28)]',
  light:
    'border border-white/40 bg-white/90 text-gray-950 shadow-soft backdrop-blur hover:-translate-y-0.5 hover:border-primary hover:bg-white hover:text-primary',
  danger:
    'border border-rose-500 bg-rose-500 text-white hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-[0_18px_45px_rgba(244,63,94,0.22)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-12 px-5 py-3 text-sm',
  lg: 'min-h-14 px-7 py-3.5 text-base',
  icon: 'h-12 w-12 p-0',
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(baseButtonClass, variantClasses[variant], sizeClasses[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  )
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  )
}

type IconButtonProps = ButtonProps & {
  label: string
}

export function IconButton({
  label,
  variant = 'light',
  size = 'icon',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('shrink-0 rounded-full', className)}
      aria-label={label}
      title={props.title ?? label}
      {...props}
    />
  )
}
