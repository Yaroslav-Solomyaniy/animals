import Link from 'next/link'
import { ArrowRight, Calendar, Download, Heart, TrendingUp } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
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
      <PageHero
        eyebrow="Відкритість і прозорість"
        title="Новини та звіти"
        description="Тут збираємо важливі оновлення центру: історії порятунку, усиновлення, міські програми, звіти та актуальні потреби."
        icon={TrendingUp}
      >
        <div className="grid gap-4 rounded-[24px] bg-white p-2 sm:grid-cols-2">
          {reports.slice(0, 2).map((report) => (
            <article
              key={report.title}
              className="rounded-[20px] border border-gray-100 bg-gray-50 p-5"
            >
              <Download className="mb-4 h-7 w-7 text-orange-500" />
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">
                {report.date}
              </p>
              <h2 className="mt-2 text-xl font-black text-gray-950">
                {report.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {report.description}
              </p>
            </article>
          ))}
        </div>
      </PageHero>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto grid max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_360px] lg:p-8">
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

            <div className="space-y-5">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
                >
                  <div className="grid md:grid-cols-[260px_1fr]">
                    <div className="aspect-video overflow-hidden md:aspect-auto">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-7 text-gray-600">
                        {item.excerpt}
                      </p>
                      <Link
                        href={`/report-and-news/${item.id}`}
                        className="mt-5 inline-flex items-center gap-2 font-bold text-orange-600 transition hover:text-orange-700"
                      >
                        Читати далі
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-orange-100 bg-orange-50/70 p-6 shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-black text-gray-950">Звіти</h3>
              </div>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.title}
                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <h4 className="font-bold text-gray-950">{report.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {report.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        {report.date}
                      </span>
                      <button className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600">
                        <Download className="h-4 w-4" />
                        Завантажити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="rounded-[28px] border border-orange-100 bg-orange-50/70 p-6">*/}
            {/*  <h3 className="text-xl font-black text-gray-950">*/}
            {/*    Підписатися на новини*/}
            {/*  </h3>*/}
            {/*  <p className="mt-3 text-sm leading-6 text-gray-600">*/}
            {/*    Отримуйте важливі оновлення та історії порятунку на пошту.*/}
            {/*  </p>*/}
            {/*  <div className="mt-5 space-y-3">*/}
            {/*    <input*/}
            {/*      type="email"*/}
            {/*      placeholder="Ваш email"*/}
            {/*      className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 font-medium outline-none transition focus:border-orange-300"*/}
            {/*    />*/}
            {/*    <button className="w-full rounded-2xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600">*/}
            {/*      Підписатися*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/* </div>*/}

            {/* <div className="rounded-[28px] border border-gray-100 bg-white p-6">*/}
            {/*  <h3 className="text-xl font-black text-gray-950">*/}
            {/*    Статистика місяця*/}
            {/*  </h3>*/}
            {/*  <div className="mt-5 space-y-5">*/}
            {/*    {stats.map(([label, value, width, color]) => (*/}
            {/*      <div key={label}>*/}
            {/*        <div className="mb-2 flex items-center justify-between">*/}
            {/*          <span className="font-semibold text-gray-600">*/}
            {/*            {label}*/}
            {/*          </span>*/}
            {/*          <span className="font-black text-gray-950">{value}</span>*/}
            {/*        </div>*/}
            {/*        <div className="h-2 rounded-full bg-gray-100">*/}
            {/*          <div*/}
            {/*            className={`h-2 rounded-full ${color}`}*/}
            {/*            style={{ width }}*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/* </div>*/}
          </aside>
        </SectionFrame>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-4xl rounded-[32px] p-8 text-center">
          <Heart className="mx-auto mb-5 h-10 w-10 text-orange-500" />
          <h2 className="text-3xl font-black text-gray-950">
            Станьте частиною нашої історії
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Кожне усиновлення, донат і година волонтерства стають частиною
            спільної історії порятунку.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Усиновити тварину
            </Link>
            <Link
              href="/help-for-us"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 font-bold text-gray-950 transition hover:border-orange-300"
            >
              Підтримати притулок
            </Link>
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
