'use client'

import Image from 'next/image'
import { ArrowRight, CalendarHeart, Heart, PawPrint, ShieldCheck } from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import WelcomeCarousel from '@/components/WelcomeCarousel'
import { WalkOrderDialog } from '@/components/WalkOrderDialog'
import { useFeatureFlags } from '@/components/FeatureFlagsProvider'

export default function HomeScreenCarousel() {
  const { donationsEnabled } = useFeatureFlags()
  return (
    <section className="contacts-gradient-coral relative px-8 py-8 outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:py-10 lg:py-16">
      <StorybookDecorations />
      <div className="relative mx-auto grid w-full max-w-336 grid-rows-[minmax(0,1fr)_360px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_30px_100px_rgba(31,41,55,0.1)] sm:grid-rows-[minmax(0,1fr)_420px] lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,1.02fr)] lg:grid-rows-1">
        <div className="flex min-h-64 flex-col items-center justify-between gap-4 px-5 py-6 sm:min-h-80 sm:gap-5 sm:px-10 sm:py-10 lg:min-h-150 lg:items-start lg:px-14 lg:py-14 xl:p-16">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf6f1] px-4 py-2 text-xs font-extrabold text-secondary sm:text-sm">
            <ShieldCheck className="h-4 w-4" />
            За підтримки Черкаської служби чистоти
          </div>
          <div>
            <h1 className="max-w-full text-center text-[28px] leading-[1.1] font-black text-text-main sm:text-[34px] md:text-[42px] lg:text-left lg:text-[52px]">
              Центр надання допомоги тваринам
              <span className="text-secondary"> м.Черкаси</span>
            </h1>
            <p className="mt-3 text-center text-sm leading-6 font-semibold text-gray-600 sm:mt-5 sm:text-base sm:leading-7 lg:max-w-xl lg:text-left lg:text-lg lg:leading-8">
              Рятуємо, лікуємо, соціалізуємо та допомагаємо знайти новий дім для тварин Черкас.
            </p>
          </div>

          <div className={`mt-4 grid w-full gap-3 sm:mt-5 sm:gap-4 ${donationsEnabled ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <LinkButton
              href={SITE_ROUTES.animals}
              size="lg"
              className="flex h-12 w-full justify-center gap-2 rounded-xl px-5 text-sm"
            >
              <PawPrint className="h-5 w-5" />
              Каталог тварин
            </LinkButton>
            {donationsEnabled && (
              <LinkButton
                href={SITE_ROUTES.donate}
                variant="outline"
                size="lg"
                className="h-12 justify-center rounded-xl border-secondary/30 px-5 text-sm text-secondary hover:border-secondary hover:bg-[#f1faf5] hover:text-secondary"
              >
                <Heart className="h-5 w-5" />
                Підтримати центр
              </LinkButton>
            )}
          </div>
        </div>
        <WelcomeCarousel />
      </div>

      <section className="mt-8 sm:mt-10 lg:mt-12">
        <div className="mx-auto grid max-w-336 overflow-hidden rounded-[30px] border border-emerald-200 bg-[linear-gradient(135deg,#ecf8f1_0%,#f8fffb_54%,#fffaf0_100%)] grid-cols-1 grid-rows-[auto_320px_auto] sm:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)] sm:grid-rows-[1fr_auto] lg:min-h-83 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
          {/* Текст */}
          <div className="flex min-w-0 flex-col items-center p-6 pb-2 sm:items-start sm:p-7 sm:pb-4 lg:pt-9 lg:pr-6 lg:pl-10 lg:pb-4 xl:pl-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold uppercase text-secondary ring-1 ring-emerald-100 sm:text-sm">
              <CalendarHeart className="h-4 w-4" />
              Кожні {SITE_CONTACTS.walkSchedule}
            </div>

            <h2 className="mt-3 sm:mt-4 max-w-xl wrap-break-word text-center text-[22px] font-black leading-tight text-text-main sm:text-left sm:text-[22px] lg:text-[46px] lg:leading-[1.4]">
              Запрошуємо на прогулянку з тваринами
            </h2>

            <p className="mt-2 max-w-lg wrap-break-word text-center text-sm font-semibold leading-6 text-gray-600 sm:text-left lg:mt-5 lg:text-lg lg:leading-7">
              Оберіть друга з каталогу або запитайте нас, кому зараз найбільше потрібна прогулянка.
            </p>
          </div>

          {/* Фото — row 2 на мобільному, spans 2 rows у правій колонці на sm+ */}
          <div className="relative h-full sm:row-span-2">
            <Image src="/max.png" alt="Собака запрошує на прогулянку" fill unoptimized loading="lazy" className="object-contain object-bottom" />
          </div>

          {/* Кнопки — row 3 на мобільному, row 2 col 1 на sm+ */}
          <div className="flex w-full flex-col gap-3 p-6 pt-0 sm:p-7 sm:pt-0 md:flex-row lg:pt-5 lg:pb-9 lg:pr-6 lg:pl-10 xl:pl-12">
            <WalkOrderDialog
              trigger={
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-secondary bg-secondary px-5 text-sm font-bold text-white transition hover:bg-white hover:text-secondary md:w-fit">
                  <PawPrint className="h-5 w-5" />
                  Хочу прогулятись
                </button>
              }
            />
            <LinkButton
              href={SITE_ROUTES.walks}
              variant="outline"
              size="lg"
              className="h-11 w-full justify-center rounded-xl border-secondary/30 px-5 text-sm text-secondary hover:border-secondary hover:bg-[#f1faf5] hover:text-secondary md:w-fit"
            >
              Дізнатись більше
            </LinkButton>
          </div>
        </div>
      </section>
    </section>
  )
}
