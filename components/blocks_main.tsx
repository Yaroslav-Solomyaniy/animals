import {
  ClipboardCheck,
  HeartPulse,
  Home,
  PawPrint,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'

type Card = {
  icon: LucideIcon
  title: string
  text: string
  className: string
  iconClassName: string
  sizeClassName: string
}

const cards: Array<Card> = [
  {
    icon: PawPrint,
    title: 'Адопція',
    text: 'Знайти дім',
    className: 'top-0 left-0 rotate-[-8deg] bg-white',
    iconClassName: 'bg-primary/10 text-primary',
    sizeClassName: 'h-[178px] w-[250px] sm:h-[190px] sm:w-[280px]',
  },
  {
    icon: HeartPulse,
    title: 'Турбота',
    text: 'Лікування',
    className: 'top-8 right-0 rotate-[6deg] bg-[#FFF8F2]',
    iconClassName: 'bg-secondary/10 text-secondary',
    sizeClassName: 'h-[160px] w-[235px] sm:h-[176px] sm:w-[255px]',
  },
  {
    icon: ShieldCheck,
    title: 'Безпека',
    text: 'Гуманне місто',
    className: 'top-[238px] left-6 rotate-[4deg] bg-[#F1FFF8]',
    iconClassName: 'bg-primary-second/20 text-secondary',
    sizeClassName: 'h-[190px] w-[270px] sm:h-[205px] sm:w-[300px]',
  },
  {
    icon: ClipboardCheck,
    title: 'Контроль',
    text: 'Облік тварин',
    className: 'top-[285px] right-0 rotate-[-7deg] bg-white',
    iconClassName: 'bg-orange-50 text-primary',
    sizeClassName: 'h-[165px] w-[245px] sm:h-[180px] sm:w-[270px]',
  },
  {
    icon: Home,
    title: 'Прихисток',
    text: 'Щоденна опіка',
    className: 'right-[20px] bottom-[50px] z-20 rotate-[7deg] bg-white',
    iconClassName: 'bg-gray-100 text-text-main',
    sizeClassName: 'h-[170px] w-[250px] sm:h-[188px] sm:w-[275px]',
  },
  {
    icon: Users,
    title: 'Волонтери',
    text: 'Разом легше',
    className: 'bottom-0 left-0 z-10 rotate-[-6deg] bg-[#FFF8F2]',
    iconClassName: 'bg-primary/10 text-primary',
    sizeClassName: 'h-[192px] w-[280px] sm:h-[220px] sm:w-[330px]',
  },
]

export default function BlocksMain() {
  return (
    <div className="relative mt-12 min-h-190 lg:mt-0">
      <div className="relative mx-auto h-190 max-w-180">
        {cards.map((card, index) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              animate={{
                y: [0, 10, 0],
                scale: [1, 0.985, 1],
              }}
              transition={{
                duration: 2,
                delay: index * 0.25,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: 'easeInOut',
              }}
              className={`absolute z-10 flex flex-col justify-between rounded-3xl border border-gray-100 p-5 shadow-[0_18px_45px_-34px_rgba(31,41,55,0.45)] ${card.sizeClassName} ${card.className}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClassName}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {card.title}
                </p>
                <p className="mt-1 text-2xl leading-tight font-black text-text-main sm:text-[28px]">
                  {card.text}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
