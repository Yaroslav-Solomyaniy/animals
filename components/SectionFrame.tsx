import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionFrameProps<T extends ElementType = 'div'> = {
  as?: T
  children: ReactNode
  className?: string
}

export default function SectionFrame<T extends ElementType = 'div'>({
  as,
  children,
  className,
}: SectionFrameProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={cn(
        'section-frame relative isolate rounded-[36px]',
        className,
      )}
    >
      {children}
    </Component>
  )
}
