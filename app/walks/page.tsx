import type { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRight,
  CalendarHeart,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Leaf,
  PawPrint,
  ShieldCheck,
  Smile,
  Sparkles,
} from 'lucide-react'

import AnimalCard from '@/components/AnimalCard'
import { LinkButton } from '@/components/ui/Button'
import { getPublicAnimals } from '@/lib/animals'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Прогулянки з тваринами',
  description:
    'Запрошуємо на прогулянки з тваринами центру. Оберіть хвостика, подаруйте увагу і проведіть час поруч.',
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
  const { animals } = await getPublicAnimals({ from: 0, to: 2 }, 3)

  return (
    <main className="bg-[#fffaf4] text-text-main">
      <section className="overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-336 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary shadow-sm">
              <PawPrint className="h-4 w-4" />
              Прогулянки з тваринами
            </div>

            <h1 className="max-w-3xl text-[42px] font-black leading-[1.03] text-text-main sm:text-6xl lg:text-7xl">
              Прогулянка, яку вони запам’ятають
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Подаруйте хвостику радість, а собі - теплу зустріч і гарний настрій.
              Оберіть будь-яку тварину, приходьте у час прогулянок і проведіть поруч
              кілька важливих для неї хвилин.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href={SITE_ROUTES.animals}
                size="lg"
                className="h-13 w-full rounded-2xl px-6 sm:w-fit"
              >
                Обрати тварину
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href={SITE_ROUTES.contactsSchedule}
                variant="outline"
                size="lg"
                className="h-13 w-full rounded-2xl bg-white px-6 sm:w-fit"
              >
                Графік прогулянок
              </LinkButton>
            </div>

            <div className="mt-8 grid gap-3 text-sm font-extrabold text-gray-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                Свіже повітря
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                Добрі руки
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                Спокійний темп
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[34px] border-8 border-white bg-gray-100 shadow-[0_32px_90px_rgba(31,41,55,0.16)]">
              <div className="relative aspect-[1.22] min-h-[340px]">
                <Image
                  src="/DogHelp.png"
                  alt="Тварина чекає на прогулянку"
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 left-4 right-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_20px_60px_rgba(31,41,55,0.14)] sm:left-8 sm:right-8">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-black leading-tight text-text-main">
                    Ваша увага - їхнє щастя
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Кілька годин поруч допомагають тваринам довіряти людям і легше
                    знаходити майбутню родину.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-336 gap-4 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.title}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-black text-text-main">{benefit.title}</h2>
                <p className="mt-3 leading-7 text-gray-600">{benefit.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-336 rounded-[32px] border border-orange-100 bg-white p-5 shadow-[0_24px_80px_rgba(31,41,55,0.06)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                Як це працює
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-text-main sm:text-4xl">
                Просто, спокійно і з турботою про тварину
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Вам не потрібно мати спеціальний досвід. Команда центру допоможе
                обрати тварину, пояснить правила й підкаже комфортний маршрут.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="grid gap-4 rounded-3xl border border-gray-100 bg-[#fffaf4] p-5 sm:grid-cols-[4rem_1fr] sm:items-start"
                >
                  <span className="text-3xl font-black leading-none text-primary">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-text-main">{step.title}</h3>
                    <p className="mt-2 leading-7 text-gray-600">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-336">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                Оберіть формат
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-text-main sm:text-4xl">
                Прогулянка може бути різною
              </h2>
            </div>
            <LinkButton
              href={SITE_ROUTES.contacts}
              variant="outline"
              className="w-full rounded-xl bg-white sm:w-fit"
            >
              Поставити питання
            </LinkButton>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {walkTypes.map((type) => {
              const Icon = type.icon

              return (
                <article
                  key={type.title}
                  className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1fff8] text-secondary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-text-main">{type.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{type.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {animals.length > 0 && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-336 rounded-[32px] border border-orange-100 bg-white p-5 shadow-[0_24px_80px_rgba(31,41,55,0.06)] sm:p-8 lg:p-10">
            <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                  Вони вже чекають
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-text-main sm:text-4xl">
                  Познайомтеся з майбутнім компаньйоном
                </h2>
              </div>
              <LinkButton
                href={SITE_ROUTES.animals}
                variant="outline"
                className="w-full rounded-xl sm:w-fit"
              >
                Усі тварини
              </LinkButton>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {animals.map((animal, index) => (
                <AnimalCard key={animal.id} animal={animal} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-18 lg:px-8">
        <div className="mx-auto max-w-336 rounded-[32px] border border-orange-100 bg-text-main p-6 text-white shadow-[0_28px_90px_rgba(31,41,55,0.18)] sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-100">
              <Clock3 className="h-4 w-4" />
              {SITE_CONTACTS.walkSchedule}
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              Заплануйте прогулянку на найближчі вихідні
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Приходьте самі, з друзями або родиною. Для тварин це не просто
              прогулянка, а шанс відчути людську увагу й довіру.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <LinkButton
              href={SITE_CONTACTS.phoneHref}
              size="lg"
              className="h-13 w-full rounded-2xl px-6 lg:w-64"
            >
              Подзвонити
            </LinkButton>
            <LinkButton
              href={SITE_ROUTES.contacts}
              variant="light"
              size="lg"
              className="h-13 w-full rounded-2xl px-6 lg:w-64"
            >
              Контакти центру
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="sr-only" aria-label="Важливі умови прогулянок">
        <h2>Що важливо знати перед прогулянкою</h2>
        <ul>
          <li>
            <CheckCircle2 /> Дотримуйтеся порад працівників центру.
          </li>
          <li>
            <CheckCircle2 /> Не відпускайте тварину без дозволу.
          </li>
          <li>
            <CheckCircle2 /> Обирайте комфортний темп для конкретної тварини.
          </li>
        </ul>
      </section>
    </main>
  )
}
