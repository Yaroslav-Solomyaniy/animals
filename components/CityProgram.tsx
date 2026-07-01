'use client'

import {
    ArrowRight,
    ClipboardCheck,
    HeartPulse,
    Home,
    type LucideIcon,
    PawPrint,
    RotateCcw,
    Shield,
    ShieldCheck,
    Stethoscope,
    Users,
} from 'lucide-react'
import {motion} from 'motion/react'

import {LinkButton} from '@/components/ui/Button'
import {SITE_NAME, SITE_ROUTES} from '@/lib/site-config'
import Section from '@/components/ui/Section'

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
    positionClassName: string
    iconClassName: string
    sizeClassName: string
}

// Base/sm/md sizes below are the original values — big, airy cards, fine
// because up to md the block is full-width single-column (plenty of room).
// `lg:` uses plain CSS percentages (of the wrapper's own box, set via h-*/
// max-w-* below), not fixed pixels. Once the 2-column grid kicks in at lg,
// this block's real column width isn't fixed — it's ~430px right at the
// 1024px edge, growing up to ~612px once the page hits its own max-width.
// A fixed lg px size either overlaps at the narrow end or looks small at the
// wide end; percentages scale continuously with whatever width the column
// actually has, at every point in that range, with no threshold to fall
// through (a compound container-query tier was tried here and didn't apply
// correctly — plain percentages are simpler and more reliable).
const cards: Array<Card> = [
    {
        icon: PawPrint,
        title: 'Адопція',
        text: 'Знайти дім',
        positionClassName:
            'top-0 left-0 rotate-[-7deg] bg-[#FFEDD5] md:top-0 md:left-5 lg:left-0 lg:rotate-[-8deg]',
        iconClassName: 'bg-white/90 text-primary',
        sizeClassName:
            'h-[124px] w-[181px] sm:h-[132px] sm:w-[190px] md:h-[200px] md:w-[350px] lg:h-[21%] lg:w-[43%]',
    },
    {
        icon: HeartPulse,
        title: 'Турбота',
        text: 'Лікування',
        positionClassName:
            'top-6 right-0 rotate-[6deg] bg-[#D8F0E4] md:top-0 md:right-5 lg:right-0',
        iconClassName: 'bg-white/90 text-[#2F7A5D]',
        sizeClassName:
            'h-[120px] w-[184px] sm:h-[126px] sm:w-[180px] md:h-[200px] md:w-[350px] lg:h-[20%] lg:w-[41%]',
    },
    {
        icon: ShieldCheck,
        title: 'Безпека',
        text: 'Гуманне місто',
        positionClassName:
            'top-[166px] left-0 rotate-[3deg] bg-[#F7E8E6] sm:top-[164px] md:top-[220px] md:left-5 lg:top-[35%] lg:left-0 lg:rotate-0',
        iconClassName: 'bg-[#DDF7EA] text-[#173F35]',
        sizeClassName:
            'h-[124px] w-[172px] sm:h-[146px] sm:w-[212px] md:h-[200px] md:w-[350px] lg:h-[23%] lg:w-[47%]',
    },
    {
        icon: ClipboardCheck,
        title: 'Контроль',
        text: 'Облік тварин',
        positionClassName:
            'top-[173px] right-0 rotate-[-7deg] bg-[#E9DFF7] sm:top-[220px] md:top-[215px] md:right-5 lg:top-[35%] lg:right-0',
        iconClassName: 'bg-white text-primary',
        sizeClassName:
            'h-[127px] w-[180px] sm:h-[132px] sm:w-[192px] md:h-[200px] md:w-[350px] lg:h-[21%] lg:w-[43%]',
    },
    {
        icon: Home,
        title: 'Прихисток',
        text: 'Щоденна опіка',
        positionClassName:
            'right-0 bottom-[12px] z-20 rotate-[7deg] bg-[#FCE7F3] sm:right-2 sm:bottom-[54px] md:right-5 md:bottom-[0px] lg:right-0 lg:bottom-[13%]',
        iconClassName: 'bg-white/90 text-rose-600',
        sizeClassName:
            'h-[125px] w-[185px] sm:h-[136px] sm:w-[200px] md:h-[200px] md:w-[350px] lg:h-[21%] lg:w-[43%]',
    },
    {
        icon: Users,
        title: 'Волонтери',
        text: 'Разом легше',
        positionClassName:
            'bottom-0 left-0 z-10 rotate-[-6deg] bg-[#FEF3C7] md:left-5 lg:left-0 lg:bottom-[13%]',
        iconClassName: 'bg-white/90 text-amber-600',
        sizeClassName:
            'h-[128px] w-[188px] sm:h-[150px] sm:w-[230px] md:h-[200px] md:w-[350px] lg:h-[24%] lg:w-[49%]',
    },
]

export default function CityProgram() {
    return (
        <Section id="services" className="bg-white py-5 sm:py-6 lg:py-16" innerClassName="grid items-center gap-10 md:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-x-14 lg:gap-y-0">
                <div className="relative order-2 lg:order-1 lg:row-span-2 lg:min-h-190">
                    <div
                        className="relative mx-auto h-115 max-w-85.75 sm:h-130 sm:max-w-130 md:h-170 md:max-w-3xl lg:h-190 lg:max-w-180">
                        {cards.map((card, index) => {
                            const Icon = card.icon

                            return (
                                <motion.div
                                    key={card.title}
                                    data-city-floating-card
                                    animate={{
                                        y: [0, index % 2 === 0 ? 8 : -8, 0],
                                        scale: [1, 0.985, 1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: index * 0.25,
                                        repeat: Infinity,
                                        repeatDelay: 1.5,
                                        ease: 'easeInOut',
                                    }}
                                    className={`absolute z-10 flex flex-col justify-between rounded-2xl border border-gray-100 p-3 shadow-[0_18px_45px_-34px_rgba(31,41,55,0.45)] sm:rounded-3xl sm:p-4 md:p-5 lg:p-4 ${card.sizeClassName} ${card.positionClassName}`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 sm:rounded-2xl md:h-12 md:w-12 lg:h-11 lg:w-11 ${card.iconClassName}`}
                                    >
                                        <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-5 lg:w-5"/>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase sm:text-xs">
                                            {card.title}
                                        </p>
                                        <p className="mt-1 text-lg leading-tight font-black text-text-main sm:text-xl md:text-2xl lg:text-2xl">
                                            {card.text}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <p className="mb-3 text-xs font-extrabold tracking-[0.14em] text-primary uppercase sm:text-sm">
                        Міська програма
                    </p>
                    <h2 className="mb-4 text-3xl font-extrabold leading-tight text-text-main sm:text-4xl md:text-5xl lg:mb-5">
                        Допомога безпритульним тваринам у Черкасах
                    </h2>
                    <div
                        className="mb-7 max-w-2xl space-y-3 text-base leading-7 text-gray-500 sm:text-lg sm:leading-8 lg:mb-8">
                        <p>
                            Вже понад 3 роки {SITE_NAME} на
                            базі Черкаської служби чистоти дарує тваринам надію на нове життя.
                        </p>
                        <p>
                            У притулку є просторі вольєри, регулярне харчування, медичний
                            догляд і щоденна турбота про чотирилапих.
                        </p>
                    </div>

                </div>

                <div className="order-3 lg:order-3 md:mt-5">
                    <div className="space-y-4 sm:space-y-5 md:grid md:grid-cols-2 md:gap-8 lg:block md:items-stretch">
                        {services.map((service) => {
                            const Icon = service.icon

                            return (
                                <div
                                    key={service.title}
                                    className="flex gap-3 border-b items-center border-gray-100 pb-4 last:border-b-0 last:pb-0 sm:gap-4 sm:pb-5 0 md:last:border-b md:h-full"
                                >
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary sm:h-12 sm:w-12">
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6"/>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="mb-1.5 text-lg font-extrabold text-text-main sm:mb-2 sm:text-xl">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                                            {service.text}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <p className="mt-6 max-w-2xl border-l-4 border-primary pl-4 text-sm font-bold leading-7 text-text-main sm:mt-7">
                        Гуманне ставлення до тварин - це ознака цивілізованого міста.
                    </p>

                    <LinkButton
                        href={SITE_ROUTES.services}
                        variant="outline"
                        className="mt-7 h-auto w-full justify-center whitespace-normal rounded-xl px-4 py-3 text-center text-sm sm:w-fit sm:px-5"
                    >
                        Дізнатись більше про комерційні послуги
                        <ArrowRight className="h-4 w-4"/>
                    </LinkButton>
                </div>
        </Section>
    )
}
