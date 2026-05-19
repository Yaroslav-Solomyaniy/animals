'use client'
import {HeartHandshake, ShieldCheck, Stethoscope, MapPin} from 'lucide-react'
import {motion} from 'motion/react'
import SectionFrame from '@/components/ui/SectionFrame'
import {LinkButton} from '@/components/ui/Button'
import type {MasonryItem} from './ui/Masonry'
import Masonry from './ui/Masonry'
import {WobbleCard} from "@/components/ui/wobble-card";
import {color_blue, color_rose, color_violet} from "@/contstants/colors";

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
        <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden py-16 md:py-20">
            <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(249,250,251,0.32))]"/>

            <div className="relative mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
                <div className="items-center lg:grid lg:grid-cols-2 lg:gap-16">
                    <motion.div
                        initial={{opacity: 0, x: -30}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.6, ease: 'easeOut'}}
                        className="max-w-2xl space-y-6"
                    >
                        <div
                            className="inline-flex max-w-full items-center gap-2 rounded-full bg-green-50 p-3 border py-1 text-xs font-bold tracking-wider text-secondary">
                            <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-secondary"></span>
                            <a href={'https://chistota.ck.ua'} target={"_blank"} className="text-sm ">За підтримки КП "Черкаська служба чистоти" ЧМР</a>
                        </div>
                        <h1 className="text-4xl leading-tight font-extrabold text-text-main md:text-5xl lg:text-6xl">
                            <span className="text-primary">Центр надання допомоги тваринам</span>
                        </h1>
                        <p className="max-w-xl text-base leading-8 text-gray-500 md:text-lg">
                            Діяльність нашого центру розповсюджується на всю територію м.Черкаси, але за можливості ми намагаємось надати прихисток тваринам з різних куточків нашої країни.
                        </p>

                        <p className="max-w-xl text-base leading-8 text-primary font-bold md:text-lg">
                            Щодня ми допомагаємо хвостатим повернути довіру до людей.
                            Не кожна тварина має дім. Але кожна заслуговує його знайти.
                        </p>

                        <p className="max-w-xl text-base leading-8 text-gray-500 md:text-lg">
                            Ми рятуємо, лікуємо та знаходимо нові домівки для тварин, які
                            потребують допомоги. Кожна тварина заслуговує на любов, турботу та
                            безпечне майбутнє в нашому місті.
                        </p>


                        <motion.div
                            initial={{opacity: 0, x: 100}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 1, delay: 0.15, ease: 'easeOut'}}
                            className="relative mt-16 lg:mt-0"
                        >
                            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                                <LinkButton href="/animals">Знайти вірного друга</LinkButton>
                                <LinkButton href="/services" variant="outline">Переглянути перелік послуг</LinkButton>
                            </div>
                        </motion.div>

                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 24}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.7, delay: 0.15, ease: 'easeOut'}}
                        className="relative mt-16 lg:mt-0"
                    >
                        <SectionFrame className="h-150 overflow-hidden rounded-4xl border-gray-100 p-4">
                            <div className="relative h-full overflow-hidden rounded-3xl bg-secondary/10">
                                <Masonry
                                    items={dogItems}
                                    columns={3}
                                    autoScroll
                                    scrollSpeed={50}
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
                    className="mt-20 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-3 lg:mt-16"
                >
                    {heroStats.map((stat) => {
                        const Icon = stat.icon

                        return (
                                <WobbleCard
                                    key={stat.description}
                                    containerClassName={`border-gray-200 ${stat.color.bg}`}
                                    className="flex h-full flex-col justify-between p-3 sm:p-4"
                                    beamColorFrom={stat.color.beamFrom}
                                    beamColorTo={stat.color.beamTo}
                                    beamDelay={1}
                                    beamSize={stat.beamSize}
                                >
                                    <div className="relative z-10">
                                        <Icon className={`mb-4 h-6 w-6 ${stat.color.icon}`}/>
                                        <h3
                                            className={`text-[16px] uppercase leading-tight font-extrabold ${stat.color.title}`}
                                        >
                                            {stat.title}
                                        </h3>
                                        <p className="mt-1 text-[14px]  leading-8 text-gray-600">
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
