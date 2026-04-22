import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Heart,
  Package,
  Phone,
  Users,
} from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'


const helpWays = [
  {
    icon: DollarSign,
    title: 'Фінансова допомога',
    text: 'Донати закривають корм, лікування, вакцинацію, стерилізацію та щоденний догляд.',
    tone: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  {
    icon: Users,
    title: 'Волонтерство',
    text: 'Вигул, соціалізація, фото, допомога на подіях і підтримка тварин поруч.',
    tone: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  {
    icon: Package,
    title: 'Матеріальна допомога',
    text: 'Корм, підстилки, іграшки, амуніція, засоби гігієни та ветеринарні препарати.',
    tone: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
]

const donationOptions = [
  { amount: 100, description: 'корм або смаколики для підопічних' },
  { amount: 500, description: 'вакцинація та базовий догляд' },
  { amount: 1000, description: 'підтримка лікування чи стерилізації' },
  { amount: 2500, description: 'місячна допомога центру' },
]

const supplies = [
  'Сухий корм для собак та котів',
  'Консерви та вологий корм',
  'Миски для їжі та води',
  'Лежанки та підстилки',
  'Іграшки для тварин',
  'Ветеринарні препарати',
  'Засоби гігієни та догляду',
  'Повідці, нашийники, шлеї',
]

const volunteerRoles = [
  {
    title: 'Прогулянки з собаками',
    description: 'Щовихідних з 11:00 до 14:00 за попереднім записом.',
    time: '2-3 години',
  },
  {
    title: 'Соціалізація тварин',
    description:
      'Спокійне спілкування, ігри та допомога тваринам звикати до людей.',
    time: 'Гнучко',
  },
  {
    title: 'Фото та відео',
    description: 'Контент для соцмереж, щоб тварини швидше знаходили родини.',
    time: 'За домовленістю',
  },
  {
    title: 'Транспортна допомога',
    description: 'Перевезення тварин або необхідних речей у межах міста.',
    time: 'За потреби',
  },
]

export default function HelpForUsPage() {
  return (
    <main className="storybook-bg min-h-screen text-gray-950">
      <StorybookDecorations />
      <PageHero
        eyebrow="Кожна допомога має значення"
        title="Як ви можете допомогти"
        description="Ваш внесок допомагає центру щодня годувати, лікувати, вигулювати та соціалізувати тварин, які чекають на безпечне життя."
        icon={Heart}
      >
        <div className="grid gap-4 rounded-[24px] bg-white p-2 md:grid-cols-3">
          {helpWays.map((way) => {
            const Icon = way.icon
            return (
              <article
                key={way.title}
                className="rounded-[20px] border border-gray-100 bg-gray-50 p-5 text-center"
              >
                <span
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border ${way.tone}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="text-base font-black text-gray-950">
                  {way.title}
                </h2>
              </article>
            )
          })}
        </div>
      </PageHero>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionFrame className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {helpWays.map((way) => {
                const Icon = way.icon
                return (
                  <article
                    key={way.title}
                    className="rounded-[32px] border border-gray-100 bg-white p-8 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
                  >
                    <span
                      className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${way.tone}`}
                    >
                      <Icon className="h-8 w-8" />
                    </span>
                    <h2 className="text-2xl font-black text-gray-950">
                      {way.title}
                    </h2>
                    <p className="mt-3 leading-7 text-gray-600">{way.text}</p>
                  </article>
                )
              })}
            </div>
          </SectionFrame>

          <SectionFrame as="section" className="mt-16 p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-4xl text-center">
              <Heart
                className="mx-auto mb-4 h-12 w-12 text-orange-500"
                fill="currentColor"
              />
              <h2 className="text-3xl font-black text-gray-950">
                Фінансова підтримка
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Оберіть комфортну суму або зробіть довільний внесок. Тут кожна
                гривня дуже швидко перетворюється на конкретну турботу.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {donationOptions.map((option) => (
                <button
                  key={option.amount}
                  className="rounded-[24px] border-2 border-white bg-white p-6 text-center transition hover:border-orange-300 hover:bg-orange-50"
                >
                  <span className="block text-3xl font-black text-gray-950">
                    {option.amount} грн
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-gray-600">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-gray-100 bg-white p-6">
              <h3 className="font-bold text-gray-950">
                Реквізити для переказу
              </h3>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-gray-500">Назва організації</p>
                  <p className="mt-1 font-semibold text-gray-950">
                    Центр допомоги безпритульним тваринам
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-gray-500">Рахунок</p>
                  <p className="mt-1 font-semibold text-gray-950">
                    UA00 0000 0000 0000 0000 0000 000
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-gray-500">Призначення</p>
                  <p className="mt-1 font-semibold text-gray-950">
                    Благодійна допомога тваринам
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-gray-500">Уточнення</p>
                  <p className="mt-1 font-semibold text-gray-950">
                    Актуальні реквізити підтвердіть телефоном
                  </p>
                </div>
              </div>
            </div>
          </SectionFrame>

          <SectionFrame as="section" className="mt-16 grid gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:p-8">
            <div className="rounded-[36px] border border-gray-100 bg-white p-6 sm:p-8">
              <div className="mb-8 max-w-2xl">
                <Users className="mb-4 h-10 w-10 text-orange-500" />
                <h2 className="text-3xl font-black text-gray-950">
                  Станьте волонтером
                </h2>
                <p className="mt-4 leading-7 text-gray-600">
                  Найпростіший формат для старту - записатися на вихідні
                  прогулянки. Це допомагає тваринам залишатися активними,
                  спокійнішими та краще соціалізованими.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {volunteerRoles.map((role) => (
                  <article
                    key={role.title}
                    className="rounded-[24px] border border-gray-100 bg-gray-50 p-5"
                  >
                    <h3 className="text-xl font-bold text-gray-950">
                      {role.title}
                    </h3>
                    <p className="mt-2 leading-7 text-gray-600">
                      {role.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
                      <Clock className="h-4 w-4" />
                      {role.time}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-orange-100 bg-orange-50/70 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-gray-950">
                Як долучитися
              </h2>
              <ol className="mt-6 space-y-4">
                {[
                  'Зателефонуйте або залиште заявку через контакти.',
                  'Узгодьте день, формат допомоги та короткий інструктаж.',
                  'Приходьте у зручний час і допомагайте разом з командою.',
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="pt-1 leading-7 text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
              <Link
                href="/contacts"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Перейти до контактів
              </Link>
            </div>
          </SectionFrame>

          <SectionFrame as="section" className="mt-16 p-6 sm:p-8">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <Package className="mx-auto mb-4 h-11 w-11 text-orange-500" />
              <h2 className="text-3xl font-black text-gray-950">
                Необхідні речі
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Ці речі потрібні центру постійно. Їх можна передати особисто або
                погодити доставку телефоном.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {supplies.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] bg-orange-50 p-6 text-center">
              <p className="font-semibold text-gray-800">
                Адреса для передачі допомоги: м. Черкаси, вул. Івана Мазепи, 117
              </p>
              <p className="mt-2 text-gray-600">
                Перед візитом краще зателефонувати, щоб узгодити час.
              </p>
            </div>
          </SectionFrame>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto max-w-7xl p-6 text-center sm:p-8 lg:p-10">
          <h2 className="text-3xl font-black text-gray-950">Маєте питання?</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Зв’яжіться з нами, і ми підкажемо, який формат допомоги буде
            найкориснішим саме зараз.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+380932966097"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
            >
              <Phone className="h-5 w-5" />
              Зателефонувати
            </a>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 font-bold text-gray-950 transition hover:border-orange-300"
            >
              Контакти
            </Link>
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
