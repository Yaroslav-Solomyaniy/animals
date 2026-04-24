import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { WobbleCard } from '@/components/ui/wobble-card'

const cardColors = {
  warm: {
    bg: 'bg-[#fff7ed]',
    icon: 'text-primary',
    title: 'text-[#9a3412]',
    beamFrom: '#f97316',
    beamTo: '#fb7185',
  },
  mint: {
    bg: 'bg-[#ecfdf5]',
    icon: 'text-emerald-600',
    title: 'text-[#047857]',
    beamFrom: '#34d399',
    beamTo: '#14b8a6',
  },
  blue: {
    bg: 'bg-[#eff6ff]',
    icon: 'text-sky-600',
    title: 'text-[#1d4ed8]',
    beamFrom: '#38bdf8',
    beamTo: '#6366f1',
  },
  rose: {
    bg: 'bg-[#fff1f2]',
    icon: 'text-rose-500',
    title: 'text-[#be123c]',
    beamFrom: '#fb7185',
    beamTo: '#f472b6',
  },
  violet: {
    bg: 'bg-[#f5f3ff]',
    icon: 'text-violet-600',
    title: 'text-[#6d28d9]',
    beamFrom: '#a78bfa',
    beamTo: '#38bdf8',
  },
} as const

type SmallCard = {
  icon: LucideIcon
  title: string
  text: string
  color: keyof typeof cardColors
}

const smallCards: Array<SmallCard> = [
  {
    icon: ShieldCheck,
    title: 'Міська програма',
    text: 'Стабілізація популяції безпритульних собак без шкоди для людей і тварин.',
    color: 'blue',
  },
  {
    icon: Stethoscope,
    title: 'Професіоналізм',
    text: 'Якісний ветеринарний догляд і відповідальний підхід до кожної тварини.',
    color: 'rose',
  },
  {
    icon: Users,
    title: 'Спільнота',
    text: 'Об’єднуємо людей, які хочуть допомагати тваринам і місту.',
    color: 'violet',
  },
]

export default function TrustValues() {
  const warm = cardColors.warm
  const mint = cardColors.mint

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-extrabold tracking-wider text-primary uppercase">
            Відкрита допомога
          </p>
          <h2 className="text-4xl leading-tight font-extrabold text-text-main md:text-6xl">
            Турбота без зайвого шуму
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500">
            Кілька простих принципів, які тримають роботу центру людяною,
            відкритою та корисною для тварин і міста.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
          <WobbleCard
            containerClassName={`lg:col-span-2 min-h-[430px] border-gray-200 ${warm.bg}`}
            className="flex h-full flex-col justify-between p-8 sm:p-10"
            beamColorFrom={warm.beamFrom}
            beamColorTo={warm.beamTo}
            beamSize={260}
          >
            <div className="relative z-10 max-w-2xl">
              <HeartHandshake className={`mb-8 h-12 w-12 ${warm.icon}`} />
              <h3
                className={`text-3xl leading-tight font-extrabold md:text-4xl ${warm.title}`}
              >
                Черкаська служба чистоти підтримує центр щодня
              </h3>
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                Підприємство забезпечує роботу центру, закупівлю кормів,
                ветеринарних препаратів, медикаментів і всього необхідного для
                утримання тварин.
              </p>
            </div>

            <a
              href="/donate"
              className="relative z-10 mt-10 inline-flex w-fit items-center gap-2 rounded-2xl border border-primary bg-primary px-6 py-3.5 font-extrabold text-white transition-colors hover:bg-white hover:text-primary focus-visible:bg-white focus-visible:text-primary focus-visible:outline-none"
            >
              Підтримати центр
              <ArrowRight className="h-4 w-4" />
            </a>
          </WobbleCard>

          <WobbleCard
            containerClassName={`min-h-[430px] border-gray-200 ${mint.bg}`}
            className="flex h-full flex-col justify-between p-8 sm:p-10"
            beamColorFrom={mint.beamFrom}
            beamColorTo={mint.beamTo}
            beamDelay={1.5}
            beamSize={190}
          >
            <div className="relative z-10">
              <Sparkles className={`mb-8 h-12 w-12 ${mint.icon}`} />
              <h3
                className={`text-3xl leading-tight font-extrabold ${mint.title}`}
              >
                Місія і бачення
              </h3>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Рятувати безпритульних тварин, лікувати, створювати комфортні
                умови та наближати Черкаси до міста, де кожна тварина має дім.
              </p>
            </div>

            <p className="relative z-10 mt-10 text-sm font-extrabold tracking-wider text-gray-400 uppercase">
              Кожен має право на гідне життя
            </p>
          </WobbleCard>

          {smallCards.map((card, index) => {
            const colors = cardColors[card.color]
            const Icon = card.icon

            return (
              <WobbleCard
                key={card.title}
                containerClassName={`min-h-[260px] border-gray-200 ${colors.bg}`}
                className="p-8 sm:p-9"
                beamColorFrom={colors.beamFrom}
                beamColorTo={colors.beamTo}
                beamDelay={index * 1.1}
                beamSize={140}
              >
                <div className="relative z-10">
                  <Icon className={`mb-7 h-8 w-8 ${colors.icon}`} />
                  <h3
                    className={`mb-3 text-2xl font-extrabold ${colors.title}`}
                  >
                    {card.title}
                  </h3>
                  <p className="leading-7 text-gray-600">{card.text}</p>
                </div>
              </WobbleCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
