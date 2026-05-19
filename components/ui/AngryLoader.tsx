import { AngryAnimation } from '@/components/animations'
import { cn } from '@/lib/utils'

type AngryLoaderProps = {
  className?: string
  message?: string
  overlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'huge' | number
  fullscreen?: boolean
}

export default function AngryLoader({
  className,
  message = 'Завантажуємо...',
  overlay = false,
  size = 'huge',
  fullscreen = false,
}: AngryLoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-white px-4',
        fullscreen && 'min-h-screen',
        overlay && 'fixed inset-0 z-[2147483646]',
        !fullscreen && !overlay && 'min-h-[60vh]',
        className
      )}
      aria-live="polite"
      aria-label={message}
    >
      <div className="grid justify-items-center gap-3 text-center">
        <AngryAnimation size={size} ariaLabel={message} />
        <p className="m-0 text-sm font-extrabold text-gray-600 sm:text-base">
          {message}
        </p>
      </div>
    </div>
  )
}
