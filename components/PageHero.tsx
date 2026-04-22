import type { LucideIcon } from 'lucide-react'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  children?: React.ReactNode
  actions?: React.ReactNode
  align?: 'center' | 'split'
}

export default function PageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
  actions,
  align = 'split',
}: PageHeroProps) {
  const isCentered = align === 'center'

  return (
    <section className="relative isolate overflow-hidden border-b border-gray-100/70 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,245,0.58),rgba(249,250,251,0.28))]" />
      <HeroTile className="left-6 top-10 hidden h-16 w-16 rotate-[-8deg] rounded-2xl border-orange-100 bg-white/75 sm:block" />
      <HeroTile className="right-10 top-20 hidden h-12 w-12 rotate-[10deg] rounded-xl border-emerald-100 bg-white/75 lg:block [animation-delay:900ms]" />
      <HeroTile className="bottom-10 left-[12%] hidden h-10 w-10 rotate-[16deg] rounded-xl border-sky-100 bg-white/75 md:block [animation-delay:1500ms]" />
      <HeroTile className="bottom-16 right-[18%] hidden h-11 w-11 rotate-[-12deg] rounded-xl border-orange-100 bg-white/75 xl:block [animation-delay:2200ms]" />

      <div
        className={[
          'relative mx-auto max-w-7xl',
          isCentered
            ? 'text-center'
            : 'grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]',
        ].join(' ')}
      >
        <div className={isCentered ? 'mx-auto max-w-4xl' : 'max-w-3xl'}>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-[0_12px_40px_rgba(249,115,22,0.08)]">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </span>
          <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p
            className={[
              'mt-6 text-lg leading-8 text-gray-600 sm:text-xl',
              isCentered ? 'mx-auto max-w-3xl' : 'max-w-2xl',
            ].join(' ')}
          >
            {description}
          </p>
          {actions && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions}
            </div>
          )}
        </div>

        {children && !isCentered && (
          <div className="relative">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

function HeroTile({ className }: { className: string }) {
  return (
    <span
      className={`storybook-tile pointer-events-none absolute z-0 border shadow-soft ${className}`}
    />
  )
}
