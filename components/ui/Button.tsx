import Link from 'next/link'
import { Children, isValidElement } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

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
  'group inline-flex min-w-0 select-none items-center justify-center gap-2 overflow-hidden rounded-md border font-extrabold leading-none transition-[transform,border-color,background-color,color,box-shadow] duration-300 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 active:scale-[0.98] [&>svg]:shrink-0'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-white shadow-sm shadow-primary/20 hover:border-orange-600 hover:bg-orange-600 hover:shadow-md hover:shadow-primary/25 focus-visible:ring-primary/25',

  secondary:
    'border-gray-200 bg-white text-gray-900 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 hover:shadow-md focus-visible:ring-gray-400/25',

  outline:
    'border-primary/45 bg-transparent text-primary shadow-none hover:border-primary hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm focus-visible:ring-primary/25',

  ghost:
    'border-transparent bg-transparent text-gray-600 shadow-none hover:border-transparent hover:bg-gray-100 hover:text-gray-950 hover:shadow-none focus-visible:ring-gray-400/25',

  dark:
    'border-gray-900 bg-gray-950 text-white shadow-sm hover:border-gray-800 hover:bg-gray-900 hover:shadow-md focus-visible:ring-gray-700/35',

  light:
    'border-white/70 bg-white/85 text-gray-900 shadow-sm backdrop-blur hover:border-white hover:bg-white hover:text-gray-950 hover:shadow-md focus-visible:ring-gray-400/25',

  danger:
    'border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/20 hover:border-rose-600 hover:bg-rose-600 hover:shadow-md hover:shadow-rose-500/25 focus-visible:ring-rose-500/25',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-base',
  icon: 'h-11 w-11 p-0',
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

function hasIcon(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement<{ children?: ReactNode; className?: string }>(child)) {
      return false
    }

    if (child.type === 'svg') {
      return true
    }

    const className = child.props.className

    if (
      typeof child.type !== 'string' &&
      typeof className === 'string' &&
      /\bh-(?:3|3\.5|4|5|6|7|8)\b/.test(className) &&
      /\bw-(?:3|3\.5|4|5|6|7|8)\b/.test(className)
    ) {
      return true
    }

    return hasIcon(child.props.children)
  })
}

function withButtonIcon(children: ReactNode, size: ButtonSize, showIcon: boolean) {
  if (!showIcon || size === 'icon' || hasIcon(children)) {
    return children
  }

  return (
    <>
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  showIcon?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  showIcon = true,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {withButtonIcon(children, size, showIcon)}
    </button>
  )
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  showIcon?: boolean
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  showIcon = true,
  ...props
}: LinkButtonProps) {
  const rel = props.target === '_blank' && !props.rel ? 'noopener noreferrer' : props.rel
  const isAppRoute = href.startsWith('/') || href.startsWith('#')
  const sharedProps = {
    className: buttonClassName({ variant, size, className }),
    rel,
    ...props,
  }

  if (!isAppRoute) {
    return (
      <a href={href} {...sharedProps}>
        {withButtonIcon(children, size, showIcon)}
      </a>
    )
  }

  return (
    <Link href={href} {...sharedProps}>
      {withButtonIcon(children, size, showIcon)}
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
      className={cn('rounded-full', className)}
      aria-label={label}
      title={props.title ?? label}
      showIcon={false}
      {...props}
    />
  )
}
