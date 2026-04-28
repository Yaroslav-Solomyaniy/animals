import Link from 'next/link'
import type {AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode} from 'react'

import {cn} from '@/lib/utils'

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
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]'

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white border border-primary hover:bg-primary/90 shadow-sm hover:shadow-md',

    secondary:
        'bg-white text-secondary border border-gray-200 hover:bg-gray-50 shadow-sm',

    outline:
        'bg-transparent text-primary border border-primary/40 hover:bg-primary/10',

    ghost:
        'bg-transparent text-gray-600 border border-transparent hover:bg-gray-100',

    dark:
        'bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 shadow-sm',

    light:
        'bg-white/80 backdrop-blur text-gray-900 border border-gray-200 hover:bg-white shadow-sm',

    danger:
        'bg-rose-500 text-white border border-rose-500 hover:bg-rose-600 shadow-sm',
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base',
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
            className={buttonClassName({variant, size, className})}
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
            className={buttonClassName({variant, size, className})}
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
            className={cn('rounded-full', className)}
            aria-label={label}
            title={props.title ?? label}
            {...props}
        />
    )
}