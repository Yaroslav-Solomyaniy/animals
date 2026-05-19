'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { cn } from '@/lib/utils'

export type AnimationSize = 'sm' | 'md' | 'lg' | 'xl' | 'huge' | number

const animationSizePixels: Record<Exclude<AnimationSize, number>, number> = {
  sm: 128,
  md: 176,
  lg: 240,
  xl: 320,
  huge: 420,
}

type LottieAnimationProps = {
  ariaLabel: string
  className?: string
  size?: AnimationSize
  src: string
}

export default function LottieAnimation({
  ariaLabel,
  className,
  size = 'md',
  src,
}: LottieAnimationProps) {
  const pixelSize = typeof size === 'number' ? size : animationSizePixels[size]

  return (
    <div
      className={cn('mx-auto shrink-0 leading-none', className)}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <DotLottieReact
        src={src}
        loop
        autoplay
        role="img"
        aria-label={ariaLabel}
        className="h-full w-full"
      />
    </div>
  )
}
