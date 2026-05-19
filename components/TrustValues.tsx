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
import {cardColors, color_mint, color_warm} from "@/contstants/colors";

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

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
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
            containerClassName={`lg:col-span-2 min-h-[430px] border-gray-200 ${color_warm.bg}`}
            className="flex h-full flex-col justify-between p-8 sm:p-10"
            beamColorFrom={color_warm.beamFrom}
            beamColorTo={color_warm.beamTo}
            beamSize={260}
          >
            <div className="relative z-10 max-w-2xl">
              <HeartHandshake className={`mb-8 h-12 w-12 ${color_warm.icon}`} />
              <h3
                className={`text-3xl leading-tight font-extrabold md:text-4xl ${color_warm.title}`}
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
            containerClassName={`min-h-[430px] border-gray-200 ${color_mint.bg}`}
            className="flex h-full flex-col justify-between p-8 sm:p-10"
            beamColorFrom={color_mint.beamFrom}
            beamColorTo={color_mint.beamTo}
            beamDelay={1.5}
            beamSize={190}
          >
            <div className="relative z-10">
              <Sparkles className={`mb-8 h-12 w-12 ${color_mint.icon}`} />
              <h3
                className={`text-3xl leading-tight font-extrabold ${color_mint.title}`}
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
