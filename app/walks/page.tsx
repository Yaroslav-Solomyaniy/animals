import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, HeartHandshake, Leaf, PawPrint, ShieldCheck, Smile, Sparkles } from 'lucide-react'
import { Button, LinkButton } from '@/components/ui/Button'
import DotGrid from '@/components/ui/DotGrid'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import Section from '@/components/ui/Section'
import BorderGlow from '@/components/ui/BorderGlow'
import GoWalks from '@/components/GoWalks'
import { WalkOrderDialog } from '@/components/WalkOrderDialog'

export const metadata: Metadata = {
  title: 'Прогулянки з тваринами',
  description: 'Запрошуємо на прогулянки з тваринами центру. Оберіть хвостика, подаруйте увагу і проведіть час поруч.',
}

const benefits = [
  {
    icon: Smile,
    title: 'Для вас',
    text: 'Свіже повітря, живий контакт і теплий настрій після зустрічі з хвостиком.',
  },
  {
    icon: HeartHandshake,
    title: 'Для тварини',
    text: 'Менше самотності, більше довіри до людей і спокійний час поза вольєром.',
  },
  {
    icon: Leaf,
    title: 'Для знайомства',
    text: 'Прогулянка допомагає побачити характер тварини без поспіху.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Оберіть хвостика',
    text: 'Подивіться каталог або запитайте команду, кому сьогодні найбільше потрібна прогулянка.',
  },
  {
    number: '02',
    title: 'Узгодьте час',
    text: `Прогулянки проходять ${SITE_CONTACTS.walkSchedule.toLowerCase()}. За можливості краще попередити про візит.`,
  },
  {
    number: '03',
    title: 'Гуляйте поруч',
    text: 'Ми підкажемо правила, маршрут і темп, щоб прогулянка була комфортною для вас і тварини.',
  },
]

const walkTypes = [
  {
    icon: PawPrint,
    title: 'Активна прогулянка',
    text: 'Для енергійних собак, яким важливо побігати, пограти й випустити емоції.',
  },
  {
    icon: Leaf,
    title: 'Спокійний темп',
    text: 'Для лагідних, старших або обережних тварин, яким потрібні тиша і м’який контакт.',
  },
  {
    icon: ShieldCheck,
    title: 'Знайомство перед адопцією',
    text: 'Якщо ви придивляєтесь до друга, прогулянка допоможе відчути, чи ви підходите одне одному.',
  },
]

export default async function WalksPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#f0e3d8"
          activeColor="#f27438"
          proximity={110}
          shockRadius={180}
          shockStrength={2.5}
          resistance={800}
          returnDuration={1.2}
        />
      </div>
      <Section className="overflow-hidden py-5 sm:py-6 lg:py-18" innerClassName="grid min-w-0 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary shadow-sm">
              <PawPrint className="h-4 w-4" />
              Прогулянки з тваринами
            </div>

            <h1 className="max-w-3xl text-[28px] font-black leading-[1.15] text-text-main sm:text-4xl sm:leading-tight lg:text-5xl">
              Прогулянка, яку вони запам’ятають
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
              Подаруйте хвостику радість, а собі - теплу зустріч і гарний настрій. Оберіть будь-яку тварину, приходьте у час прогулянок і
              проведіть поруч кілька важливих для неї хвилин.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <WalkOrderDialog
                trigger={
                  <Button variant="secondary" size="lg" showIcon={false} className="w-full rounded-2xl text-sm sm:w-fit">
                    Запланувати прогулянку
                  </Button>
                }
              />
              <LinkButton href={SITE_ROUTES.contacts} size="lg" className="h-13 w-full rounded-2xl px-6 text-sm sm:w-fit">
                Поставити запитання
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="relative overflow-hidden rounded-[34px] border-8 border-white bg-gray-100  shadow-[0_32px_90px_rgba(31,41,55,0.16)]">
              <div className="relative aspect-16/10 min-h-75 sm:min-h-90 lg:min-h-110">
                <Image
                  src="/WithDog.png"
                  alt="Людина гуляє з собакою у парку"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="relative z-10 mx-3 -mt-12 overflow-hidden rounded-3xl border border-orange-100 bg-white/94 p-5 backdrop-blur sm:absolute sm:-bottom-8 sm:left-8 sm:right-8 sm:mx-0">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-black leading-tight text-text-main">Ваша увага - їхнє щастя</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Кілька годин поруч допомагають тваринам довіряти людям і легше знаходити майбутню родину.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </Section>

      <Section className="pb-5 pt-5 sm:pb-6 sm:pt-6 lg:pb-8 lg:pt-8" innerClassName="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <BorderGlow key={benefit.title} borderRadius={24} colors={['orange']} edgeSensitivity={110} fillOpacity={1}>
                <article className="rounded-3xl bg-white p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-xl font-black text-text-main">{benefit.title}</h2>
                  <p className="mt-3 leading-7 text-gray-600">{benefit.text}</p>
                </article>
              </BorderGlow>
            )
          })}
      </Section>

      <Section className="py-5 sm:py-6 lg:py-8" innerClassName="rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_24px_80px_rgba(31,41,55,0.06)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">Як це працює</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-text-main sm:text-4xl">
                Просто, спокійно і з турботою про тварину
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Вам не потрібно мати спеціальний досвід. Команда центру допоможе обрати тварину, пояснить правила й підкаже комфортний
                маршрут.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="grid gap-4 rounded-3xl border-2 border-gray-100 bg-[#fffaf4] p-5 sm:grid-cols-[4rem_1fr] sm:items-start"
                >
                  <span className="text-3xl font-black leading-none text-primary">{step.number}</span>
                  <div>
                    <h3 className="text-xl font-black text-text-main">{step.title}</h3>
                    <p className="mt-2 leading-7 text-gray-600">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </Section>

      <Section className="py-5 sm:py-6 lg:py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">Оберіть формат</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-text-main sm:text-4xl">Прогулянка може бути різною</h2>
            </div>
            <LinkButton href={SITE_ROUTES.contacts} variant="outline" size="lg" className="w-full rounded-2xl bg-white text-sm sm:w-fit">
              Поставити питання
            </LinkButton>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {walkTypes.map((type) => {
              const Icon = type.icon

              return (
                <article key={type.title} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1fff8] text-secondary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-text-main">{type.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{type.text}</p>
                </article>
              )
            })}
          </div>
      </Section>

      <GoWalks />
    </main>
  )
}
