'use client'

import {ArrowUpRight, Quote} from 'lucide-react'
import {motion} from 'motion/react'

import {SITE_SOCIAL_LINKS} from '@/lib/site-config'

export default function Welcome() {
    return (
        <section className="relative overflow-hidden bg-transparent px-4 pt-0 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
            <motion.div
                initial={{opacity: 0, y: 18}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.55, ease: 'easeOut'}}
                className="relative mx-auto w-full max-w-336 overflow-hidden rounded-[30px] border border-gray-200 bg-white px-5 py-8 shadow-[0_28px_90px_rgba(31,41,55,0.08)] sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-14"
            >
                <div className="pointer-events-none absolute right-0 top-0 h-full w-[42%] bg-[radial-gradient(circle_at_70%_30%,rgba(220,252,231,0.7),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0),rgba(240,253,244,0.72))]" />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.5fr)] lg:items-center lg:gap-16">
                    <div className="max-w-4xl">
                        <a
                            href={SITE_SOCIAL_LINKS.chystota.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-secondary transition hover:text-primary"
                        >
                            За підтримки Черкаської служби чистоти
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>

                        <h2 className="mt-5 text-[34px] leading-[1.06] font-black text-text-main sm:text-5xl lg:text-[58px]">
                            Центр надання допомоги безпритульним тваринам{' '}
                            <span className="text-secondary">м. Черкаси</span>
                        </h2>

                        <p className="mt-5 max-w-2xl text-base leading-7 font-bold text-gray-600 sm:text-lg sm:leading-8">
                            Офіційний міський простір турботи, де тварин приймають, лікують,
                            соціалізують і готують до нового дому.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-[#f8fbf6] p-6 shadow-[0_22px_60px_rgba(31,41,55,0.07)] sm:p-7 lg:p-8">
                            <div className="flex items-center justify-between gap-5 border-b border-emerald-100/80 pb-5">
                                <span className="text-xs font-black uppercase tracking-[0.18em] text-secondary">
                                    про довіру
                                </span>
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary ring-1 ring-gray-100">
                                    <Quote className="h-5 w-5" />
                                </span>
                            </div>

                            <div className="py-7">
                                <p className="text-[26px] leading-[1.14] font-black text-text-main sm:text-3xl">
                                    Тут тварина знову вчиться не боятися людських рук.
                                </p>
                                <p className="mt-5 text-sm leading-6 font-bold text-gray-600">
                                    Маленькі щоденні речі повертають спокій: теплий голос, лікування,
                                    чистий вольєр і людина поруч.
                                </p>
                            </div>

                            <p className="border-t border-emerald-100/80 pt-5 text-sm font-black uppercase tracking-[0.16em] text-primary">
                                спокій / турбота / довіра / дім
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
