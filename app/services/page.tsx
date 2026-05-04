'use client'

import {
    Activity,
    ArrowRight,
    BadgeCheck,
    CalendarCheck,
    CheckCircle2,
    ClipboardCheck,
    HeartPulse, MessageCircle,
    Microscope,
    PawPrint,
    Phone,
    Shield,
    Sparkles,
    Stethoscope,
    Syringe,
} from 'lucide-react'
import {motion} from 'motion/react'

import {BorderBeam} from '@/components/ui/border-beam'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import Stack from '@/components/ui/Stack'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { LinkButton } from '@/components/ui/Button'


const services = [
    {
        icon: Stethoscope,
        title: 'Первинний прийом і терапія',
        description:
            'Клінічний огляд, збір анамнезу, оцінка загального стану та складання плану лікування.',
        features: [
            'Аускультація серця та легень',
            'Оцінка слизових, шкіри, шерсті та лімфовузлів',
            'Вимірювання температури і базових показників',
            'Призначення терапії та контроль динаміки',
        ],
        tone: 'border-sky-100 bg-sky-50/70 text-sky-700',
        beamFrom: '#38bdf8',
        beamTo: '#f97316',
    },
    {
        icon: Microscope,
        title: 'Діагностика та обстеження',
        description:
            'Сучасний підхід до діагностики: від первинного огляду до інструментальних і лабораторних досліджень.',
        features: [
            'Базова лабораторна діагностика',
            'Оцінка стану перед операціями',
            'Контроль після лікування',
            'Підбір подальшого маршруту обстеження',
        ],
        tone: 'border-violet-100 bg-violet-50/70 text-violet-700',
        beamFrom: '#a78bfa',
        beamTo: '#38bdf8',
    },
    {
        icon: Syringe,
        title: 'Вакцинація і профілактика',
        description:
            'Профілактичні щеплення, обробки від паразитів і формування індивідуального графіка догляду.',
        features: [
            'Вакцинація від сказу та інфекцій',
            'Дегельмінтизація та протипаразитарний захист',
            'Підбір графіка ревакцинації',
            'Консультація щодо домашнього догляду',
        ],
        tone: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
        beamFrom: '#22c55e',
        beamTo: '#38bdf8',
    },
    {
        icon: HeartPulse,
        title: 'Хірургія та стерилізація',
        description:
            'Планові оперативні втручання, стерилізація, кастрація та післяопераційний супровід.',
        features: [
            'Передопераційний огляд',
            'Стерильні умови та сучасний інструментарій',
            'Контроль стану після наркозу',
            'Рекомендації з реабілітації вдома',
        ],
        tone: 'border-orange-100 bg-orange-50/70 text-orange-700',
        beamFrom: '#fb923c',
        beamTo: '#f43f5e',
    },
    {
        icon: ClipboardCheck,
        title: 'Документи і супровід',
        description:
            'Допомога з ветеринарними записами, консультаціями після усиновлення та планом профілактики.',
        features: [
            'Ветеринарні рекомендації після прийому',
            'Пам’ятка з догляду за твариною',
            'Підготовка до вакцинації або операції',
            'Пояснення діагнозу людською мовою',
        ],
        tone: 'border-rose-100 bg-rose-50/70 text-rose-700',
        beamFrom: '#fb7185',
        beamTo: '#f97316',
    },
    {
        icon: Shield,
        title: 'Гуманний відлов і транспортування',
        description:
            'Безпечна робота з безпритульними тваринами, транспортування до центру та первинний ветогляд.',
        features: [
            'Гуманні методи відлову',
            'Безпечна фіксація тварини',
            'Транспортування до центру',
            'Оцінка стану після прибуття',
        ],
        tone: 'border-cyan-100 bg-cyan-50/70 text-cyan-700',
        beamFrom: '#06b6d4',
        beamTo: '#22c55e',
    },
]

const heroSteps = [
    {
        icon: Stethoscope,
        label: 'Огляд',
        title: 'Уважний прийом',
        text: 'Починаємо з детального клінічного огляду, збору анамнезу та аналізу ваших скарг. Пояснюємо кожен крок і одразу даємо зрозумілі, практичні рекомендації без складних термінів.',
        className: 'lg:rotate-[2deg] lg:translate-y-8',
        color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
        icon: Microscope,
        label: 'Діагностика',
        title: 'Сучасне обладнання',
        text: 'Використовуємо сучасні методи діагностики для точного визначення стану. Контролюємо динаміку, за потреби призначаємо додаткові обстеження та готуємо до процедур.',
        className: 'lg:rotate-[3deg]',
        color: 'text-violet-600 bg-violet-50 border-violet-100',
    },
    {
        icon: HeartPulse,
        label: 'Лікування',
        title: 'План і супровід',
        text: 'Формуємо індивідуальний план лікування та супроводжуємо на кожному етапі. Пояснюємо, що саме робимо, навіщо це потрібно і як правильно відновлюватись після процедур.',
        className: 'lg:rotate-[4deg] lg:translate-y-12',
        color: 'text-orange-600 bg-orange-50 border-orange-100',
    },
    {
        icon: MessageCircle,
        label: 'Підтримка',
        title: 'Завжди на звʼязку',
        text: 'Ми поруч не лише під час прийому, а й після нього. Відповідаємо на запитання, допомагаємо розібратись із рекомендаціями та коригуємо лікування за потреби. Ви завжди можете звернутись і отримати підтримку.',
        className: 'lg:rotate-[20deg] lg:translate-y-1',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    }

]

const vetDirections = [
    'Клінічний огляд',
    'Терапевтичне лікування',
    'Лабораторна діагностика',
    'Вакцинація',
    'Стерилізація',
    'Кастрація',
    'Обробка від паразитів',
    'Чіпування',
    'Післяопераційний догляд',
    'Реабілітація після травм',
    'Консультація з харчування',
    'Підготовка до усиновлення',
]

const additionalServices = [
    {
        icon: PawPrint,
        title: 'Для домашніх тварин',
        text: 'Комерційні ветеринарні послуги для собак і котів: огляд, профілактика, вакцинація, чіпування та консультації.',
        items: ['Собаки', 'Коти', 'Плановий догляд'],
        accent: 'bg-orange-50 text-orange-700 border-orange-100',
    },
    {
        icon: ClipboardCheck,
        title: 'Перед операцією',
        text: 'Оцінюємо стан тварини, пояснюємо ризики, готуємо до процедури та даємо рекомендації власнику.',
        items: ['Огляд', 'Підготовка', 'Рекомендації'],
        accent: 'bg-sky-50 text-sky-700 border-sky-100',
    },
    {
        icon: HeartPulse,
        title: 'Після лікування',
        text: 'Допомагаємо пройти відновлення: контроль динаміки, корекція терапії, догляд за швами та режимом.',
        items: ['Контроль', 'Реабілітація', 'Супровід'],
        accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
        icon: CalendarCheck,
        title: 'Профілактика',
        text: 'Підбираємо графік вакцинації, обробок від паразитів і план регулярного догляду за твариною.',
        items: ['Вакцини', 'Паразити', 'План догляду'],
        accent: 'bg-violet-50 text-violet-700 border-violet-100',
    },
]

export default function ServicesPage() {
    return (
        <main className="storybook-bg min-h-screen text-gray-950">
            <StorybookDecorations/>
            <PageHero
                eyebrow="Ветеринарні та комерційні послуги"
                title="Професійна допомога для ваших тварин"
                description="У центрі можна отримати не лише допомогу для безпритульних тварин, а й комерційні ветеринарні послуги для домашніх улюбленців: огляд, профілактику, вакцинацію, стерилізацію, чіпування та супровід після процедур."
                icon={BadgeCheck}
                actions={
                    <>
                        <LinkButton
                            href="/contacts"
                            size="lg"
                        >
                            Записатися на послугу
                            <ArrowRight className="h-5 w-5"/>
                        </LinkButton>
                        <LinkButton
                            href="tel:+380932966097"
                            variant="outline"
                            size="lg"
                        >
                            <Phone className="h-5 w-5"/>
                            +38 (093) 296-60-97
                        </LinkButton>
                    </>
                }
            >
                <Stack
                    className="max-lg:mt-8 max-lg:max-w-[360px] sm:max-lg:max-w-[430px] lg:min-h-93 lg:-translate-x-36 xl:-translate-x-52 2xl:-translate-x-44"
                    items={heroSteps.map((step) => {
                        const Icon = step.icon
                        return {
                            id: step.title,
                            content: (
                                <>
                  <span
                      className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl border ${step.color}`}
                  >
                    <Icon className="h-6 w-6"/>
                  </span>
                                    <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-300">
                                        {step.label}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black text-gray-950">
                                        {step.title}
                                    </h2>
                                    <p className="mt-4 text-sm leading-6 text-gray-600">
                                        {step.text}
                                    </p>
                                </>
                            ),
                        }
                    })}
                />
            </PageHero>

            <section className="px-4 py-16 sm:px-6 lg:px-8">
                <SectionFrame className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    <div className="mb-10 border-b border-orange-100/70 pb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                            Напрямки роботи
                        </p>
                        <h2 className="mt-3 max-w-3xl text-3xl font-black text-gray-950 sm:text-4xl">
                            Ветпослуги, які закривають щоденні потреби тварини
                        </h2>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {services.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <motion.article
                                    key={service.title}
                                    initial={{opacity: 0, y: 24}}
                                    whileInView={{opacity: 1, y: 0}}
                                    viewport={{once: true, margin: '-80px'}}
                                    transition={{duration: 0.45, delay: index * 0.06}}
                                    className="group relative flex overflow-hidden rounded-[32px] border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8"
                                >
                                    <BorderBeam
                                        size={150}
                                        duration={8}
                                        delay={index * 0.8}
                                        colorFrom={service.beamFrom}
                                        colorTo={service.beamTo}
                                        borderWidth={2}
                                    />
                                    <div className="relative z-10 flex w-full flex-col">
                    <span
                        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${service.tone}`}
                    >
                      <Icon className="h-8 w-8"/>
                    </span>
                                        <h2 className="text-2xl font-black text-gray-950">
                                            {service.title}
                                        </h2>
                                        <p className="mt-3 leading-7 text-gray-600">
                                            {service.description}
                                        </p>
                                        <div className="mt-7 space-y-3">
                                            {service.features.map((feature) => (
                                                <div key={feature} className="flex items-start gap-3">
                                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"/>
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </SectionFrame>
            </section>

            <section className="px-4 pb-16 sm:px-6 lg:px-8">
                <motion.div
                    initial={{opacity: 0, y: 22}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-80px'}}
                    transition={{duration: 0.5}}
                    className="orange-neon mx-auto max-w-7xl rounded-[36px] bg-gray-950 p-6 text-white sm:p-8 lg:p-10"
                >
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div>
              <span
                  className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">
                <Activity className="h-4 w-4"/>
                Більше, ніж базовий огляд
              </span>
                            <h2 className="text-3xl font-black sm:text-4xl">
                                Працюємо з профілактикою, лікуванням і відновленням
                            </h2>
                            <p className="mt-4 leading-7 text-white/70">
                                Ви можете звернутися не лише в екстреній ситуації. Регулярний
                                огляд, вакцинація, контроль паразитів і своєчасна діагностика
                                часто дешевші та спокійніші, ніж лікування ускладнень.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {vetDirections.map((direction) => (
                                <span
                                    key={direction}
                                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85"
                                >
                  {direction}
                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#be4b42_0%,#d96f49_42%,#9f4b6b_78%,#249c9a_142%)] px-4 py-18 text-white shadow-[0_26px_90px_rgba(190,75,66,0.16)] sm:px-6 lg:px-8">
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 hidden w-[46%] bg-white/8 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block"
                />
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

                <div className="relative mx-auto max-w-7xl">
                    <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
                        <div className="max-w-3xl">
                            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-100 shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
                                <Sparkles className="h-4 w-4" />
                                Запис на послугу
                            </p>
                            <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
                                Потрібна ветеринарна послуга?
                            </h2>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
                                Зателефонуйте або напишіть нам. Ми уточнимо симптоми,
                                підкажемо потрібну процедуру і запропонуємо зручний час.
                            </p>

                            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                                {['Огляд', 'Підбір процедури', 'Зручний час'].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/16 bg-white/10 px-4 py-3 shadow-sm"
                                    >
                                        <p className="text-sm font-extrabold text-white/88">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-white/16 bg-white p-4 text-gray-950 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
                            <div className="rounded-[26px] bg-gray-50 p-4 text-gray-950">
                                <div className="mb-4 flex items-center justify-between gap-4 px-1">
                                    <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-500">
                                        Швидкий контакт
                                    </p>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                        На звʼязку
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <LinkButton href="tel:+380932966097" size="lg" className="w-full justify-between rounded-2xl">
                                        <span className="inline-flex items-center gap-2">
                                            <Phone className="h-5 w-5"/>
                                            Зателефонувати
                                        </span>
                                        <ArrowRight className="h-5 w-5"/>
                                    </LinkButton>
                                    <LinkButton href="/contacts" variant="secondary" size="lg" className="w-full justify-between rounded-2xl">
                                        Написати повідомлення
                                        <MessageCircle className="h-5 w-5"/>
                                    </LinkButton>
                                </div>
                            </div>
                            <p className="mt-4 rounded-[22px] border border-orange-100 bg-orange-50 px-4 py-4 text-sm font-semibold leading-6 text-orange-900/75">
                                Якщо ситуація термінова, краще одразу телефонувати.
                                Так команда швидше зорієнтується і підкаже наступний крок.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-18 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-orange-200/70 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_42%,#ecfeff_100%)] p-5 shadow-[0_30px_110px_rgba(249,115,22,0.13)] sm:p-6 lg:p-8">
                    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                        <div className="p-2 sm:p-4 lg:p-6">
                            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-extrabold text-orange-700 shadow-sm">
                                <Sparkles className="h-4 w-4"/>
                                Комерційні послуги
                            </span>
                            <h2 className="max-w-xl text-4xl font-black leading-tight text-gray-950 sm:text-5xl lg:text-6xl">
                                Для власників собак і котів
                            </h2>
                            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                                Записуйтеся на планові процедури, профілактику та
                                консультації. Ми пояснюємо діагноз, не лякаємо складними
                                словами і допомагаємо власнику зрозуміти, що саме потрібно
                                тварині.
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[24px] border border-orange-100 bg-white/80 p-4">
                                    <p className="text-3xl font-black text-primary">4</p>
                                    <p className="mt-1 text-sm font-bold text-gray-600">
                                        ключові сценарії догляду
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-sky-100 bg-white/80 p-4">
                                    <p className="text-3xl font-black text-sky-600">1</p>
                                    <p className="mt-1 text-sm font-bold text-gray-600">
                                        зрозумілий план після консультації
                                    </p>
                                </div>
                            </div>

                            <LinkButton
                                href="/contacts"
                                variant="primary"
                                className="mt-8 rounded-2xl"
                            >
                                Уточнити послугу
                                <ArrowRight className="h-4 w-4"/>
                            </LinkButton>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {additionalServices.map((service, index) => {
                                const Icon = service.icon
                                return (
                                    <article
                                        key={service.title}
                                        className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-[28px] border border-gray-100 bg-white/92 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(249,115,22,0.12)]"
                                    >
                                        <div className="mb-5 flex items-center justify-between gap-4">
                                            <span
                                                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${service.accent}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </span>
                                            <span className="text-sm font-black text-orange-100 transition group-hover:text-primary">
                                                0{index + 1}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-950">
                                            {service.title}
                                        </h3>
                                        <p className="mt-3 leading-7 text-gray-600">
                                            {service.text}
                                        </p>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {service.items.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-bold text-gray-700"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
