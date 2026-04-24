'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ChevronRight,
  Clock3,
  Footprints,
  Gift,
  Heart,
  Phone,
  Stethoscope,
} from 'lucide-react'
import Hero from '@/components/Hero'
import AnimalCatalog from '@/components/HeroAnimals'
import CityProgram from '@/components/city-program/city-program'
import TrustValues from '@/components/TrustValues'

const wishlist = [
  { item: 'Puppy food (10kg)', needed: 5 },
  { item: 'Leashes (Large)', needed: 8 },
  { item: 'Medical Bandages', needed: 25 },
  { item: 'Cat Litter (5L)', needed: 15 },
]

export default function HomePage() {
  const [donationAmount, setDonationAmount] = useState('500')

  return (
    <main className="min-h-screen">
      <section>
        <Hero />
      </section>

      <CityProgram />

      <section>
        <AnimalCatalog />
      </section>

      <section id="contacts" className="bg-neutral-base pb-24">
        <div className="mx-auto max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="tel:+380932966097"
                className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-5 text-text-main transition-colors hover:border-primary/30"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-gray-400">
                    Телефон
                  </span>
                  <span className="block font-extrabold">
                    +38 (093) 296-60-97
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-5 text-text-main">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1FFF8] text-secondary">
                  <Clock3 className="h-5 w-5" />
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

            <a
              href="/services"
              className="group relative overflow-hidden rounded-4xl border border-primary/20 bg-linear-to-br from-[#fff7ed] via-white to-[#ecfeff] p-7 text-text-main transition-all hover:-translate-y-1 hover:border-primary/40 md:p-8"
            >
              <span className="absolute -top-12 right-8 h-28 w-28 rounded-full bg-primary/15 blur-2xl transition-transform group-hover:scale-125" />
              <span className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl transition-transform group-hover:scale-125" />

              <span className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary text-white">
                  <Stethoscope className="h-8 w-8" />
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
                  <span className="mt-5 inline-flex items-center gap-2 font-extrabold text-primary transition-colors group-hover:text-secondary">
                    Перейти до послуг
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <TrustValues />

      <section className="bg-linear-to-br from-[#f97316] to-[#ea580c] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Готові змінити чиєсь життя?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Кожна допомога важлива — чи то усиновлення, волонтерство або донат.
            Разом ми можемо врятувати більше життів.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/animals"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-[#ea580c] transition-colors hover:bg-gray-50"
            >
              Знайти найкращого друга
            </Link>
            <a
              href="#help"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 text-white transition-colors hover:bg-white/10"
            >
              Підтримати притулок
            </a>
          </div>
        </div>
      </section>

      <section id="help" className="bg-white py-24">
        <div className="mx-auto max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
          <h2 className="mb-20 text-center text-4xl font-extrabold text-text-main md:text-5xl">
            Як ви можете нам допомогти
          </h2>

          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group flex min-h-[520px] flex-col rounded-4xl border border-gray-100 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white">
                <Gift className="h-7 w-7" />
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
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                      Потрібно {item.needed}
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn-primary mt-auto flex w-full items-center justify-center gap-2 text-sm">
                Переглянути всі пункти <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group flex min-h-[520px] flex-col rounded-4xl border border-primary bg-primary p-8 text-white shadow-primary transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Direct Donation</h3>
              <p className="mb-8 text-sm leading-relaxed text-white/80">
                Твій внесок допомагає забезпечити безпритульних тварин ліками,
                їжею та теплим прихистком.
              </p>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {['200', '500', '1000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`rounded-xl py-2 text-sm font-bold transition-all ${
                      donationAmount === amount
                        ? 'bg-white text-primary'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    ₴{amount}
                  </button>
                ))}
              </div>

              <div className="relative mb-6">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-white/50">
                  ₴
                </span>
                <input
                  type="text"
                  placeholder="Custom amount"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pr-4 pl-8 text-sm font-bold text-white transition-all placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
              </div>

              <button className="mt-auto w-full rounded-xl bg-white py-4 text-center text-sm font-bold tracking-wider text-primary uppercase transition-colors hover:bg-white/90">
                Надіслати допомогу
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Footprints className="h-7 w-7" />
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
                <div className="rounded-xl border border-primary/20 bg-orange-50 px-4 py-3 text-xs font-bold text-primary">
                  Доступно лише у вихідні з 11:00 до 14:00 за попереднім записом
                </div>
              </form>

              <button className="mt-auto w-full rounded-xl bg-gray-100 py-4 text-sm font-bold text-gray-500 transition-colors hover:bg-primary hover:text-white">
                Залишити заявку
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
