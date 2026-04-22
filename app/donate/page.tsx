import Link from 'next/link'
import { ArrowLeft, Heart, PawPrint } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionFrame from '@/components/SectionFrame'
import StorybookDecorations from '@/components/StorybookDecorations'
import { MOCK_ANIMALS } from '@/mockData'

const TREAT_AMOUNTS = [50, 100, 250, 500]


type DonatePageProps = {
  searchParams: Promise<{
    animalId?: string
    gift?: string
  }>
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const { animalId = '', gift = 'general' } = await searchParams
  const animal = MOCK_ANIMALS.find((item) => item.id === animalId)
  const isTreatGift = gift === 'treat'
  const targetName = animal?.name ?? 'тварин центру'

  return (
    <main className="storybook-bg min-h-screen">
      <StorybookDecorations />
      <PageHero
        eyebrow={isTreatGift ? 'Смаколик для друга' : 'Підтримка центру'}
        title="Оберіть суму турботи"
        description="Кошти підуть на їжу, ласощі, догляд та базові потреби. Якщо ви перейшли з картки тварини, донат буде прив'язаний саме до неї."
        icon={PawPrint}
      >
        <div className="orange-neon overflow-hidden rounded-[24px] bg-gray-950">
          <div className="relative aspect-[4/5] overflow-hidden">
            {animal ? (
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="h-full w-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary/10">
                <PawPrint className="h-20 w-20 text-secondary" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-white/80">
                {isTreatGift ? 'Смаколик для' : 'Підтримка для'}
              </p>
              <h2 className="text-4xl font-extrabold text-white">
                {targetName}
              </h2>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          href="/animals"
          className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до тварин
        </Link>

        <SectionFrame className="p-5 sm:p-8 lg:p-10">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-600">
            <PawPrint className="h-4 w-4" />
            {isTreatGift ? 'Донат на смаколик' : 'Донат на допомогу'}
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TREAT_AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                className="rounded-2xl border border-gray-100 bg-white px-4 py-4 text-lg font-extrabold text-text-main shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-primary"
              >
                {amount} грн
              </button>
            ))}
          </div>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-bold text-gray-500">
              Інша сума
            </span>
            <input
              type="number"
              min="1"
              placeholder="Наприклад, 150"
              className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-base font-bold text-text-main shadow-sm outline-none transition-all placeholder:text-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-7 py-4 text-base font-extrabold text-white shadow-primary transition-all hover:bg-secondary hover:shadow-lg sm:w-fit"
          >
            <Heart className="h-5 w-5" />
            {isTreatGift ? 'Задонатити смаколик' : 'Підтримати центр'}
          </button>
        </SectionFrame>
      </section>
    </main>
  )
}
