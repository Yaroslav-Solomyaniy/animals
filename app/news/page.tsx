import { PawPrint } from 'lucide-react'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import Section from '@/components/ui/Section'
import SortFilter from './SortFilter'
import NewsGrid from './NewsGrid'
import { Suspense } from 'react'

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  return (
    <main className="min-h-screen text-gray-950">
      <StorybookDecorations />
      <Section className="pt-14" innerClassName="relative overflow-hidden rounded-[44px] bg-[linear-gradient(135deg,#f27438_0%,#e76f51_58%,#2d6a4f_150%)] text-white shadow-[0_30px_110px_rgba(242,116,56,0.22)]">
        <div className="absolute -bottom-18 right-0 h-56 w-[74%] rounded-tl-[120px] bg-secondary/88" />
        <div className="absolute right-[7%] top-16 hidden h-60 w-[34rem] rounded-[999px] bg-secondary/84 lg:block" />
        <div className="absolute right-[25%] top-12 hidden h-36 w-36 rounded-full bg-secondary/84 lg:block" />
        <div className="absolute left-8 top-8 hidden h-24 w-24 rounded-full bg-white/8 blur-xl sm:block" />

        <div className="relative grid min-h-[500px] gap-6 px-6 py-9 sm:px-8 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-11 lg:py-12 xl:px-12">
          <div className="relative z-10 pb-2 sm:pb-6 lg:pb-16">
            <p className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-50 sm:text-sm">
              <PawPrint className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">Новини від хвостиків</span>
            </p>
            <h1 className="max-w-[10.5ch] text-5xl font-black leading-[0.97] text-white sm:text-6xl md:text-7xl lg:text-[5.1rem] xl:text-[5.8rem]">
              Що нового у центрі?
            </h1>
            <p className="mt-6 max-w-lg text-base font-semibold leading-7 text-white/86 sm:text-lg sm:leading-8">
              Короткі історії, важливі оновлення й матеріали центру в одному місці, без зайвої офіційщини.
            </p>
          </div>

          <div className="relative min-h-[350px] sm:min-h-[380px] lg:min-h-[390px]">
            <div className="absolute bottom-5 right-0 flex h-[290px] w-full max-w-[430px] items-end justify-center overflow-hidden rounded-[38px] bg-white/94 shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:h-[330px] lg:bottom-0 lg:h-[360px] xl:max-w-[470px]">
              <img src="/dog.png" alt="Ілюстрація із собакою" className="h-full w-full object-contain object-bottom p-5" />
            </div>
            <div className="absolute bottom-0 left-0 right-6 max-w-[360px] rounded-[24px] bg-[#ffe06a] px-5 py-4 text-gray-950 shadow-[0_18px_48px_rgba(15,23,42,0.18)] sm:px-6 sm:py-5 lg:bottom-8 lg:left-[-2rem] lg:right-auto">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600">
                  <PawPrint className="h-4 w-4" />
                </span>
                <p className="text-sm font-black">Бублик, спікер центру</p>
              </div>
              <p className="text-base font-semibold leading-6 sm:text-lg sm:leading-7">
                Кажу коротко: новини свіжі, історії теплі, приходьте частіше!
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* News grid */}
      <Section className="pt-14 pb-14">
        <SectionFrame className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-orange-100/70 pb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Оновлення</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">Останні новини</h2>
            </div>
            <Suspense>
              <SortFilter />
            </Suspense>
          </div>
          <Suspense>
            <NewsGrid searchParams={searchParams} />
          </Suspense>
        </SectionFrame>
      </Section>
    </main>
  )
}
