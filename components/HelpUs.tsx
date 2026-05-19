'use client'
import React, {useState} from 'react';
import {Button} from "@/components/ui/Button";
import { motion } from "framer-motion";
import {ChevronRight, Footprints, Gift, Heart} from "lucide-react";

const wishlist = [
    {item: 'Puppy food (10kg)', needed: 5},
    {item: 'Leashes (Large)', needed: 8},
    {item: 'Medical Bandages', needed: 25},
    {item: 'Cat Litter (5L)', needed: 15},
]

const HelpUs = () => {
    const [donationAmount, setDonationAmount] = useState('500')

    return (
        <section id="help" className="bg-white py-24">
            <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
                <h2 className="mb-20 text-center text-4xl font-extrabold text-text-main md:text-5xl">
                    Як ви можете нам допомогти
                </h2>

                <div className="grid gap-8 lg:grid-cols-3">
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: true}}
                        transition={{delay: 0.1}}
                        className="group flex min-h-130 flex-col rounded-4xl border border-gray-100 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                    >
                        <div
                            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white">
                            <Gift className="h-7 w-7"/>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-text-main">
                            Список необхідного
                        </h3>
                        <p className="mb-8 text-sm leading-relaxed text-gray-500">
                            Список потреб притулку. Придбайте та передайте необхідні речі за
                            власним бажанням.
                        </p>

                        <div className="mb-8 space-y-3">
                            {wishlist.map((item) => (
                                <div
                                    key={item.item}
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3.5"
                                >
                    <span className="text-sm font-bold text-text-main">
                      {item.item}
                    </span>
                                    <span
                                        className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                      Потрібно {item.needed}
                    </span>
                                </div>
                            ))}
                        </div>

                        <Button className="mt-auto w-full text-sm">
                            Переглянути всі пункти <ChevronRight className="h-4 w-4"/>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: true}}
                        className="group flex min-h-130 flex-col rounded-4xl border border-primary bg-primary p-8 text-white shadow-primary transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
                    >
                        <div
                            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                            <Heart className="h-7 w-7"/>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold">Direct Donation</h3>
                        <p className="mb-8 text-sm leading-relaxed text-white/80">
                            Твій внесок допомагає забезпечити безпритульних тварин ліками,
                            їжею та теплим прихистком.
                        </p>

                        <div className="mb-4 grid grid-cols-3 gap-2">
                            {['200', '500', '1000'].map((amount) => (
                                <Button
                                    key={amount}
                                    onClick={() => setDonationAmount(amount)}
                                    variant={donationAmount === amount ? 'light' : 'ghost'}
                                    size="sm"
                                    className="min-h-10 border-white/30 bg-white/10 py-2 text-sm text-white hover:bg-white/20 hover:text-white"
                                >
                                    ₴{amount}
                                </Button>
                            ))}
                        </div>

                        <div className="relative mb-6">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-white/50">
                  ₴
                </span>
                            <input
                                type="text"
                                placeholder="Ввести самостійно"
                                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pr-4 pl-8 text-sm font-bold text-white transition-all placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                            />
                        </div>

                        <Button variant="light" className="mt-auto w-full text-sm uppercase">
                            Надіслати допомогу
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        whileInView={{opacity: 1, scale: 1}}
                        viewport={{once: true}}
                        transition={{delay: 0.2}}
                        className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                    >
                        <div
                            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                            <Footprints className="h-7 w-7"/>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-text-main">
                            Волонтерам
                        </h3>
                        <p className="mb-8 text-sm leading-relaxed text-gray-500">
                            Волонтерські прогулянки проводяться у вихідні. Залиште свої
                            контакти, і ми зв’яжемося з вами для запису.
                        </p>

                        <form className="mb-4 space-y-3">
                            <input
                                type="text"
                                placeholder="ПІБ"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary/30 focus:bg-white"
                            />
                            <input
                                type="tel"
                                placeholder="Номер телефону"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary/30 focus:bg-white"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary/30 focus:bg-white"
                            />
                            <div
                                className="rounded-xl border border-primary/20 bg-orange-50 px-4 py-3 text-xs font-bold text-primary">
                                Доступно лише у вихідні з 11:00 до 14:00 за попереднім записом
                            </div>
                        </form>

                        <Button variant="outline" className="mt-auto w-full">
                            Залишити заявку
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HelpUs;