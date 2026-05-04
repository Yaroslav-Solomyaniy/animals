import {
  ArrowRight,
  Calendar,
  Download,
  Heart,
  PawPrint,
} from 'lucide-react'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button, LinkButton } from '@/components/ui/Button'
import { news, reports } from '@/lib/news'

// const stats = [
//   ['Усиновлення', '8', '80%', 'bg-orange-500'],
//   ['Допомога тваринам', '15', '75%', 'bg-emerald-500'],
//   ['Стерилізації', '12', '60%', 'bg-sky-500'],
// ]

export default function ReportAndNewsPage() {
  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />
      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[44px] bg-[linear-gradient(135deg,#f27438_0%,#e76f51_58%,#2d6a4f_150%)] text-white shadow-[0_30px_110px_rgba(242,116,56,0.22)]">
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
                Короткі історії, важливі оновлення й звіти центру в одному
                місці, без зайвої офіційщини.
              </p>
            </div>

            <div className="relative min-h-[350px] sm:min-h-[380px] lg:min-h-[390px]">
              <div className="absolute bottom-5 right-0 flex h-[290px] w-full max-w-[430px] items-end justify-center overflow-hidden rounded-[38px] bg-white/94 shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:h-[330px] lg:bottom-0 lg:h-[360px] xl:max-w-[470px]">
                <img
                  src="/dog.png"
                  alt="Ілюстрація із собакою"
                  className="h-full w-full object-contain object-bottom p-5"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-6 max-w-[360px] rounded-[24px] bg-[#ffe06a] px-5 py-4 text-gray-950 shadow-[0_18px_48px_rgba(15,23,42,0.18)] sm:px-6 sm:py-5 lg:bottom-8 lg:left-[-2rem] lg:right-auto">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600">
                    <PawPrint className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-black">Бублик, спікер центру</p>
                </div>
                <p className="text-base font-semibold leading-6 sm:text-lg sm:leading-7">
                  Кажу коротко: новини свіжі, історії теплі, а звіти чекають
                  нижче.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-orange-100/70 pb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                  Оновлення
                </p>
                <h2 className="mt-2 text-3xl font-black text-gray-950">
                  Останні новини
                </h2>
              </div>
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="group flex overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex min-w-0 flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black leading-tight text-gray-950">
                        {item.title}
                      </h3>
                      <p className="mt-4 mb-7 leading-7 text-gray-600">
                        {item.excerpt}
                      </p>
                      <LinkButton
                        href={`/report-and-news/${item.id}`}
                        variant="outline"
                        size="sm"
                        className="mt-auto self-start"
                      >
                        Читати далі
                        <ArrowRight className="h-4 w-4" />
                      </LinkButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </SectionFrame>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-orange-100 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Прозорість
              </p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">
                Звіти центру
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                Окремо збираємо фінансові та діяльнісні звіти, щоб важливі
                документи не губилися серед новин.
              </p>
            </div>
            <span className="rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-bold text-orange-700 shadow-sm">
              Гортайте горизонтально
            </span>
          </div>

          <div className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pb-4">
            {reports.map((report) => (
              <article
                key={report.title}
                className="min-w-[290px] snap-start rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_58%,#ecfeff_100%)] p-6 shadow-soft sm:min-w-[360px] lg:min-w-[400px]"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                    <Download className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                    {report.date}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-950">
                  {report.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {report.description}
                </p>
                <Button type="button" variant="outline" size="sm" className="mt-6">
                  <Download className="h-4 w-4" />
                  Завантажити
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl rounded-[32px] p-8 text-center">
          <Heart className="mx-auto mb-5 h-10 w-10 text-orange-500" />
          <h2 className="text-3xl font-black text-gray-950">
            Станьте частиною нашої історії
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Кожне усиновлення, донат і година волонтерства стають частиною
            спільної історії порятунку.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <LinkButton
              href="/"
              size="md"
            >
              Усиновити тварину
            </LinkButton>
            <LinkButton
              href="/help-for-us"
              variant="outline"
              size="md"
            >
              Підтримати притулок
            </LinkButton>
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
