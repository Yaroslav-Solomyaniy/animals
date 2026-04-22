import Link from 'next/link'
import { ArrowRight, Dog } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionFrame from '@/components/SectionFrame'
import StorybookDecorations from '@/components/StorybookDecorations'


export default function DogsPage() {
  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />
      <PageHero
        eyebrow="Каталог тварин"
        title="Усі хвостики тепер в одному каталозі"
        description="Ми об'єднали сторінку собак із загальним каталогом, щоб фільтри, картки та історії тварин були в одному зручному місці."
        icon={Dog}
        actions={
          <Link
            href="/animals"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
          >
            Перейти до каталогу
            <ArrowRight className="h-5 w-5" />
          </Link>
        }
      >
        <SectionFrame className="rounded-[28px] p-6 text-center">
          <Dog className="mx-auto mb-4 h-12 w-12 text-orange-500" />
          <h2 className="text-2xl font-black text-gray-950">
            Картки, фільтри й сторінки каталогу вже чекають
          </h2>
          <p className="mt-3 leading-7 text-gray-600">
            Натисніть кнопку, щоб відкрити повний список тварин.
          </p>
        </SectionFrame>
      </PageHero>
    </main>
  )
}
