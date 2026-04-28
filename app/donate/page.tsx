import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Bone,
  CreditCard,
  Heart,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button, LinkButton } from '@/components/ui/Button'
import { MOCK_ANIMALS } from '@/mockData'
import { Input, Select, Textarea } from '@/components/ui/FormControls'

const TREAT_AMOUNTS = [50, 100, 250, 500]
const GENERAL_AMOUNTS = [200, 500, 1000, 1500]

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
  const amounts = isTreatGift ? TREAT_AMOUNTS : GENERAL_AMOUNTS

  return (
    <main className="storybook-bg min-h-screen text-text-main">
      <StorybookDecorations />

      <section className="relative z-10 mx-auto max-w-[calc(80rem+4rem)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <LinkButton
          href="/animals"
          variant="light"
          size="sm"
          className="mb-6 w-fit backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
          До каталогу
        </LinkButton>

        <SectionFrame className="overflow-hidden rounded-[28px] p-0">
          <div className="grid min-h-[680px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[420px] overflow-hidden bg-gray-950 lg:min-h-full">
              {animal ? (
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  className="h-full w-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-secondary/10">
                  <PawPrint className="h-24 w-24 text-secondary" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/35 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-xs font-extrabold text-text-main backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {isTreatGift ? 'Смаколик для' : 'Підтримка для'}
                </span>

                <h1 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
                  {targetName}
                </h1>

                {animal && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <InfoChip>{animal.age}</InfoChip>
                    <InfoChip>{animal.gender}</InfoChip>
                    <InfoChip>{animal.size}</InfoChip>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col p-5 sm:p-7 lg:p-9">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-600">
                    {isTreatGift ? (
                      <Bone className="h-4 w-4" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                    {isTreatGift ? 'Дати смаколик' : 'Підтримати центр'}
                  </div>
                  <h2 className="max-w-xl text-3xl font-black leading-tight text-text-main">
                    {isTreatGift
                      ? 'Оберіть суму для маленької радості'
                      : 'Оберіть суму допомоги'}
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-gray-500">
                    {isTreatGift
                      ? 'Донат буде привʼязаний до цієї тварини: ласощі, корм або дрібна покупка для догляду.'
                      : 'Ваш внесок піде на корм, ліки, обробки й щоденний догляд за тваринами.'}
                  </p>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl bg-[#F1FFF8] px-4 py-3 text-sm font-extrabold text-secondary">
                  <ShieldCheck className="h-4 w-4" />
                  Призначення є
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {amounts.map((amount, index) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={index === 1 ? 'primary' : 'outline'}
                    className="h-16 text-lg"
                  >
                    {amount} грн
                  </Button>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-500">
                    Інша сума
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Наприклад, 150"
                    className="h-14 w-full rounded-2xl border border-gray-100 bg-white px-5 text-base font-bold text-text-main shadow-sm outline-none transition-all placeholder:text-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-500">
                    Валюта
                  </span>
                  <Select className="h-14 bg-white px-5 text-base font-bold">
                    <option>UAH</option>
                    <option>EUR</option>
                    <option>USD</option>
                  </Select>
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-bold text-gray-500">
                  Коментар
                </span>
                <Textarea
                  rows={3}
                  defaultValue={
                    animal
                      ? `Смаколик для ${animal.name}`
                      : 'Підтримка центру допомоги тваринам'
                  }
                  className="bg-white px-5 py-4 text-sm font-bold leading-6"
                />
              </label>

              <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                <Button
                  type="button"
                  size="lg"
                  className="h-14 text-base"
                >
                  <CreditCard className="h-5 w-5" />
                  Оплатити
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-14 text-base"
                >
                  <Banknote className="h-5 w-5" />
                  Реквізити
                </Button>
              </div>

              <div className="mt-auto pt-7">
                <div className="grid gap-3 md:grid-cols-3">
                  <SupportItem
                    icon={Bone}
                    title={isTreatGift ? 'Ласощі' : 'Корм'}
                    text={isTreatGift ? 'Смаколики та корм.' : 'Щоденне харчування.'}
                  />
                  <SupportItem
                    icon={BadgeCheck}
                    title="Догляд"
                    text="Гігієна і базові потреби."
                  />
                  <SupportItem
                    icon={ShieldCheck}
                    title="Здоров'я"
                    text="Ліки, обробки, щеплення."
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-extrabold text-text-main backdrop-blur">
      {children}
    </span>
  )
}

function SupportItem({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-gray-50 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-extrabold text-text-main">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {text}
        </span>
      </span>
    </div>
  )
}
