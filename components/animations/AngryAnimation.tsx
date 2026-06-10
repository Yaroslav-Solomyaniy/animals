import LottieAnimation, { type AnimationSize } from './LottieAnimation'

type AngryAnimationProps = {
  className?: string
  size?: AnimationSize
  ariaLabel?: string
}

export default function AngryAnimation({className,
  size = 'md',
  ariaLabel = 'Angry animation',}: AngryAnimationProps) {
  return (
    <LottieAnimation
      src="/animation/angry.lottie"
      size={size}
      className={className}
      ariaLabel={ariaLabel}
    />
  )
}
