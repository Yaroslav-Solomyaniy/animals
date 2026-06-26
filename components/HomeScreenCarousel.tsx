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
    <section className="contacts-gradient-coral relative px-4 pt-8 pb-16 outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:px-6 sm:pt-10 sm:pb-18 lg:px-8 lg:pt-12 lg:pb-14">
      <StorybookDecorations />
      <div className="relative mx-auto grid w-full max-w-336 grid-rows-[minmax(0,1fr)_320px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_30px_100px_rgba(31,41,55,0.1)] sm:h-auto sm:grid-rows-[minmax(0,1fr)_330px] lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,1.02fr)] lg:grid-rows-1">
        <div className="flex min-h-150 flex-col justify-between gap-5 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14 xl:p-16">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf6f1] px-4 py-2 text-xs font-extrabold text-secondary sm:text-sm">
            <ShieldCheck className="h-4 w-4" />
            За підтримки Черкаської служби чистоти
          </div>
          <div>
            <h1 className="max-w-full text-[54px] leading-[1.1] font-black text-text-main sm:text-[48px] lg:text-[52px]">
              Центр надання допомоги тваринам
              <span className="text-secondary"> м.Черкаси</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 font-semibold text-gray-600 sm:text-lg sm:leading-8">
              Рятуємо, лікуємо, соціалізуємо та допомагаємо знайти новий дім для тварин Черкас.
            </p>
          </div>

          <div className={`mt-8 grid gap-4 ${donationsEnabled ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <LinkButton
              href={SITE_ROUTES.animals}
              size="lg"
              className="flex h-12 justify-center gap-2 rounded-xl px-5 text-sm sm:text-base"
            >
              <PawPrint className="h-5 w-5" />
              Каталог тварин
            </LinkButton>
            {donationsEnabled && (
              <LinkButton
                href={SITE_ROUTES.donate}
                variant="outline"
                size="lg"
                className="h-12 justify-center rounded-xl border-secondary/30 px-5 text-sm text-secondary hover:border-secondary hover:bg-[#f1faf5] hover:text-secondary sm:text-base"
              >
                <Heart className="h-5 w-5" />
                Підтримати центр
              </LinkButton>
            )}
          </div>
        </div>
        <WelcomeCarousel />
      </div>

      <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 mt-14">
        <div className="mx-auto grid max-w-336 overflow-hidden rounded-[30px] border border-emerald-200 bg-[linear-gradient(135deg,#ecf8f1_0%,#f8fffb_54%,#fffaf0_100%)] lg:min-h-83 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-7 lg:py-9 lg:pr-6 lg:pl-10 xl:pl-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-secondary ring-1 ring-emerald-100">
              <CalendarHeart className="h-4 w-4" />
              Кожні {SITE_CONTACTS.walkSchedule}
            </div>

            <h2 className="mt-4 max-w-xl wrap-break-word text-[30px] font-black leading-[1.4] text-text-main sm:text-4xl lg:text-[44px]">
              Запрошуємо на прогулянку з тваринами
            </h2>

            <p className="mt-3 max-w-lg wrap-break-word text-sm font-semibold leading-6 text-gray-600 sm:text-base sm:leading-7">
              Оберіть друга з каталогу або запитайте нас, кому зараз найбільше потрібна прогулянка.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <WalkOrderDialog
                trigger={
                  <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-secondary bg-secondary px-5 text-sm font-bold text-white transition hover:bg-white hover:text-secondary sm:w-fit">
                    <PawPrint className="h-5 w-5" />
                    Хочу прогулятись
                  </button>
                }
              />
              <LinkButton
                href={SITE_ROUTES.walks}
                variant="outline"
                size="lg"
                className="h-12 w-full justify-center rounded-xl border-secondary/30 px-5 text-sm text-secondary hover:border-secondary hover:bg-[#f1faf5] hover:text-secondary sm:w-fit sm:text-base"
              >
                Дізнатись більше
              </LinkButton>
            </div>
          </div>

          <Image src="/max.png" alt="Собака запрошує на прогулянку" width={450} height={600} />
        </div>
      </section>
    </section>
  )
}
