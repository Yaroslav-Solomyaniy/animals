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
import { Button, LinkButton } from '@/components/ui/Button'

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
              <LinkButton
                href="tel:+380932966097"
                variant="light"
                className="justify-start rounded-3xl border-gray-100 bg-white px-5 text-text-main"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="hidden text-xs font-bold text-gray-400">
                    Телефон
                  </span>
                  <span className="block text-sm font-extrabold">
                    +38 (093) 296-60-97
                  </span>
                </span>
              </LinkButton>

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

            <Link
              href="/services"
              className="group relative overflow-hidden rounded-4xl border border-primary/20 bg-linear-to-br from-[#fff7ed] via-white to-[#ecfeff] p-7 text-left text-text-main shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:p-8"
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
            </Link>
          </div>
        </div>
      </section>

      <TrustValues />

      <section className="bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-extrabold uppercase tracking-[0.16em] text-orange-200">
              <Heart className="h-4 w-4" />
              Один крок
            </p>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Готові змінити чиєсь життя?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Оберіть просту дію: познайомитись із тваринами, підтримати центр або залишити заявку на допомогу.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="rounded-[22px] bg-white p-4 text-gray-950">
              <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                Почати зараз
              </p>
              <div className="flex flex-col gap-3">
            <LinkButton href="/animals" size="lg" className="w-full justify-between">
              Знайти друга
              <ChevronRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton href="#help" variant="dark" size="lg" className="w-full justify-between">
              Як допомогти
              <Heart className="h-5 w-5" />
            </LinkButton>
              </div>
            </div>
            <p className="px-3 pt-4 text-sm font-semibold leading-6 text-white/68">
              Усиновлення, волонтерство і донати працюють разом, коли кожен крок зрозумілий.
            </p>
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

              <Button className="mt-auto w-full text-sm">
                Переглянути всі пункти <ChevronRight className="h-4 w-4" />
              </Button>
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
                  placeholder="Custom amount"
                  className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pr-4 pl-8 text-sm font-bold text-white transition-all placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
              </div>

              <Button variant="light" className="mt-auto w-full text-sm uppercase">
                Надіслати допомогу
              </Button>
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

              <Button variant="outline" className="mt-auto w-full">
                Залишити заявку
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
