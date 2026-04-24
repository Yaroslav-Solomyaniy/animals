import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock3,
  Heart,
  Newspaper,
  Sparkles,
} from 'lucide-react'

import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import ShareMenu from '@/components/ui/ShareMenu'
import { LightboxImage } from '@/components/news/ImageLightbox'
import NewsImageSlider from '@/components/news/NewsImageSlider'
import { MOCK_ANIMALS } from '@/mockData'
import type { NewsContentBlock } from '@/lib/news'
import { getNewsById, getRelatedNews, news } from '@/lib/news'

type NewsPageProps = {
  params: Promise<{
    id: string
  }>
}

export function generateStaticParams() {
  return news.map((item) => ({
    id: item.id,
  }))
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { id } = await params
  const article = getNewsById(id)

  return {
    title: article ? article.title : 'Новину не знайдено',
    description: article?.excerpt,
  }
}

export default async function NewsDetailsPage({ params }: NewsPageProps) {
  const { id } = await params
  const article = getNewsById(id)

  if (!article) {
    notFound()
  }

  const relatedNews = getRelatedNews(article.id, 4)
  const relatedAnimal = article.relatedAnimalId
    ? MOCK_ANIMALS.find((animal) => animal.id === article.relatedAnimalId)
    : undefined

  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />

      <div className="mx-auto max-w-[calc(80rem+4rem)] px-4 pt-8 sm:px-6 lg:px-8">
        <BackLink />
      </div>

      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <article className="mx-auto grid max-w-7xl gap-5 overflow-hidden rounded-[28px] border border-orange-100 bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.10)] transition hover:border-orange-200 hover:shadow-[0_32px_100px_rgba(242,116,56,0.14)] lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[24px] ring-1 ring-orange-100/70 transition hover:ring-primary/45 lg:min-h-[560px]">
            <LightboxImage
              image={{
                src: article.image,
                alt: article.title,
              }}
              buttonClassName="absolute inset-0 cursor-zoom-in"
              imageClassName="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.78),rgba(2,6,23,0.32)_56%,rgba(2,6,23,0.10))]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.55))]" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 max-w-4xl p-6 text-white sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/92 px-4 py-2 text-sm font-extrabold text-primary shadow-soft backdrop-blur">
                <Newspaper className="h-4 w-4" />
                {article.category}
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[1.04] sm:text-5xl lg:text-[56px]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/86 sm:text-lg">
                {article.excerpt}
              </p>
            </div>
          </div>

          <aside className="flex min-h-full flex-col justify-between rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed,#ffffff_52%)] p-5 shadow-[0_18px_55px_rgba(242,116,56,0.10)] transition hover:border-orange-200 hover:shadow-[0_24px_70px_rgba(242,116,56,0.16)] sm:p-6 lg:min-h-[560px] lg:p-7">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
              Деталі публікації
            </p>
            <div className="mt-5 grid gap-3">
              <InfoLine icon={Calendar} label="Дата" value={article.date} />
              <InfoLine
                icon={Clock3}
                label="Час"
                value={`${article.publishedTime} · ${article.readingTime}`}
              />
              {article.relatedAnimalId ? (
                <RelatedAnimalPreview relatedAnimal={relatedAnimal} />
              ) : null}
            </div>
            </div>

            <div className="mt-7 border-t border-orange-100 pt-6">
              <ShareMenu
                path={`/report-and-news/${article.id}`}
                title={article.title}
                text={article.excerpt}
                label="Поділитися новиною"
                className="w-full"
              />
            </div>
          </aside>
        </article>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <SectionFrame className="overflow-hidden rounded-[32px] p-0 transition hover:border-orange-200 hover:shadow-[0_28px_80px_rgba(242,116,56,0.16)]">
            <div className="border-b border-orange-100 bg-orange-50/60 px-6 py-5 sm:px-8">
              <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-4 w-4" />
                Повна історія
              </p>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="space-y-8">
                {article.content.map((block, index) => (
                  <div
                    key={`${block.type}-${index}`}
                    className={getBlockWidthClass(block.width)}
                  >
                    <NewsBlock block={block} />
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[28px] border border-white/10 bg-gray-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_24px_70px_rgba(242,116,56,0.20)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                  <Heart className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black">Допомогти центру</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/72">
                Кожна підтримка допомагає лікувати, годувати й знаходити дім
                для тварин.
              </p>
              <Link
                href="/help-for-us"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-extrabold text-white shadow-[0_18px_45px_rgba(242,116,56,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_22px_55px_rgba(242,116,56,0.32)]"
              >
                Підтримати
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gray-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition hover:border-primary/60 hover:shadow-[0_24px_70px_rgba(242,116,56,0.20)]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
                  <Newspaper className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black">Читайте ще</h2>
              </div>

              <div className="space-y-3">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/report-and-news/${item.id}`}
                    className="group grid grid-cols-[86px_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 transition hover:-translate-y-0.5 hover:border-primary/70 hover:bg-white/[0.10] hover:shadow-[0_18px_45px_rgba(242,116,56,0.18)]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-full rounded-xl object-cover"
                    />
                    <span className="min-w-0 py-1">
                      <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-orange-200 transition group-hover:text-primary">
                        {item.category}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm font-black leading-5 text-white transition group-hover:text-orange-100">
                        {item.title}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                href="/report-and-news"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:shadow-[0_18px_45px_rgba(242,116,56,0.22)]"
              >
                Усі новини
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <div className="pb-10" />
    </main>
  )
}

function BackLink() {
  return (
    <Link
      href="/report-and-news"
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-primary/30 bg-white/90 px-4 py-2.5 text-sm font-extrabold text-primary shadow-[0_16px_45px_rgba(242,116,56,0.12)] backdrop-blur transition hover:border-primary active:scale-[0.98]"
    >
      <span className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
      <ArrowLeft className="relative z-10 h-4 w-4 transition group-hover:text-white" />
      <span className="relative z-10 transition group-hover:text-white">
        До новин
      </span>
    </Link>
  )
}

function RelatedAnimalPreview({
  relatedAnimal,
}: {
  relatedAnimal:
    | {
        id: string
        name: string
        age: string
        gender: string
        imageUrl: string
      }
    | undefined
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-3 shadow-soft transition hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(242,116,56,0.12)]">
      <p className="px-1 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
        Тварина з історії
      </p>
      {relatedAnimal ? (
        <Link
          href={`/animals/${relatedAnimal.id}`}
          className="group mt-3 grid grid-cols-[82px_1fr] gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-2 transition hover:border-primary hover:bg-white"
        >
          <span className="overflow-hidden rounded-lg">
            <img
              src={relatedAnimal.imageUrl}
              alt={relatedAnimal.name}
              className="h-24 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </span>
          <span className="flex min-w-0 flex-col justify-center">
            <span className="block text-lg font-black leading-6 text-gray-950 transition group-hover:text-primary">
              {relatedAnimal.name}
            </span>
            <span className="mt-1 block text-sm font-semibold text-gray-600">
              {relatedAnimal.age} · {relatedAnimal.gender}
            </span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary">
              Профіль тварини
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      ) : (
        <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="font-black text-gray-500">Профіль тварини недоступний</p>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Посилання на тварину тимчасово вимкнене.
          </p>
        </div>
      )}
    </div>
  )
}

function NewsBlock({ block }: { block: NewsContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-[1.0625rem] leading-9 text-gray-700 sm:text-lg">
          {block.text}
        </p>
      )

    case 'image':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-soft transition hover:border-orange-200 hover:shadow-[0_20px_55px_rgba(242,116,56,0.14)]">
          <LightboxImage
            image={{
              src: block.src,
              alt: block.alt,
            }}
            buttonClassName="w-full cursor-zoom-in"
            imageClassName={`${getBlockHeightClass(block.height)} w-full object-cover`}
          />
          {block.caption && (
            <figcaption className="border-t border-gray-100 px-5 py-4 text-sm font-semibold text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'video':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-gray-900 bg-gray-950 shadow-[0_22px_70px_rgba(15,23,42,0.22)] transition hover:border-primary/60 hover:shadow-[0_24px_70px_rgba(242,116,56,0.20)]">
          <video
            src={block.src}
            title={block.title}
            controls
            className={`${getBlockHeightClass(block.height)} w-full bg-gray-950 object-cover`}
          />
          {block.caption && (
            <figcaption className="bg-white px-5 py-4 text-sm font-semibold text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'table':
      return (
        <div className="overflow-hidden rounded-[28px] border border-orange-200 bg-orange-50/70 shadow-soft transition hover:border-primary/50 hover:shadow-[0_20px_55px_rgba(242,116,56,0.14)]">
          {block.title && (
            <h3 className="px-5 pt-5 text-xl font-black text-gray-950">
              {block.title}
            </h3>
          )}
          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[520px] border-collapse bg-white text-left">
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th
                      key={column}
                      className="border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-gray-500"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={row.join('-')}>
                    {row.map((cell) => (
                      <td
                        key={`${rowIndex}-${cell}`}
                        className="border border-orange-100 bg-white px-4 py-4 font-semibold text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'buttons':
      return (
        <div className="flex flex-col gap-3 rounded-[28px] border border-orange-100 bg-orange-50/70 p-4 shadow-soft transition hover:border-orange-200 hover:shadow-[0_20px_55px_rgba(242,116,56,0.14)] sm:flex-row">
          {block.buttons.map((button) => (
            <Link
              key={`${button.href}-${button.label}`}
              href={button.href}
              className={
                button.variant === 'outline'
                  ? 'btn-outline inline-flex flex-1 items-center justify-center text-center'
                  : 'btn-primary inline-flex flex-1 items-center justify-center text-center'
              }
            >
              {button.label}
            </Link>
          ))}
        </div>
      )

    case 'gallery':
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {block.images.map((image, index) => (
            <LightboxImage
              key={image.src}
              image={image}
              images={block.images}
              index={index}
              buttonClassName="group cursor-zoom-in overflow-hidden rounded-[24px] border border-orange-100 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_18px_45px_rgba(242,116,56,0.16)]"
              imageClassName="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ))}
        </div>
      )

    case 'slider':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-soft transition hover:border-orange-200 hover:shadow-[0_20px_55px_rgba(242,116,56,0.14)]">
          <NewsImageSlider
            images={block.images}
            className={getBlockHeightClass(block.height)}
          />
          {block.caption && (
            <figcaption className="border-t border-gray-100 px-5 py-4 text-sm font-semibold text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
  }
}

function getBlockWidthClass(width: NewsContentBlock['width']) {
  switch (width) {
    case 'narrow':
      return 'mx-auto max-w-3xl'
    case 'medium':
      return 'mx-auto max-w-4xl'
    case 'wide':
      return 'mx-auto max-w-5xl'
    case 'full':
      return 'w-full'
    default:
      return 'mx-auto max-w-4xl'
  }
}

function getBlockHeightClass(height: NewsContentBlock['height']) {
  switch (height) {
    case 'small':
      return 'h-[240px] sm:h-[300px]'
    case 'large':
      return 'h-[420px] sm:h-[560px]'
    case 'medium':
    default:
      return 'h-[320px] sm:h-[420px]'
  }
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-4 shadow-soft transition hover:border-orange-200 hover:shadow-[0_18px_45px_rgba(242,116,56,0.12)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-gray-400">
          {label}
        </span>
        <span className="mt-0.5 block font-black text-gray-950">{value}</span>
      </span>
    </div>
  )
}
