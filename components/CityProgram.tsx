'use client'
import {
  ArrowRight, ClipboardCheck,
  HeartPulse, Home, LucideIcon, PawPrint,
  RotateCcw,
  Shield, ShieldCheck,
  Stethoscope, Users,
} from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { motion } from "framer-motion"

const services = [
  {
    icon: Shield,
    title: 'Відлов',
    text: 'Гуманний відлов безпритульних тварин без шкоди для людей і тварин.',
  },
  {
    icon: Stethoscope,
    title: 'Стерилізація',
    text: 'Медична операція для стабілізації популяції безпритульних собак.',
  },
  {
    icon: HeartPulse,
    title: 'Вакцинація',
    text: 'Захист від сказу та інших хвороб, медичний догляд і спостереження.',
  },
  {
    icon: RotateCcw,
    title: 'Повернення',
    text: 'Кліпсування та випуск у безпечне середовище після процедур.',
  },
]

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
    iconClassName: 'bg-lime-50 text-purple',
    sizeClassName: 'h-[178px] w-[250px] sm:h-[190px] sm:w-[280px]',
  },
  {
    icon: HeartPulse,
    title: 'Турбота',
    text: 'Лікування',
    className: 'top-8 right-0 rotate-[6deg] bg-cyan-50',
    iconClassName: 'bg-primary/10 text-primary',
    sizeClassName: 'h-[160px] w-[235px] sm:h-[176px] sm:w-[255px]',
  },
  {
    icon: ShieldCheck,
    title: 'Безпека',
    text: 'Гуманне місто',
    className: 'top-[238px] left-6 rotate-[4deg] bg-red-50',
    iconClassName: 'bg-emerald-100 text-black',
    sizeClassName: 'h-[190px] w-[270px] sm:h-[205px] sm:w-[300px]',
  },
  {
    icon: ClipboardCheck,
    title: 'Контроль',
    text: 'Облік тварин',
    className: 'top-[285px] right-0 rotate-[-7deg] bg-purple-100',
    iconClassName: 'bg-white text-primary',
    sizeClassName: 'h-[165px] w-[245px] sm:h-[180px] sm:w-[270px]',
  },
  {
    icon: Home,
    title: 'Прихисток',
    text: 'Щоденна опіка',
    className: 'right-[20px] bottom-[50px] z-20 rotate-[7deg] bg-blue-50',
    iconClassName: 'bg-green-100 text-text-main',
    sizeClassName: 'h-[170px] w-[250px] sm:h-[188px] sm:w-[275px]',
  },
  {
    icon: Users,
    title: 'Волонтери',
    text: 'Разом легше',
    className: 'bottom-0 left-0 z-10 rotate-[-6deg] bg-yellow-50',
    iconClassName: 'bg-primary/10 text-primary',
    sizeClassName: 'h-[192px] w-[280px] sm:h-[220px] sm:w-[330px]',
  },
]

export default function CityProgram() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto grid max-w-336 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        {/*======================= Left Side ===============================*/}
        <div className="relative mt-12 min-h-190 lg:mt-0">
          <div className="relative mx-auto h-190 max-w-180">
            {cards.map((card, index) => {
              const Icon = card.icon

              return (
                  <motion.div
                      key={card.title}
                      animate={{
                        y: [0, 20, 0],
                        scale: [1, 0.955, 1],
                      }}
                      transition={{
                        duration: 3,
                        delay: index * 0.25,
                        repeat: Infinity,
                        repeatDelay: 1.5,
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


        {/*======================= Right Side ===============================*/}
        <div>
          <p className="mb-3 text-sm font-extrabold tracking-wider text-primary uppercase">
            Міська програма
          </p>
          <h2 className="mb-5 text-4xl font-extrabold leading-tight text-text-main md:text-5xl">
            Допомога безпритульним тваринам у Черкасах
          </h2>
          <div className="mb-8 max-w-2xl space-y-3 text-lg leading-8 text-gray-500">
            <p>
              Вже понад 3 роки Центр надання допомоги безпритульним тваринам на
              базі Черкаської служби чистоти дарує тваринам надію на нове життя.
            </p>
            <p>
              У притулку є просторі вольєри, регулярне харчування, медичний
              догляд і щоденна турбота про чотирилапих.
            </p>
          </div>

          <div className="space-y-5">
            {services.map((service) => {
              const Icon = service.icon

              return (
                  <div
                      key={service.title}
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="mb-2 text-xl font-extrabold text-text-main">
                        {service.title}
                      </h3>
                      <p className="leading-7 text-gray-500">{service.text}</p>
                    </div>
                  </div>
              )
            })}
          </div>

          <p className="mt-7 max-w-2xl border-l-4 border-primary pl-4 text-sm font-bold leading-7 text-text-main">
            Гуманне ставлення до тварин - це ознака цивілізованого міста.
          </p>


          <LinkButton
            href="/services"
            variant="outline"
            className="mt-7"
          >
            Детальніше про всі послуги які надає центр
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
