import LottieAnimation, { type AnimationSize } from './LottieAnimation'

type PuppyAnimationProps = {
  className?: string
  size?: AnimationSize
  ariaLabel?: string
}

export default function PuppyAnimation({
  className,
  size = 'md',
  ariaLabel = 'Puppy animation',
}: PuppyAnimationProps) {
  return (
    <LottieAnimation
      src="/animation/puppy.lottie"
      size={size}
      className={className}
      ariaLabel={ariaLabel}
    />
  )
}
