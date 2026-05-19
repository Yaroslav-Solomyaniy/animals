import React from 'react';
import {LinkButton} from "@/components/ui/Button";
import {ChevronRight, Clock3, Phone, Stethoscope} from "lucide-react";
import Link from "next/link";

const QuickContactCTA = () => {
    return (
        <section id="quick_contacts" className=" pb-24">
            <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <LinkButton
                            href="tel:+380932966097"
                            variant="light"
                            className="h-auto min-h-22 justify-start rounded-3xl border-gray-100 bg-white p-5 text-left text-text-main sm:min-h-24"
                        >
                <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Phone className="h-5 w-5"/>
                </span>
                            <span className="min-w-0">
                  <span className="block text-xs font-bold text-gray-400">
                    Телефон
                  </span>
                  <span className="mt-1 block text-base font-extrabold leading-tight">
                    +38 (093) 296-60-97
                  </span>
                </span>
                        </LinkButton>

                        <div
                            className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-5 text-text-main">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1FFF8] text-secondary">
                  <Clock3 className="h-5 w-5"/>
                </span>
                            <span>
                  <span className="block text-xs font-bold text-gray-400">
                    Прогулянки
                  </span>
                  <span className="block font-extrabold">
                    Вихідні, 11:00-14:00
                  </span>
                </span>
                        </div>
                    </div>

                    <Link
                        href="/services"
                        className="group relative overflow-hidden rounded-4xl border border-primary/20 bg-linear-to-br from-[#fff7ed] via-white to-[#ecfeff] p-7 text-left text-text-main shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:p-8"
                    >
                            <span
                                className="absolute -top-12 right-8 h-28 w-28 rounded-full bg-primary/15 blur-2xl transition-transform group-hover:scale-125"/>
                        <span
                            className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl transition-transform group-hover:scale-125"/>

                        <span className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary text-white">
                  <Stethoscope className="h-8 w-8"/>
                </span>
                <span className="min-w-0">
                  <span className="mb-2 block text-xs font-extrabold tracking-wider text-primary uppercase">
                    Для власників тварин
                  </span>
                  <span className="block text-2xl font-black text-text-main md:text-3xl">
                    Комерційні послуги центру
                  </span>
                  <span className="mt-2 block max-w-2xl leading-7 text-gray-500">
                    Якщо вас цікавлять послуги для вашої тварини, ми також їх
                    надаємо. Деталі та умови дивіться на сторінці послуг.
                  </span>
                  <span
                      className="mt-5 inline-flex items-center gap-2 font-extrabold text-primary transition-colors group-hover:text-secondary">
                    Перейти до послуг
                    <ChevronRight className="h-4 w-4"/>
                  </span>
                </span>
              </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default QuickContactCTA;