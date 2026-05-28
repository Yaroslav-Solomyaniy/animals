'use client'
import {HeartHandshake, ShieldCheck, Stethoscope} from 'lucide-react'
import {motion} from 'motion/react'
import SectionFrame from '@/components/ui/SectionFrame'
import {LinkButton} from '@/components/ui/Button'
import type {MasonryItem} from './ui/Masonry'
import Masonry from './ui/Masonry'
import {WobbleCard} from "@/components/ui/wobble-card";
import {color_blue, color_rose, color_violet} from "@/contstants/colors";
import { SITE_ROUTES, SITE_SOCIAL_LINKS } from '@/lib/site-config'

const dogItems: Array<MasonryItem> = [
    {
        id: 'dog-1',
        img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/2l0CWTpcChI',
        height: 520,
    },
    {
        id: 'dog-2',
        img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/tGBRQw52Thw',
        height: 680,
    },
    {
        id: 'dog-3',
        img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/ISg37AI2A-s',
        height: 460,
    },
    {
        id: 'dog-4',
        img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/ybHtKz5He9Y',
        height: 600,
    },
    {
        id: 'dog-5',
        img: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/73flblFUksY',
        height: 740,
    },
    {
        id: 'dog-6',
        img: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/0E_vhMVqL9g',
        height: 500,
    },
    {
        id: 'dog-7',
        img: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/Sg3XwuEpybU',
        height: 650,
    },
    {
        id: 'dog-8',
        img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
        url: 'https://unsplash.com/photos/pOUA8Xay514',
        height: 560,
    },
]

const heroStats = [
    {
        icon: HeartHandshake,
        title: 'Поруч у складний момент',
        description:
            'Допомагаємо тваринам, які залишились без підтримки, отримати турботу, увагу та шанс на спокійне майбутнє.',
        color: color_blue,
        beamSize: 60,
    },
    {
        icon: Stethoscope,
        title: 'Турбота кожного дня',
        description:
            'Від харчування та прогулянок до лікування й реабілітації — ми дбаємо про тварин щодня.',
        color: color_rose,
        beamSize: 60,
    },
    {
        icon: ShieldCheck,
        title: 'Місце безпеки та довіри',
        description:
            'Ми прагнемо створити у Черкасах середовище, де допомога тваринам є природною частиною відповідального суспільства.',
        color: color_violet,
        beamSize: 60,
    },
]

export default function Welcome() {
    return (
        <section className="relative flex min-h-0 items-center overflow-hidden py-8 sm:py-12 md:py-14 lg:min-h-[calc(100vh-80px)] lg:py-16 xl:py-20">
            <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(249,250,251,0.32))]"/>

            <div className="relative mx-auto w-full max-w-336 px-4 sm:px-6 lg:px-8">
                <div className="items-center lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:gap-16">
                    <motion.div
                        initial={{opacity: 0, x: -30}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6, ease: 'easeOut'}}
                        className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-5 lg:mx-0 lg:max-w-2xl lg:text-left xl:space-y-6"
                    >
                        <div
                            className="mx-auto mb-6 inline-flex max-w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-3 text-center text-emerald-800 shadow-[0_12px_30px_rgba(16,185,129,0.13)] ring-1 ring-white/70 backdrop-blur sm:max-w-full sm:flex-row sm:gap-2.5 sm:rounded-full sm:px-4 sm:py-2.5 sm:text-left lg:mx-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-emerald-200/80 sm:h-6 sm:w-6">
                                <HeartHandshake className="h-4 w-4" />
                            </span>
                            <a href={SITE_SOCIAL_LINKS.chystota.href} target={"_blank"} rel="noreferrer" className="min-w-0 text-[11px] leading-tight font-extrabold sm:text-sm">
                                За підтримки комунального підприємства &quot;Черкаська служба чистоти&quot; ЧМР
                            </a>
                        </div>
                        <h1 className="text-[34px] leading-[1.05] font-extrabold text-text-main sm:text-5xl md:text-5xl xl:text-6xl">
                            <span className="text-primary">Центр надання допомоги тваринам</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:mx-0 lg:max-w-xl">
                            Діяльність нашого центру розповсюджується на всю територію м.Черкаси, але за можливості ми намагаємось надати прихисток тваринам з різних куточків нашої країни.
                        </p>

                        <p className="mx-auto max-w-2xl text-sm leading-6 font-bold text-primary sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:mx-0 lg:max-w-xl">
                            Щодня ми допомагаємо хвостатим повернути довіру до людей.
                            Не кожна тварина має дім. Але кожна заслуговує його знайти.
                        </p>

                        <p className="mx-auto hidden max-w-2xl text-base leading-7 text-gray-500 lg:block lg:mx-0 lg:max-w-xl lg:text-lg lg:leading-8">
                            Ми рятуємо, лікуємо та знаходимо нові домівки для тварин, які
                            потребують допомоги. Кожна тварина заслуговує на любов, турботу та
                            безпечне майбутнє в нашому місті.
                        </p>


                        <motion.div
                            initial={{opacity: 0, x: 100}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 1, delay: 0.15, ease: 'easeOut'}}
                            className="relative mt-6 sm:mt-7 lg:mt-8"
                        >
                            <div className="flex flex-col justify-center gap-3 pt-1 sm:flex-row sm:gap-4 lg:justify-start">
                                <LinkButton href={SITE_ROUTES.animals} className="h-11 w-full justify-center text-center text-sm sm:w-auto sm:text-base">Знайти вірного друга</LinkButton>
                                <LinkButton href={SITE_ROUTES.services} variant="outline" className="h-11 w-full justify-center text-center text-sm sm:w-auto sm:text-base">Переглянути перелік послуг</LinkButton>
                            </div>
                        </motion.div>

                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, delay: 0.15, ease: 'easeOut'}}
                        className="relative mx-auto mt-8 w-full max-w-3xl sm:mt-10 lg:mt-0 lg:max-w-none"
                    >
                        <SectionFrame className="h-[15rem] overflow-hidden rounded-3xl border-gray-100 p-2 sm:h-[20rem] sm:p-3 md:h-[24rem] lg:h-[34rem] xl:h-150 xl:rounded-4xl xl:p-4">
                            <div className="relative h-full overflow-hidden rounded-2xl bg-secondary/10 sm:rounded-3xl">
                                <Masonry
                                    items={dogItems}
                                    maxColumns={3}
                                    autoScroll
                                    scrollSpeed={48}
                                    animateFrom="bottom"
                                    stagger={0.04}
                                    hoverScale={0.96}
                                    colorShiftOnHover
                                />
                            </div>
                        </SectionFrame>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 15}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.55, delay: 0.35, ease: 'easeOut'}}
                    className="mt-8 grid gap-3 border-t border-gray-100 pt-5 sm:mt-10 sm:gap-4 sm:pt-6 md:grid-cols-3 lg:mt-12 xl:mt-16"
                >
                    {heroStats.map((stat) => {
                        const Icon = stat.icon

                        return (
                                <WobbleCard
                                    key={stat.description}
                                    containerClassName={`border-gray-200 ${stat.color.bg}`}
                                    className="flex h-full flex-col justify-between !p-4 sm:!p-5 md:!p-4 lg:!p-5"
                                    beamColorFrom={stat.color.beamFrom}
                                    beamColorTo={stat.color.beamTo}
                                    beamDelay={1}
                                    beamSize={stat.beamSize}
                                >
                                    <div className="relative z-10">
                                        <Icon className={`mb-3 h-6 w-6 sm:mb-4 ${stat.color.icon}`}/>
                                        <h3
                                            className={`text-sm uppercase leading-tight font-extrabold sm:text-[15px] lg:text-[16px] ${stat.color.title}`}
                                        >
                                            {stat.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            {stat.description}
                                        </p>
                                    </div>
                                </WobbleCard>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
