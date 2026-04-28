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
  'inline-flex min-w-0 select-none items-center justify-center gap-2 overflow-hidden rounded-xl border font-extrabold leading-none transition-[transform,border-color,background-color,color,box-shadow,background-size] duration-300 ease-out [background-image:linear-gradient(90deg,var(--button-fill),var(--button-fill))] [background-position:left_center] [background-repeat:no-repeat] [background-size:0%_100%] hover:-translate-y-0.5 hover:[background-size:100%_100%] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 disabled:[background-size:0%_100%] active:translate-y-0 active:scale-[0.98] [&>svg]:shrink-0'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-white shadow-sm shadow-primary/20 [--button-fill:#ea580c] hover:border-orange-600 hover:text-white hover:shadow-md hover:shadow-primary/25 focus-visible:ring-primary/25',

  secondary:
    'border-gray-200 bg-white text-gray-900 shadow-sm [--button-fill:#f27438] hover:border-primary hover:text-white hover:shadow-md hover:shadow-primary/20 focus-visible:ring-gray-400/25',

  outline:
    'border-primary/45 bg-white text-primary shadow-sm [--button-fill:#f27438] hover:border-primary hover:text-white hover:shadow-md hover:shadow-primary/20 focus-visible:ring-primary/25',

  ghost:
    'border-transparent bg-transparent text-gray-600 shadow-none [--button-fill:rgba(17,24,39,0.08)] hover:border-gray-200 hover:text-gray-950 focus-visible:ring-gray-400/25',

  dark:
    'border-gray-900 bg-gray-950 text-white shadow-sm [--button-fill:#f27438] hover:border-primary hover:text-white hover:shadow-md hover:shadow-primary/20 focus-visible:ring-gray-700/35',

  light:
    'border-white/70 bg-white/90 text-gray-900 shadow-sm backdrop-blur [--button-fill:rgba(242,116,56,0.12)] hover:border-primary/30 hover:text-gray-950 hover:shadow-md focus-visible:ring-gray-400/25',

  danger:
    'border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/20 [--button-fill:#e11d48] hover:border-rose-600 hover:text-white hover:shadow-md hover:shadow-rose-500/25 focus-visible:ring-rose-500/25',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-12 px-4 text-sm',
  md: 'h-12 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
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
  return cn(baseButtonClass, variantClasses[variant], className, sizeClasses[size])
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
