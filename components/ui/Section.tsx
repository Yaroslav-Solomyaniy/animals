import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type SectionProps<T extends ElementType = 'section'> = {
  children: ReactNode
  className?: string
  innerClassName?: string
  contained?: boolean
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'className' | 'children'>

export default function Section<T extends ElementType = 'section'>({
  children,
  className,
  innerClassName,
  contained = true,
  as,
  ...rest
}: SectionProps<T>) {
  const Tag = (as ?? 'section') as ElementType

  if (contained) {
    return (
      <Tag className={cn('px-8', className)} {...rest}>
        <div className={cn('mx-auto max-w-336', innerClassName)}>{children}</div>
      </Tag>
    )
  }

  return (
    <Tag className={cn('mx-auto max-w-336 px-8', className)} {...rest}>
      {children}
    </Tag>
  )
}
