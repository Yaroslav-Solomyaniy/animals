import { cn } from '@/lib/utils'

export const SoftYellowGlow = ({ className }: { className?: string }) => (
  <div className={cn('absolute inset-0 z-0 pointer-events-none', className)}>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #FFF991 0%, transparent 70%)',
        opacity: 0.6,
        mixBlendMode: 'multiply',
      }}
    />
  </div>
)

export const DiagonalGrid = ({ className }: { className?: string }) => (
  <div
    className={cn('absolute inset-0 z-0 pointer-events-none', className)}
    style={{
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
      `,
      backgroundSize: '40px 40px',
    }}
  />
)
