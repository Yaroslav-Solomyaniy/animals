import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock3,
  Heart,
  Newspaper,
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

  const relatedNews = getRelatedNews(article.id)
  const relatedAnimal = article.relatedAnimalId
    ? MOCK_ANIMALS.find((animal) => animal.id === article.relatedAnimalId)
    : undefined

  return (
    <main className="storybook-bg min-h-screen px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <StorybookDecorations />

      <div className="mx-auto mb-5 max-w-7xl">
        <Link
          href="/report-and-news"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-primary bg-white px-5 py-3 font-bold text-primary shadow-[0_16px_45px_rgba(242,116,56,0.14)] transition active:scale-[0.98]"
        >
          <span className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
          <ArrowLeft className="relative z-10 h-4 w-4 transition group-hover:text-white" />
          <span className="relative z-10 transition group-hover:text-white">
            До новин
          </span>
        </Link>
      </div>

      <SectionFrame className="mx-auto max-w-7xl overflow-hidden p-3 sm:p-4 lg:p-6">
        <article className="grid gap-7 lg:grid-cols-[minmax(0,0.95fr)_360px]">
          <div className="overflow-hidden rounded-[32px] bg-white">
            <div className="relative h-[360px] overflow-hidden sm:h-[420px] lg:h-[500px]">
              <LightboxImage
                image={{
                  src: article.image,
                  alt: article.title,
                }}
                buttonClassName="absolute inset-0 cursor-zoom-in"
                imageClassName="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.88))]" />

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-extrabold text-primary shadow-soft">
                  <Newspaper className="h-4 w-4" />
                  {article.category}
                </span>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/82">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <ShareMenu
              path={`/report-and-news/${article.id}`}
              title={article.title}
              text={article.excerpt}
              label="Поділитись новиною"
              className="w-full"
            />

            <div className="rounded-[28px] border border-orange-100 bg-orange-50/70 p-5 shadow-soft">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                Деталі
              </p>
              <div className="mt-5 grid gap-3">
                <InfoLine icon={Calendar} label="Дата" value={article.date} />
                <InfoLine
                  icon={Clock3}
                  label="Час"
                  value={`${article.publishedTime} · ${article.readingTime}`}
                />
              </div>
            </div>

            {article.relatedAnimalId && (
              <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
                  Тварина з історії
                </p>
                {relatedAnimal ? (
                  <Link
                    href={`/animals/${relatedAnimal.id}`}
                    className="group mt-4 grid grid-cols-[92px_1fr] gap-4 rounded-2xl border border-orange-100 bg-orange-50/70 p-2 transition hover:-translate-y-0.5 hover:border-primary"
                  >
                    <img
                      src={relatedAnimal.imageUrl}
                      alt={relatedAnimal.name}
                      className="h-24 w-full rounded-xl object-cover"
                    />
                    <span className="py-1">
                      <span className="block text-lg font-black text-gray-950 transition group-hover:text-primary">
                        {relatedAnimal.name}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-gray-600">
                        {relatedAnimal.age} · {relatedAnimal.gender}
                      </span>
                      <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold text-primary">
                        Переглянути профіль
                      </span>
                    </span>
                  </Link>
                ) : (
                  <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="font-black text-gray-500">
                      Профіль тварини недоступний
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Новину залишаємо як архівну історію, але посилання на
                      тварину вимкнене, бо її вже немає в каталозі.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Heart className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black">Допомогти центру</h2>
              </div>
              <p className="text-sm leading-6 text-gray-600">
                Кожна підтримка допомагає лікувати, годувати й знаходити дім
                для тварин, які зараз у безпеці центру.
              </p>
              <Link
                href="/help-for-us"
                className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2"
              >
                Підтримати
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </article>

        <div className="px-2 py-8 sm:px-4 lg:px-6 lg:py-10">
          <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-soft sm:p-8 lg:p-10">
            <div className="space-y-7">
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
        </div>
      </SectionFrame>

      <section className="mx-auto mt-10 max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
              Більше історій
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">
              Ще новини
            </h2>
          </div>
          <Link
            href="/report-and-news"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-primary bg-white px-5 py-3 font-bold text-primary shadow-[0_16px_45px_rgba(242,116,56,0.14)] transition active:scale-[0.98]"
          >
            <span className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            <span className="relative z-10 transition group-hover:text-white">
              Всі новини
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:text-white" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {relatedNews.map((item) => (
            <Link
              key={item.id}
              href={`/report-and-news/${item.id}`}
              className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-soft transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-primary">
                  {item.category}
                </span>
                <h3 className="mt-4 text-xl font-black leading-7 text-gray-950 transition group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function NewsBlock({ block }: { block: NewsContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-lg leading-9 text-gray-700">{block.text}</p>

    case 'image':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-gray-100 bg-gray-50">
          <LightboxImage
            image={{
              src: block.src,
              alt: block.alt,
            }}
            buttonClassName="w-full cursor-zoom-in"
            imageClassName={`${getBlockHeightClass(block.height)} w-full object-cover`}
          />
          {block.caption && (
            <figcaption className="px-5 py-4 text-sm font-semibold text-gray-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'video':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-gray-100 bg-gray-950">
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
        <div className="overflow-hidden rounded-[28px] border border-orange-200 bg-orange-50/50">
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
        <div className="flex flex-col gap-3 rounded-[28px] border border-gray-100 bg-gray-50 p-4 sm:flex-row">
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
              buttonClassName="cursor-zoom-in rounded-[24px] border border-gray-100 shadow-soft"
              imageClassName="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ))}
        </div>
      )

    case 'slider':
      return (
        <figure className="overflow-hidden rounded-[28px] border border-gray-100 bg-gray-50">
          <NewsImageSlider
            images={block.images}
            className={getBlockHeightClass(block.height)}
          />
          {block.caption && (
            <figcaption className="px-5 py-4 text-sm font-semibold text-gray-500">
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
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white p-4">
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
