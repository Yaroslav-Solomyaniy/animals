import { Suspense } from 'react'
import { ArrowRight, Calendar } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { getPublishedNewsPaginated } from '@/lib/public-news'
import { buildNewsHref } from '@/lib/site-config'
import { searchParamsCache } from './search-params'
import Pagination from './Pagination'

const PAGE_SIZE = 6

export default async function NewsGrid({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const { page: currentPage, order } = await searchParamsCache.parse(searchParams)
  const { news, total } = await getPublishedNewsPaginated(currentPage, PAGE_SIZE, order)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (news.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-orange-200 bg-orange-50/70 p-8 text-center">
        <p className="text-lg font-black text-gray-950">Новин поки немає</p>
        <p className="mt-2 text-gray-600">
          Опублікуй першу новину в адмінці, і вона зʼявиться тут автоматично.
        </p>
      </div>
    )
  }

  return (
    <>
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
                <h3 className="text-2xl font-black leading-tight text-gray-950">{item.title}</h3>
                <p className="mt-4 mb-7 leading-7 text-gray-600">{item.excerpt}</p>
                <LinkButton
                  href={buildNewsHref(item.slug ?? item.id)}
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
      <Suspense>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </>
  )
}
