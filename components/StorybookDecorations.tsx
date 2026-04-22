import {
  Bone,
  Dog,
  HeartHandshake,
  Package,
  PawPrint,
  ShieldCheck,
  Soup,
  Stethoscope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const decorations: Array<{
  icon: LucideIcon
  className: string
  iconClassName: string
}> = [
  {
    icon: Bone,
    className: 'left-[3%] top-[6%] h-14 w-14 rotate-[-8deg]',
    iconClassName: 'text-primary',
  },
  {
    icon: PawPrint,
    className: 'right-[5%] top-[14%] h-11 w-11 rotate-[12deg]',
    iconClassName: 'text-secondary',
  },
  {
    icon: Soup,
    className: 'left-[8%] top-[27%] h-12 w-12 rotate-[7deg]',
    iconClassName: 'text-sky-500',
  },
  {
    icon: Dog,
    className: 'right-[8%] top-[38%] h-16 w-16 rotate-[-10deg]',
    iconClassName: 'text-primary',
  },
  {
    icon: Package,
    className: 'left-[4%] top-[52%] h-11 w-11 rotate-[14deg]',
    iconClassName: 'text-secondary',
  },
  {
    icon: HeartHandshake,
    className: 'right-[4%] top-[63%] h-13 w-13 rotate-[-7deg]',
    iconClassName: 'text-primary',
  },
  {
    icon: Stethoscope,
    className: 'left-[7%] top-[76%] h-12 w-12 rotate-[9deg]',
    iconClassName: 'text-sky-500',
  },
  {
    icon: ShieldCheck,
    className: 'right-[9%] top-[88%] h-11 w-11 rotate-[-12deg]',
    iconClassName: 'text-secondary',
  },
]

export default function StorybookDecorations() {
  return (
    <div
      aria-hidden="true"
      className="storybook-decorations pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {decorations.map((decoration, index) => {
        const Icon = decoration.icon

        return (
          <span
            key={`${decoration.className}-${index}`}
            className={[
              'storybook-tile absolute z-0 flex items-center justify-center rounded-2xl border border-gray-100 bg-white/70 shadow-soft backdrop-blur-sm',
              decoration.className,
            ].join(' ')}
            style={{ animationDelay: `${index * 0.55}s` }}
          >
            <Icon className={`h-1/2 w-1/2 ${decoration.iconClassName}`} />
          </span>
        )
      })}
    </div>
  )
}
